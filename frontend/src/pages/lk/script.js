// script.js

const takeImageByType = (type) => {
  switch (type) {
    case "SPORT":
      return "../assets/sport.avif";
    case "MATH":
      return "../assets/math.avif";
    case "SCIENCE":
      return "../assets/sience.avif";
    case "LANGUAGE":
      return "../assets/language.avif";
    case "ART":
      return "../assets/art.jpg";
    case "OTHER":
      return "../assets/other.avif";
    default:
      return "../assets/other.avif";
  }
};
const takeCategoryByType = (type) => {
  switch (type) {
    case "ALL":
      return "Все";
    case "SPORT":
      return "Спорт";
    case "MATH":
      return "Математика";
    case "SCIENCE":
      return "Наука";
    case "LANGUAGE":
      return "Языки";
    case "ART":
      return "Дизайн";
    case "OTHER":
      return "Другое";
    default:
      return "Другое";
  }
};

const deleteCircle = async (circleId, showToast) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/admin/clubs/${circleId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // Преобразуем ответ в JSON
      showToast(errorData.message, "error");
      return;
    }

    const data = await response.json();
    alert(data.message);
    window.location.reload();
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
  }
}

const createNewCircle = async (circleData, showToast) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/clubs/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...circleData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Преобразуем ответ в JSON
      showToast(errorData.message, "error");
      return;
    }

    const data = await response.json();
    alert(data.message);
    window.location.reload();
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
  }
};

const joinUserCircle = async (circleId, showToast) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/clubs/${circleId}/join`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Преобразуем ответ в JSON
      showToast("Не удалось вступить в кружок", "error");
    }

    const data = await response.json();
    alert(data.message);
    window.location.reload();
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
  }
};

const getAllCircles = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/clubs", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json(); // Преобразуем ответ в JSON
    showToast("Не удалось получить список кружков", "error");
  }

  const data = await response.json(); // Преобразуем ответ в JSON

  console.log("Success:", data.clubs); // Обрабатываем успешный ответ
  return data;
};

const leaveUserCircle = async (circleId, showToast) => {
  try {
    // Извлекаем токен
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/clubs/${circleId}/leave`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      showToast("Ошибка при получении кружков юзера", "error");
    }

    const data = await response.json();
    alert(data.message);
    window.location.reload();
    return data;
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
  }
};

const getUserCircles = async () => {
  try {
    // Извлекаем токен
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/clubs/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      showToast("Ошибка при получении кружков юзера", "error");
    }

    const data = await response.json();
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
  }
};

const getProfileData = async () => {
  try {
    // Извлекаем токен
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/user/profile/", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Проверяем наличие ошибок и выводим их
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((error) => {
          showToast(error.message, "error");
        });
        window.location.href = "/";
      } else {
        window.location.href = "/";
        showToast("Произошла ошибка при входе", "error");
      }
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
    window.location.href = "/";
  }
};

const fetchLogout = async () => {
  try {
    // Извлекаем токен
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/auth/logout/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Проверяем наличие ошибок и выводим их
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((error) => {
          showToast(error.message, "error");
        });
      } else {
        showToast("Произошла ошибка при входе", "error");
      }
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    window.location.href = "/";
    localStorage.removeItem("token");
    return data;
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
    // window.location.href = '/';
  }
};

const updateProfile = async (username, avatar) => {
  try {
    // Извлекаем токен
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", username);
    formData.append("avatar", avatar);
    const response = await fetch(
      "http://localhost:5000/api/user/update-info/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      // Проверяем наличие ошибок и выводим их
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((error) => {
          showToast(error.message, "error");
        });
        window.location.href = "/";
      } else {
        window.location.href = "/";
        showToast("Произошла ошибка при входе", "error");
      }
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
    window.location.href = "/";
  }
};

function getRoleName(role) {
  if (role === "admin") {
    return "Администратор";
  }

  return "Участник";
}

document.addEventListener("DOMContentLoaded", function () {
  // Элементы DOM
  const mainContent = document.getElementById("mainContent");
  const dashboardContent = document.getElementById("dashboardContent");
  const otherContent = document.getElementById("otherContent");
  const navLinks = document.querySelectorAll("nav ul li a, .sidebar-menu li a");
  const logoutBtn = document.getElementById("logoutBtn");
  const userAvatarBtn = document.getElementById("userAvatarBtn");
  const editAvatarBtn = document.getElementById("editAvatarBtn");
  const avatarModal = document.getElementById("avatarModal");
  const circleModal = document.getElementById("circleModal");
  const circleModalContent = document.getElementById("circleModalContent");
  const closeModalBtns = document.querySelectorAll(
    ".close-btn, .close-modal-btn"
  );
  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");
  const avatarImg = document.getElementById("avatarImg");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const userFullName = document.getElementById("userFullName");
  const userName = document.getElementById("userName");
  const addCircleModal = document.getElementById("addCircleModal");
  const addCircleSaveBtn = document.getElementById("addCircleSaveBtn");

  // Текущий пользователь (в реальном приложении данные будут приходить с сервера)
  let currentUser = {
    name: "Иван Петров",
    role: "Участник",
    avatar: "",
    avatarFile: "",
    stats: {
      circles: 3,
      materials: 12,
      grades: 4.8,
      messages: 5,
    },
    circles: [],
    grades: [
      {
        id: 1,
        subject: "Программирование на Python",
        value: 5.0,
        date: "2023-05-15",
        comment: "Отличная работа над проектом",
      },
      {
        id: 2,
        subject: "Математический анализ",
        value: 4.5,
        date: "2023-05-10",
        comment: "Хорошо, но есть над чем работать",
      },
      {
        id: 3,
        subject: "Английский язык",
        value: 4.0,
        date: "2023-05-05",
        comment: "Старайтесь больше практиковать разговорную речь",
      },
    ],
  };

  // Инициализация приложения
  async function initApp() {
    // Загружаем данные пользователя
    await loadUserData();

    // Показываем главную страницу
    showPage("dashboard");

    // Генерируем контент для главной страницы
    generateDashboardContent();
  }

  // Загрузка данных пользователя
  async function loadUserData() {
    const userData = await getProfileData();
    userName.textContent = userData.username;
    document.getElementById("userRole").textContent = getRoleName(
      userData.role
    );

    // Устанавливаем аватар (если есть)
    if (userData.avatar) {
      avatarImg.src = userData.avatar;
      avatarPreview.src = userData.avatar;
    }

    // Заполняем поле ФИО в модальном окне
    userFullName.value = userData.username;

    // Устанавливаем все необходимые данные с сервера
    currentUser.name = userData.username;
    currentUser.role = getRoleName(userData.role);
    currentUser.avatar = userData.avatar;

    console.log(currentUser);
  }

  // Показ страницы
  function showPage(page) {
    // Скрываем весь контент
    dashboardContent.style.display = "none";
    otherContent.style.display = "none";

    // Убираем активный класс у всех ссылок
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Добавляем активный класс к текущей ссылке
    document.querySelectorAll(`[data-page="${page}"]`).forEach((link) => {
      link.classList.add("active");
    });

    // Показываем нужный контент
    if (page === "dashboard") {
      dashboardContent.style.display = "block";
      generateDashboardContent();
    } else {
      otherContent.style.display = "block";
      otherContent.innerHTML = `<h2>${getPageTitle(
        page
      )}</h2><p>Контент для страницы "${getPageTitle(page)}" будет здесь.</p>`;

      // Генерируем специфический контент для некоторых страниц
      if (page === "circles") {
        generateCirclesContent();
      } else if (page === "grades") {
        generateGradesContent();
      }
    }
  }

  // Получение заголовка страницы
  function getPageTitle(page) {
    const titles = {
      dashboard: "Главная",
      circles: "Кружки",
      grades: "Успеваемость",
      materials: "Материалы",
    };
    return titles[page] || page;
  }

  // Генерация контента для главной страницы
  async function generateDashboardContent() {
    if (currentUser.role === "Администратор") {
      return showAdminDashboard();
    }

    const userCircles = await getUserCircles();

    dashboardContent.innerHTML = `
            <div class="section-header">
                <h2>Добро пожаловать, ${
                  currentUser.name.split(" ")[1] ??
                  currentUser.name.split(" ")[0]
                }!</h2>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="stat-number">${userCircles.clubs.length}</div>
                    <div class="stat-title">Мои кружки</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-number">${
                      currentUser.stats.materials
                    }</div>
                    <div class="stat-title">Материалы</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-number">${currentUser.stats.grades}</div>
                    <div class="stat-title">Средний балл</div>
                </div>
            </div>
            
            <div class="section-header">
                <h2>Мои кружки</h2>
                <button class="btn gold-btn" id="joinCircleButton">Вступить в кружок</button>
            </div>
            
            <div class="circles-grid" id="circlesGrid"></div>
            
            <div class="section-header">
                <h2>Последние оценки</h2>
            </div>
            
            <div class="grades-container" id="gradesContainer"></div>
        `;

    // Генерируем карточки кружков
    generateCirclesGrid(userCircles);

    // Генерируем последние оценки
    generateGradesGrid();

    // Добавляем обработчик для кнопки добавления кружка
    document
      .getElementById("joinCircleButton")
      .addEventListener("click", function () {
        showPage("circles");
      });
  }

  // Просмотр информации о кружке
  function viewCircle(circleId) {
    const circle = currentUser.circles.find(
      (c) => parseInt(c.id) === parseInt(circleId)
    );
    if (!circle) return;

    circleModalContent.innerHTML = `
                    <h2>${circle.title}</h2>
                    <div class="circle-image">
                        <img src="${circle.image}" alt="${circle.title}">
                    </div>
                    <div class="circle-info">
                        <p><strong>Категория:</strong> ${takeCategoryByType(
                          circle.category
                        )}</p>
                        <p><strong>Расписание:</strong> Каждый день </p>
                        <p><strong>Участников:</strong> ${
                          circle.participants
                        }</p>
                        <p><strong>Описание:</strong> ${circle.description}</p>
                    </div>
                `;

    showModal(circleModal);

    // document
    //   .getElementById("loginFromCircleBtn")
    //   .addEventListener("click", function () {

    //   });
  }

  // Генерация сетки кружков
  async function generateCirclesGrid(
    userCircles,
    elementId = "circlesGrid",
    showJoinButton = false
  ) {
    const circlesGrid = document.getElementById(elementId);
    if (!circlesGrid) return;

    // Обновляем статистику только если это кружки пользователя
    if (!showJoinButton) {
      currentUser.stats.circles = userCircles.clubs.length;
    }

    currentUser.circles = userCircles.clubs.map((item) => {
      return {
        id: item.id,
        title: item.name,
        description: item.description,
        category: item.type,
        image: takeImageByType(item.type),
        participants: item.members_count,
      };
    });

    const generateActions = (id) => {
      if (currentUser.role === "Администратор") {
        return `<button class="btn danger-btn delete-btn" data-circle-id="${id}">Удалить</button>`;
      }
      return showJoinButton
        ? `<button class="btn primary-btn join-btn" data-circle-id="${id}">Вступить</button>`
        : `<button class="btn danger-btn leave-btn" data-circle-id="${id}">Выйти</button>`;
    };

    circlesGrid.innerHTML = "";
    currentUser.circles.forEach((circle) => {
      const circleCard = document.createElement("div");
      circleCard.className = "circle-card";
      circleCard.innerHTML = `
            <div class="circle-image">
                <img src="${circle.image}" alt="${circle.title}">
                <span class="circle-category">${takeCategoryByType(
                  circle.category
                )}</span>
            </div>
            <div class="circle-info">
                <h3>${circle.title}</h3>
                <p>${circle.description}</p>
                <div class="circle-actions">
                    <button class="btn transparent-btn view-btn" data-circle-id="${
                      circle.id
                    }">Подробнее</button>
                    ${generateActions(circle.id)}
                </div>
            </div>
        `;
      circlesGrid.appendChild(circleCard);
    });

    if (currentUser.role === 'Администратор') {
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const circleId = e.currentTarget.dataset.circleId;
          if (!circleId) {
            console.error("Data attribute data-circle-id не найден");
            return;
          }
          deleteCircle(circleId, showToast); // Предполагается, что у вас есть такая функция
        });
      });
    }

    // Обработка кнопок "Выйти" или "Вступить" в зависимости от режима
    if (showJoinButton) {
      // Обработка кнопок "Вступить"
      document.querySelectorAll(".join-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const circleId = e.currentTarget.dataset.circleId;
          if (!circleId) {
            console.error("Data attribute data-circle-id не найден");
            return;
          }
          joinUserCircle(circleId, showToast); // Предполагается, что у вас есть такая функция
        });
      });
    } else {
      // Обработка кнопок "Выйти"
      document.querySelectorAll(".leave-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const circleId = e.currentTarget.dataset.circleId;
          if (!circleId) {
            console.error("Data attribute data-circle-id не найден");
            return;
          }
          leaveUserCircle(circleId, showToast);
        });
      });
    }

    // Обработка кнопок "Просмотр" через делегирование событий (остается без изменений)
    circlesGrid.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".view-btn");
      if (viewBtn) {
        const circleId = viewBtn.dataset.circleId;
        if (!circleId) {
          console.error("Data attribute data-circle-id не найден");
          return;
        }
        circleModal.style.display = "flex";
        viewCircle(circleId);
      }
    });
  }

  // Генерация сетки оценок
  function generateGradesGrid() {
    const gradesContainer = document.getElementById("gradesContainer");
    if (!gradesContainer) return;

    gradesContainer.innerHTML = "";

    currentUser.grades.forEach((grade) => {
      const gradeCard = document.createElement("div");
      gradeCard.className = "grade-card";
      gradeCard.innerHTML = `
                <div class="grade-header">
                    <h4>${grade.subject}</h4>
                    <span>${grade.date}</span>
                </div>
                <div class="grade-value">${grade.value}</div>
                <div class="grade-comment">${grade.comment}</div>
            `;
      gradesContainer.appendChild(gradeCard);
    });
  }

  // Генерация контента для страницы кружков
  async function generateCirclesContent() {
    const allCircles = await getAllCircles();

    otherContent.innerHTML = `
            <div class="section-header">
                <h2>Доступные кружки (${allCircles.clubs.length})</h2>
  ${
    currentUser.role === "Администратор"
      ? '<button class="btn gold-btn" id="addCircleBtn">Добавить кружок</button>'
      : ""
  }
            </div>
            
            <div class="circles-grid" id="circlesGrid2"></div>
        `;

    generateCirclesGrid(allCircles, "circlesGrid2", true);

    // Добавляем обработчик для кнопки добавления кружка
    if (document.getElementById("addCircleBtn")) {
      document
        .getElementById("addCircleBtn")
        .addEventListener("click", function () {
          addCircleModal.style.display = "flex";
        });
    }
  }

  // Генерация контента для страницы успеваемости
  function generateGradesContent() {
    otherContent.innerHTML = `
            <div class="section-header">
                <h2>Моя успеваемость</h2>
            </div>
            
            <div class="grades-container" id="gradesContainer"></div>
        `;

    generateGradesGrid();
  }

  // Показ модального окна
  function showModal(modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  // Скрытие модального окна
  function hideModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Обработчики событий

  // Переключение между страницами
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.getAttribute("data-page");
      showPage(page);
    });
  });

  // Выход из системы
  logoutBtn.addEventListener("click", function () {
    if (confirm("Вы уверены, что хотите выйти?")) {
      fetchLogout();
      // В реальном приложении здесь будет перенаправление на страницу входа
      alert("Вы вышли из системы");
    }
  });

  // Открытие модального окна профиля
  userAvatarBtn.addEventListener("click", function () {
    showModal(avatarModal);
  });

  editAvatarBtn.addEventListener("click", function () {
    showModal(avatarModal);
  });

  // Закрытие модальных окон
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal");
      hideModal(modal);
    });
  });

  // Закрытие модального окна при клике вне его
  window.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      hideModal(e.target);
    }
  });

  // Загрузка аватарки
  avatarInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    currentUser.avatarFile = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        avatarPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Сохранение профиля
  saveProfileBtn.addEventListener("click", async function () {
    const newName = userFullName.value.trim();
    const newAvatar = avatarPreview.src;
    console.log(avatarPreview);

    if (newName) {
      currentUser.name = newName;
      userName.textContent = newName;

      if (newAvatar) {
        currentUser.avatar = newAvatar;
        avatarImg.src = newAvatar;
      }
      try {
        await updateProfile(newName, currentUser.avatarFile, showToast);
        hideModal(avatarModal);
        window.location.reload();
      } catch (error) {
        showToast(error, "error");
      }
    } else {
      showToast("Пожалуйста, введите ФИО", "error");
    }
  });

  // Добавление нового кружка
  addCircleSaveBtn.addEventListener("click", async function () {
    const title = document.getElementById("circleTitle").value.trim();
    const description = document
      .getElementById("circleDescription")
      .value.trim();
    const category = document.getElementById("circleCategory").value;

    if (title && description && category) {
      const newCircle = {
        name: title,
        description: description,
        type: category,
      };

      await createNewCircle(newCircle, showToast).then((reponse) => {
        // Очищаем форму
        document.getElementById("circleTitle").value = "";
        document.getElementById("circleDescription").value = "";

        hideModal(circleModalContent);
      });

      // Обновляем отображение кружков
      if (dashboardContent.style.display === "block") {
        generateDashboardContent();
      } else {
        generateCirclesContent();
      }
    } else {
      showToast("Пожалуйста, заполните все поля", "error");
    }
  });

  // Показ уведомления
  function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Инициализация категорий кружков
  function initCategories() {
    const categories = [
      {
        title: "Математика",
        value: "MATH",
      },
      {
        title: "Языки",
        value: "LANGUAGE",
      },
      {
        title: "Искусство",
        value: "ART",
      },
      {
        title: "Наука",
        value: "SCIENCE",
      },
      {
        title: "Спорт",
        value: "SPORT",
      },
      {
        title: "Другое",
        value: "OTHER",
      },
    ];

    const categorySelect = document.getElementById("circleCategory");

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.value;
      option.textContent = category.title;
      categorySelect.appendChild(option);
    });
  }

  async function showAdminDashboard() {
    const allCircles = await getAllCircles();

    dashboardContent.innerHTML = `
    <div class="section-header">
      <h2>Добро пожаловать, ${
        currentUser.name.split(" ")[1] ?? currentUser.name.split(" ")[0]
      }!</h2>
    </div>
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-book-open"></i></div>
        <div class="stat-number">${allCircles.clubs.length}</div>
        <div class="stat-title">Кружков в системе</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
        <div class="stat-number">5</div>
        <div class="stat-title">Всего материалов</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
        <div class="stat-number">94</div>
        <div class="stat-title">Всего пользователей</div>
      </div>
    </div>
    <div class="admin-section">
      <h3>Управление кружками</h3>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Тип</th>
            <th>Участников</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody id="adminCirclesList">
          ${allCircles.clubs
            .map(
              (circle) => `
            <tr>
              <td>${circle.name}</td>
              <td>${takeCategoryByType(circle.type)}</td>
              <td>${circle.members_count}</td>
              <td>
                <button class="btn view-members-btn" data-circle-id="${circle.id}">
                  Просмотреть участников
                </button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

    // Обработчики для кнопок просмотра участников
    document.querySelectorAll(".view-members-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const circleId = btn.dataset.circleId;
        await showCircleMembers(circleId);
      });
    });

    // Инициализация модального окна
    const modal = document.getElementById("membersModal");
    document.querySelector(".close-modal").addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  async function showCircleMembers(circleId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/clubs/${circleId}/members`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { members } = await response.json();

      // Получаем название кружка
      const circleName = document
        .querySelector(`[data-circle-id="${circleId}"]`)
        .closest("tr")
        .querySelector("td").textContent;

      // Заполняем таблицу участников
      const membersList = document.getElementById("membersList");
      membersList.innerHTML = members
        .map(
          (member) => `
      <tr data-user-id="${member.id}">
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>
          <input type="number" min="0" max="100" value="${member.grade || 0}">
        </td>
      </tr>
    `
        )
        .join("");

      console.log(membersList);

      // Показываем модальное окно
      document.getElementById(
        "modalTitle"
      ).textContent = `Участники кружка "${circleName}"`;
      document.getElementById("membersModal").style.display = "flex";
      document.getElementById("membersModal").dataset.circleId = circleId;

      // Обработчик сохранения оценок
      document.getElementById("saveGradesBtn").onclick = async () => {
        const grades = [];
        document.querySelectorAll("#membersList tr").forEach((row) => {
          grades.push({
            userId: row.dataset.userId,
            grade: row.querySelector("input").value,
          });
        });

        try {
          const response = await fetch(
            `http://localhost:5000/api/admin/clubs/${circleId}/grades`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ grades }),
            }
          );

          const result = await response.json();
          if (result.success) {
            showToast("Оценки успешно сохранены", "success");
          } else {
            showToast(result.message, "error");
          }
        } catch (error) {
          console.error("Ошибка:", error);
          showToast("Ошибка при сохранении оценок", "error");
        }
      };
    } catch (error) {
      console.error("Ошибка:", error);
      showToast("Ошибка при загрузке участников", "error");
    }
  }

  // Запуск приложения
  initCategories();
  initApp();
});
