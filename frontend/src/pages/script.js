const fetchRegistration = async (name, email, password, role, showToast) => {
  try {
    // Извлекаем токен
    const response = await fetch("http://localhost:5000/api/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        email,
        password,
        role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Проверяем наличие ошибок и выводим их
      if (errorData && Array.isArray(errorData)) {
        errorData.forEach((error) => {
          showToast(error.message, "error");
        });
        // window.location.href = '/landing/index.html';
      } else {
        // window.location.href = '/landing/index.html';
        showToast("Произошла ошибка при входе", "error");
      }
      throw new Error("Network response was not ok");
    }

    showToast("Регистрация прошла успешно!", "success");
    await fetchLogin(email, password, showToast);
    return data;
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
  }
};

const fetchLogin = async (email, password, showToast) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Указываем тип контента
      },
      body: JSON.stringify({
        email,
        password,
      }), // Преобразуем объект в JSON-строку
      credentials: "include", // Добавляем этот параметр для отправки куки
    });

    if (!response.ok) {
      const errorData = await response.json(); // Преобразуем ответ в JSON

      // Проверяем наличие ошибок и выводим их
      if (errorData && Array.isArray(errorData)) {
        errorData.forEach((error) => {
          showToast(error.message, "error"); // Измените на 'error', если это ошибка
        });
      } else {
        showToast("Произошла ошибка при входе", "error"); // Общее сообщение об ошибке
      }

      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // Преобразуем ответ в JSON
    console.log("Success:", data); // Обрабатываем успешный ответ

    localStorage.setItem("token", data.token);

    showToast("Вы успешно вошли в систему", "success");

    window.location.href = "../lk/index.html";

    hideModal(DOM.loginModal);
  } catch (error) {
    console.error("Error:", error); // Обрабатываем ошибку
  }
};

const getAllCircles = async () => {
  const response = await fetch("http://localhost:5000/api/clubs", {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json(); // Преобразуем ответ в JSON
    showToast("Не удалось получить список кружков", "error");
  }

  const data = await response.json(); // Преобразуем ответ в JSON

  console.log("Success:", data.clubs); // Обрабатываем успешный ответ
  return data.clubs;
};

    const takeImageByType = (type) => {
      switch (type) {
        case "SPORT":
          return "./assets/sport.avif";
        case "MATH":
          return "./assets/math.avif";
        case "SCIENCE":
          return "./assets/sience.avif";
        case "LANGUAGE":
          return "./assets/language.avif";
        case "ART":
          return "./assets/art.jpg";
        case "OTHER":
          return "./assets/other.avif";
        default:
          return "./assets/other.avif";
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

document.addEventListener("DOMContentLoaded", function () {
  // Состояние приложения
  const appState = {
    currentUser: null,
    currentPage: "home",
    isLoggedIn: false,
    circles: [
      {
        id: 1,
        title: "Литературный клуб",
        description:
          "Изучение классической и современной литературы, обсуждение произведений",
        category: "Гуманитарные",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136",
        schedule: "Каждый вторник, 16:00",
        participants: 25,
      },
      {
        id: 2,
        title: "Робототехника",
        description: "Основы программирования и конструирования роботов",
        category: "Технические",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
        schedule: "По средам и пятницам, 15:00",
        participants: 18,
      },
      {
        id: 3,
        title: "Театральная студия",
        description:
          "Актерское мастерство, сценическая речь, постановка спектаклей",
        category: "Творческие",
        image: "https://images.unsplash.com/photo-1547153760-18fc86324498",
        schedule: "По понедельникам и четвергам, 17:00",
        participants: 15,
      },
    ],
    students: [
      { id: 1, name: "Иван Петров", email: "ivan@example.com", avatar: "" },
      { id: 2, name: "Мария Иванова", email: "maria@example.com", avatar: "" },
      { id: 3, name: "Алексей Смирнов", email: "alex@example.com", avatar: "" },
    ],
    grades: [
      {
        id: 1,
        circleId: 1,
        studentId: 1,
        value: 5,
        comment: "Отличная работа над проектом",
        date: "2023-05-15",
      },
      {
        id: 2,
        circleId: 2,
        studentId: 1,
        value: 4.5,
        comment: "Хорошо, но есть над чем работать",
        date: "2023-05-10",
      },
      {
        id: 3,
        circleId: 1,
        studentId: 2,
        value: 4,
        comment: "Старайтесь больше практиковать разговорную речь",
        date: "2023-05-05",
      },
    ],
    materials: [
      {
        id: 1,
        circleId: 1,
        title: "Список литературы",
        description: "Рекомендуемые произведения для чтения",
        file: "literature-list.pdf",
      },
      {
        id: 2,
        circleId: 2,
        title: "Основы программирования",
        description: "Введение в Python",
        file: "python-basics.pdf",
      },
    ],
    messages: [
      {
        id: 1,
        from: "admin",
        to: 1,
        subject: "Добро пожаловать",
        text: "Добро пожаловать на платформу Логос Гим!",
        date: "2023-05-01",
      },
      {
        id: 2,
        from: 1,
        to: "admin",
        subject: "Вопрос по кружку",
        text: "Когда начинаются занятия по робототехнике?",
        date: "2023-05-02",
      },
    ],
    events: [
      {
        id: 1,
        circleId: 1,
        title: "Литературная викторина",
        date: "2023-05-25",
        time: "16:00-18:00",
        location: "Актовый зал",
      },
      {
        id: 2,
        circleId: 2,
        title: "Турнир по робототехнике",
        date: "2023-05-30",
        time: "12:00-15:00",
        location: "Лаборатория 203",
      },
    ],
    portfolio: [
      {
        id: 1,
        studentId: 1,
        title: "Мой первый проект",
        description: "Анализ произведения 'Преступление и наказание'",
        file: "project1.pdf",
      },
    ],
  };

  // Элементы DOM
  const DOM = {
    // Основные элементы
    mainContent: document.getElementById("mainContent"),
    authButtons: document.getElementById("authButtons"),
    userControls: document.getElementById("userControls"),

    // Навигация
    mainNav: document.getElementById("mainNav"),
    sidebarMenu: document.getElementById("sidebarMenu"),

    // Модальные окна
    loginModal: document.getElementById("loginModal"),
    registerModal: document.getElementById("registerModal"),
    profileModal: document.getElementById("profileModal"),
    circleModal: document.getElementById("circleModal"),
    gradeModal: document.getElementById("gradeModal"),
    messageModal: document.getElementById("messageModal"),
    materialModal: document.getElementById("materialModal"),
    circleModalContent: document.getElementById("circleModalContent"),

    // Формы
    loginForm: document.getElementById("loginForm"),
    registerForm: document.getElementById("registerForm"),
    gradeForm: document.getElementById("gradeForm"),
    messageForm: document.getElementById("messageForm"),
    materialForm: document.getElementById("materialForm"),

    // Кнопки
    loginBtn: document.getElementById("loginBtn"),
    registerBtn: document.getElementById("registerBtn"),
    logoutBtn: document.getElementById("logoutBtn"),
    editAvatarBtn: document.getElementById("editAvatarBtn"),
    userAvatarBtn: document.getElementById("userAvatarBtn"),
    saveProfileBtn: document.getElementById("saveProfileBtn"),
    switchToLogin: document.getElementById("switchToLogin"),
    switchToRegister: document.getElementById("switchToRegister"),
    learnMoreBtn: document.getElementById("learnMoreBtn"),
    viewCirclesBtn: document.getElementById("viewCirclesBtn"),

    // Поля форм
    regUserType: document.getElementById("regUserType"),
    adminCodeGroup: document.getElementById("adminCodeGroup"),
    avatarInput: document.getElementById("avatarInput"),
    avatarPreview: document.getElementById("avatarPreview"),
    avatarImg: document.getElementById("avatarImg"),
    userFullName: document.getElementById("userFullName"),
    userEmail: document.getElementById("userEmail"),
    userPhone: document.getElementById("userPhone"),

    // Контейнеры контента
    circlesGrid: document.getElementById("circlesGrid"),
    circlesCategory: document.getElementById("circlesCategory"),
    dashboardContent: document.getElementById("dashboardContent"),

    // Уведомления
    toast: document.getElementById("toast"),
  };

  // Инициализация приложения
  function init() {
    // Проверяем, есть ли пользователь в localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      appState.currentUser = JSON.parse(savedUser);
      appState.isLoggedIn = true;
      updateUI();
      showPage("dashboard");
      loadDashboardContent("profile");
    } else {
      showPage("home");
    }

    // Загружаем кружки
    loadCircles();

    // Назначаем обработчики событий
    setupEventListeners();
  }

  // Назначение обработчиков событий
  function setupEventListeners() {
    // Навигация
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const page = this.getAttribute("data-page");
        showPage(page);
      });
    });

    // Авторизация
    DOM.loginBtn.addEventListener("click", () => {
      localStorage.removeItem("targetCircle");
      showModal(DOM.loginModal);
    });
    DOM.registerBtn.addEventListener("click", () => {
      localStorage.removeItem("targetCircle");
      showModal(DOM.registerModal);
    });
    DOM.switchToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal(DOM.registerModal);
      showModal(DOM.loginModal);
    });
    DOM.switchToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal(DOM.loginModal);
      showModal(DOM.registerModal);
    });

    // Формы
    DOM.loginForm.addEventListener("submit", handleLogin);
    DOM.registerForm.addEventListener("submit", handleRegister);
    DOM.logoutBtn.addEventListener("click", handleLogout);

    // Профиль
    DOM.userAvatarBtn.addEventListener("click", () =>
      showModal(DOM.profileModal)
    );
    DOM.editAvatarBtn.addEventListener("click", () =>
      showModal(DOM.profileModal)
    );
    DOM.avatarInput.addEventListener("change", handleAvatarUpload);
    DOM.saveProfileBtn.addEventListener("click", saveProfile);

    // Кнопки главной страницы
    DOM.learnMoreBtn.addEventListener("click", () => showPage("about"));
    DOM.viewCirclesBtn.addEventListener("click", () => showPage("circles"));

    // Переключение типа пользователя при регистрации
    DOM.regUserType.addEventListener("change", function () {
      DOM.adminCodeGroup.style.display =
        this.value === "admin" ? "block" : "none";
    });

    // Закрытие модальных окон
    document.querySelectorAll(".close-btn, .close-modal-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const modal = this.closest(".modal");
        hideModal(modal);
      });
    });

    // Закрытие модальных окон при клике вне их
    window.addEventListener("click", function (e) {
      if (e.target.classList.contains("modal")) {
        hideModal(e.target);
      }
    });
  }

  // Показ страницы
  function showPage(page) {
    // Скрываем все страницы
    document.querySelectorAll(".page").forEach((p) => {
      p.classList.remove("active-page");
    });

    // Обновляем активную ссылку в навигации
    document.querySelectorAll("nav a").forEach((link) => {
      link.classList.remove("active");
    });

    // Показываем нужную страницу
    document.getElementById(`${page}Page`).classList.add("active-page");

    // Обновляем активную ссылку
    document
      .querySelector(`nav a[data-page="${page}"]`)
      .classList.add("active");

    // Сохраняем текущую страницу
    appState.currentPage = page;

    // Если это страница личного кабинета, загружаем контент
    if (page === "dashboard") {
      loadDashboardContent("profile");
    }
  }

  // Загрузка контента личного кабинета
  function loadDashboardContent(section) {
    if (!appState.isLoggedIn) return;

    // Обновляем меню
    updateSidebarMenu();

    // Загружаем контент в зависимости от роли
    if (appState.currentUser.role === "admin") {
      loadAdminDashboard(section);
    } else {
      loadStudentDashboard(section);
    }
  }

  // Загрузка личного кабинета администратора
  function loadAdminDashboard(section) {
    let content = "";

    switch (section) {
      case "profile":
        content = `
                            <div class="section-header">
                                <h2>Профиль администратора</h2>
                            </div>
                            <div class="dashboard-stats">
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="stat-number">${appState.students.length}</div>
                                    <div class="stat-title">Участников</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-book-open"></i>
                                    </div>
                                    <div class="stat-number">${appState.circles.length}</div>
                                    <div class="stat-title">Кружков</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-file-alt"></i>
                                    </div>
                                    <div class="stat-number">${appState.materials.length}</div>
                                    <div class="stat-title">Материалов</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-calendar-check"></i>
                                    </div>
                                    <div class="stat-number">${appState.events.length}</div>
                                    <div class="stat-title">Событий</div>
                                </div>
                            </div>
                        `;
        break;

      case "circles":
        content = `
                            <div class="section-header">
                                <h2>Управление кружками</h2>
                                <button class="btn gold-btn" id="addCircleBtn"><i class="fas fa-plus"></i> Добавить кружок</button>
                            </div>
                            <div class="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Название</th>
                                            <th>Категория</th>
                                            <th>Расписание</th>
                                            <th>Участников</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${appState.circles
                                          .map(
                                            (circle) => `
                                            <tr>
                                                <td>${circle.title}</td>
                                                <td>${circle.category}</td>
                                                <td>${circle.schedule}</td>
                                                <td>${circle.participants}</td>
                                                <td class="actions-cell">
                                                    <div class="action-btn edit-btn" data-id="${circle.id}"><i class="fas fa-edit"></i></div>
                                                    <div class="action-btn delete-btn" data-id="${circle.id}"><i class="fas fa-trash"></i></div>
                                                </td>
                                            </tr>
                                        `
                                          )
                                          .join("")}
                                    </tbody>
                                </table>
                            </div>
                        `;
        break;

      case "grades":
        content = `
                            <div class="section-header">
                                <h2>Управление оценками</h2>
                                <button class="btn gold-btn" id="addGradeBtn"><i class="fas fa-plus"></i> Добавить оценку</button>
                            </div>
                            <div class="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ученик</th>
                                            <th>Кружок</th>
                                            <th>Оценка</th>
                                            <th>Дата</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${appState.grades
                                          .map((grade) => {
                                            const student =
                                              appState.students.find(
                                                (s) => s.id === grade.studentId
                                              );
                                            const circle =
                                              appState.circles.find(
                                                (c) => c.id === grade.circleId
                                              );
                                            return `
                                                <tr>
                                                    <td>${
                                                      student
                                                        ? student.name
                                                        : "Неизвестно"
                                                    }</td>
                                                    <td>${
                                                      circle
                                                        ? circle.title
                                                        : "Неизвестно"
                                                    }</td>
                                                    <td>${grade.value}</td>
                                                    <td>${grade.date}</td>
                                                    <td class="actions-cell">
                                                        <div class="action-btn edit-btn" data-id="${
                                                          grade.id
                                                        }"><i class="fas fa-edit"></i></div>
                                                        <div class="action-btn delete-btn" data-id="${
                                                          grade.id
                                                        }"><i class="fas fa-trash"></i></div>
                                                    </td>
                                                </tr>
                                            `;
                                          })
                                          .join("")}
                                    </tbody>
                                </table>
                            </div>
                        `;
        break;

      case "schedule":
        content = `
                            <div class="section-header">
                                <h2>Управление расписанием</h2>
                                <button class="btn gold-btn" id="addEventBtn"><i class="fas fa-plus"></i> Добавить событие</button>
                            </div>
                            <div class="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Событие</th>
                                            <th>Кружок</th>
                                            <th>Дата</th>
                                            <th>Время</th>
                                            <th>Место</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${appState.events
                                          .map((event) => {
                                            const circle =
                                              appState.circles.find(
                                                (c) => c.id === event.circleId
                                              );
                                            return `
                                                <tr>
                                                    <td>${event.title}</td>
                                                    <td>${
                                                      circle
                                                        ? circle.title
                                                        : "Неизвестно"
                                                    }</td>
                                                    <td>${event.date}</td>
                                                    <td>${event.time}</td>
                                                    <td>${event.location}</td>
                                                    <td class="actions-cell">
                                                        <div class="action-btn edit-btn" data-id="${
                                                          event.id
                                                        }"><i class="fas fa-edit"></i></div>
                                                        <div class="action-btn delete-btn" data-id="${
                                                          event.id
                                                        }"><i class="fas fa-trash"></i></div>
                                                    </td>
                                                </tr>
                                            `;
                                          })
                                          .join("")}
                                    </tbody>
                                </table>
                            </div>
                        `;
        break;

      case "materials":
        content = `
                            <div class="section-header">
                                <h2>Управление материалами</h2>
                                <button class="btn gold-btn" id="addMaterialBtn"><i class="fas fa-plus"></i> Добавить материал</button>
                            </div>
                            <div class="materials-container">
                                ${appState.materials
                                  .map((material) => {
                                    const circle = appState.circles.find(
                                      (c) => c.id === material.circleId
                                    );
                                    return `
                                        <div class="material-card">
                                            <div class="material-icon">
                                                <i class="fas fa-file-pdf"></i>
                                            </div>
                                            <h4>${material.title}</h4>
                                            <p>${material.description}</p>
                                            <p><small>Кружок: ${
                                              circle
                                                ? circle.title
                                                : "Неизвестно"
                                            }</small></p>
                                            <div class="material-actions">
                                                <button class="btn transparent-btn download-btn" data-id="${
                                                  material.id
                                                }"><i class="fas fa-download"></i></button>
                                                <button class="btn transparent-btn edit-btn" data-id="${
                                                  material.id
                                                }"><i class="fas fa-edit"></i></button>
                                                <button class="btn transparent-btn delete-btn" data-id="${
                                                  material.id
                                                }"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        `;
        break;

      case "messages":
        content = `
                            <div class="section-header">
                                <h2>Сообщения</h2>
                                <button class="btn gold-btn" id="newMessageBtn"><i class="fas fa-plus"></i> Новое сообщение</button>
                            </div>
                            <div class="messages-container">
                                ${appState.messages
                                  .filter(
                                    (msg) =>
                                      msg.from === "admin" || msg.to === "admin"
                                  )
                                  .map((message) => {
                                    const isOutgoing = message.from === "admin";
                                    const student = isOutgoing
                                      ? appState.students.find(
                                          (s) => s.id === message.to
                                        )
                                      : appState.students.find(
                                          (s) => s.id === message.from
                                        );
                                    return `
                                        <div class="message">
                                            <div class="message-header">
                                                <span class="message-sender">${
                                                  isOutgoing
                                                    ? "Вы → " +
                                                      (student
                                                        ? student.name
                                                        : "Ученик")
                                                    : (student
                                                        ? student.name
                                                        : "Ученик") + " → Вы"
                                                }</span>
                                                <span class="message-date">${
                                                  message.date
                                                }</span>
                                            </div>
                                            <h4 class="message-subject">${
                                              message.subject
                                            }</h4>
                                            <p class="message-text">${
                                              message.text
                                            }</p>
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        `;
        break;

      case "portfolio":
        content = `
                            <div class="section-header">
                                <h2>Портфолио учеников</h2>
                            </div>
                            <div class="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ученик</th>
                                            <th>Проект</th>
                                            <th>Описание</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${appState.portfolio
                                          .map((item) => {
                                            const student =
                                              appState.students.find(
                                                (s) => s.id === item.studentId
                                              );
                                            return `
                                                <tr>
                                                    <td>${
                                                      student
                                                        ? student.name
                                                        : "Неизвестно"
                                                    }</td>
                                                    <td>${item.title}</td>
                                                    <td>${item.description}</td>
                                                    <td class="actions-cell">
                                                        <div class="action-btn view-btn" data-id="${
                                                          item.id
                                                        }"><i class="fas fa-eye"></i></div>
                                                        <div class="action-btn delete-btn" data-id="${
                                                          item.id
                                                        }"><i class="fas fa-trash"></i></div>
                                                    </td>
                                                </tr>
                                            `;
                                          })
                                          .join("")}
                                    </tbody>
                                </table>
                            </div>
                        `;
        break;

      case "settings":
        content = `
                            <div class="section-header">
                                <h2>Настройки системы</h2>
                            </div>
                            <form id="settingsForm">
                                <div class="form-group">
                                    <label for="systemName">Название системы</label>
                                    <input type="text" id="systemName" class="form-control" value="Логос Гим">
                                </div>
                                <div class="form-group">
                                    <label for="systemLogo">Логотип</label>
                                    <input type="file" id="systemLogo" class="form-control">
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn gold-btn">Сохранить</button>
                                </div>
                            </form>
                        `;
        break;
    }

    DOM.dashboardContent.innerHTML = content;

    // Назначаем обработчики для динамически созданных элементов
    if (section === "circles") {
      document
        .getElementById("addCircleBtn")
        .addEventListener("click", () => showAddCircleModal());
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const circleId = parseInt(this.getAttribute("data-id"));
          showEditCircleModal(circleId);
        });
      });
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const circleId = parseInt(this.getAttribute("data-id"));
          deleteCircle(circleId);
        });
      });
    }

    if (section === "grades") {
      document
        .getElementById("addGradeBtn")
        .addEventListener("click", () => showAddGradeModal());
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const gradeId = parseInt(this.getAttribute("data-id"));
          showEditGradeModal(gradeId);
        });
      });
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const gradeId = parseInt(this.getAttribute("data-id"));
          deleteGrade(gradeId);
        });
      });
    }

    if (section === "schedule") {
      document
        .getElementById("addEventBtn")
        .addEventListener("click", () => showAddEventModal());
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const eventId = parseInt(this.getAttribute("data-id"));
          showEditEventModal(eventId);
        });
      });
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const eventId = parseInt(this.getAttribute("data-id"));
          deleteEvent(eventId);
        });
      });
    }

    if (section === "materials") {
      document
        .getElementById("addMaterialBtn")
        .addEventListener("click", () => showAddMaterialModal());
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const materialId = parseInt(this.getAttribute("data-id"));
          showEditMaterialModal(materialId);
        });
      });
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const materialId = parseInt(this.getAttribute("data-id"));
          deleteMaterial(materialId);
        });
      });
      document.querySelectorAll(".download-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const materialId = parseInt(this.getAttribute("data-id"));
          downloadMaterial(materialId);
        });
      });
    }

    if (section === "messages") {
      document
        .getElementById("newMessageBtn")
        .addEventListener("click", () => showNewMessageModal());
    }

    if (section === "portfolio") {
      document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const portfolioId = parseInt(this.getAttribute("data-id"));
          viewPortfolioItem(portfolioId);
        });
      });
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const portfolioId = parseInt(this.getAttribute("data-id"));
          deletePortfolioItem(portfolioId);
        });
      });
    }

    if (section === "settings") {
      document
        .getElementById("settingsForm")
        .addEventListener("submit", saveSettings);
    }
  }

  // Загрузка личного кабинета студента
  function loadStudentDashboard(section) {
    let content = "";

    switch (section) {
      case "profile":
        content = `
                            <div class="section-header">
                                <h2>Мой профиль</h2>
                            </div>
                            <div class="dashboard-stats">
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-book-open"></i>
                                    </div>
                                    <div class="stat-number">${
                                      appState.circles.filter(
                                        (c) => c.participants > 0
                                      ).length
                                    }</div>
                                    <div class="stat-title">Мои кружки</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-file-alt"></i>
                                    </div>
                                    <div class="stat-number">${
                                      appState.materials.length
                                    }</div>
                                    <div class="stat-title">Материалы</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <div class="stat-number">${calculateAverageGrade()}</div>
                                    <div class="stat-title">Средний балл</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-comments"></i>
                                    </div>
                                    <div class="stat-number">${
                                      appState.messages.filter(
                                        (m) =>
                                          m.to === appState.currentUser.id ||
                                          m.from === appState.currentUser.id
                                      ).length
                                    }</div>
                                    <div class="stat-title">Сообщения</div>
                                </div>
                            </div>
                        `;
        break;

      case "circles":
        content = `
                            <div class="section-header">
                                <h2>Мои кружки</h2>
                            </div>
                            <div class="circles-grid">
                                ${appState.circles
                                  .filter((c) => c.participants > 0)
                                  .map(
                                    (circle) => `
                                    <div class="circle-card">
                                        <div class="circle-image">
                                            <img src="${circle.image}" alt="${circle.title}">
                                            <span class="circle-category">${circle.category}</span>
                                        </div>
                                        <div class="circle-info">
                                            <h3>${circle.title}</h3>
                                            <p>${circle.description}</p>
                                            <div class="circle-meta">
                                                <span><i class="fas fa-calendar-alt"></i> ${circle.schedule}</span>
                                                <span><i class="fas fa-users"></i> ${circle.participants} участников</span>
                                            </div>
                                            <div class="circle-actions">
                                                <button class="btn transparent-btn">Подробнее</button>
                                                <button class="btn danger-btn" data-circle-id="${circle.id}">Выйти</button>
                                            </div>
                                        </div>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        `;
        break;

      case "grades":
        const studentGrades = appState.grades.filter(
          (g) => g.studentId === appState.currentUser.id
        );
        content = `
                            <div class="section-header">
                                <h2>Мои оценки</h2>
                            </div>
                            <div class="grades-container">
                                ${studentGrades
                                  .map((grade) => {
                                    const circle = appState.circles.find(
                                      (c) => c.id === grade.circleId
                                    );
                                    return `
                                        <div class="grade-card">
                                            <div class="grade-header">
                                                <h4>${
                                                  circle
                                                    ? circle.title
                                                    : "Неизвестный кружок"
                                                }</h4>
                                                <span>${grade.date}</span>
                                            </div>
                                            <div class="grade-value">${
                                              grade.value
                                            }</div>
                                            <div class="grade-comment">${
                                              grade.comment
                                            }</div>
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        `;
        break;

      case "schedule":
        content = `
                            <div class="section-header">
                                <h2>Мое расписание</h2>
                            </div>
                            <div class="events-container">
                                ${appState.events
                                  .map((event) => {
                                    const circle = appState.circles.find(
                                      (c) => c.id === event.circleId
                                    );
                                    return `
                                        <div class="event-card">
                                            <div class="event-header">
                                                <h4>${event.title}</h4>
                                            </div>
                                            <div class="event-meta">
                                                <span><i class="fas fa-book-open"></i> ${
                                                  circle
                                                    ? circle.title
                                                    : "Неизвестный кружок"
                                                }</span>
                                                <span><i class="fas fa-calendar-day"></i> ${
                                                  event.date
                                                }</span>
                                                <span><i class="fas fa-clock"></i> ${
                                                  event.time
                                                }</span>
                                                <span><i class="fas fa-map-marker-alt"></i> ${
                                                  event.location
                                                }</span>
                                            </div>
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        `;
        break;

      case "materials":
        content = `
                            <div class="section-header">
                                <h2>Мои материалы</h2>
                            </div>
                            <div class="materials-container">
                                ${appState.materials
                                  .map((material) => {
                                    const circle = appState.circles.find(
                                      (c) => c.id === material.circleId
                                    );
                                    return `
                                        <div class="material-card">
                                            <div class="material-icon">
                                                <i class="fas fa-file-pdf"></i>
                                            </div>
                                            <h4>${material.title}</h4>
                                            <p>${material.description}</p>
                                            <p><small>Кружок: ${
                                              circle
                                                ? circle.title
                                                : "Неизвестно"
                                            }</small></p>
                                            <div class="material-actions">
                                                <button class="btn transparent-btn download-btn" data-id="${
                                                  material.id
                                                }"><i class="fas fa-download"></i></button>
                                            </div>
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        `;
        break;

      case "messages":
        const studentMessages = appState.messages.filter(
          (m) =>
            m.to === appState.currentUser.id ||
            m.from === appState.currentUser.id
        );
        content = `
                            <div class="section-header">
                                <h2>Мои сообщения</h2>
                                <button class="btn gold-btn" id="newMessageBtn"><i class="fas fa-plus"></i> Новое сообщение</button>
                            </div>
                            <div class="messages-container">
                                ${studentMessages
                                  .map((message) => {
                                    const isOutgoing =
                                      message.from === appState.currentUser.id;
                                    const student = isOutgoing
                                      ? message.to === "admin"
                                        ? { name: "Администратор" }
                                        : appState.students.find(
                                            (s) => s.id === message.to
                                          )
                                      : message.from === "admin"
                                      ? { name: "Администратор" }
                                      : appState.students.find(
                                          (s) => s.id === message.from
                                        );
                                    return `
                                        <div class="message">
                                            <div class="message-header">
                                                <span class="message-sender">${
                                                  isOutgoing
                                                    ? "Вы → " +
                                                      (student
                                                        ? student.name
                                                        : "Получатель")
                                                    : (student
                                                        ? student.name
                                                        : "Отправитель") +
                                                      " → Вы"
                                                }</span>
                                                <span class="message-date">${
                                                  message.date
                                                }</span>
                                            </div>
                                            <h4 class="message-subject">${
                                              message.subject
                                            }</h4>
                                            <p class="message-text">${
                                              message.text
                                            }</p>
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        `;
        break;

      case "portfolio":
        const studentPortfolio = appState.portfolio.filter(
          (p) => p.studentId === appState.currentUser.id
        );
        content = `
                            <div class="section-header">
                                <h2>Мое портфолио</h2>
                                <button class="btn gold-btn" id="addPortfolioBtn"><i class="fas fa-plus"></i> Добавить работу</button>
                            </div>
                            <div class="materials-container">
                                ${studentPortfolio
                                  .map(
                                    (item) => `
                                    <div class="material-card">
                                        <div class="material-icon">
                                            <i class="fas fa-portrait"></i>
                                        </div>
                                        <h4>${item.title}</h4>
                                        <p>${item.description}</p>
                                        <div class="material-actions">
                                            <button class="btn transparent-btn download-btn" data-id="${item.id}"><i class="fas fa-download"></i></button>
                                            <button class="btn transparent-btn edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                                            <button class="btn transparent-btn delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        `;
        break;

      case "settings":
        content = `
                            <div class="section-header">
                                <h2>Настройки</h2>
                            </div>
                            <form id="settingsForm">
                                <div class="form-group">
                                    <label for="notifications">Уведомления</label>
                                    <select id="notifications" class="form-control">
                                        <option value="all">Все</option>
                                        <option value="important">Только важные</option>
                                        <option value="none">Отключить</option>
                                    </select>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn gold-btn">Сохранить</button>
                                </div>
                            </form>
                        `;
        break;
    }

    DOM.dashboardContent.innerHTML = content;

    // Назначаем обработчики для динамически созданных элементов
    if (section === "circles") {
      document.querySelectorAll(".danger-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const circleId = parseInt(this.getAttribute("data-circle-id"));
          leaveCircle(circleId);
        });
      });
    }

    if (section === "materials") {
      document.querySelectorAll(".download-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const materialId = parseInt(this.getAttribute("data-id"));
          downloadMaterial(materialId);
        });
      });
    }

    if (section === "messages") {
      document
        .getElementById("newMessageBtn")
        .addEventListener("click", () => showNewMessageModal());
    }

    if (section === "portfolio") {
      document
        .getElementById("addPortfolioBtn")
        .addEventListener("click", () => showAddPortfolioModal());
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const portfolioId = parseInt(this.getAttribute("data-id"));
          showEditPortfolioModal(portfolioId);
        });
      });
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const portfolioId = parseInt(this.getAttribute("data-id"));
          deletePortfolioItem(portfolioId);
        });
      });
      document.querySelectorAll(".download-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const portfolioId = parseInt(this.getAttribute("data-id"));
          downloadPortfolioItem(portfolioId);
        });
      });
    }

    if (section === "settings") {
      document
        .getElementById("settingsForm")
        .addEventListener("submit", saveSettings);
    }
  }

  // Обновление меню боковой панели
  function updateSidebarMenu() {
    if (!appState.currentUser) return;

    let menuItems = [];

    if (appState.currentUser.role === "admin") {
      menuItems = [
        { icon: "fas fa-home", text: "Главная", page: "profile" },
        { icon: "fas fa-book-open", text: "Кружки", page: "circles" },
        { icon: "fas fa-chart-line", text: "Оценки", page: "grades" },
        { icon: "fas fa-calendar-alt", text: "Расписание", page: "schedule" },
        { icon: "fas fa-file-alt", text: "Материалы", page: "materials" },
        { icon: "fas fa-comments", text: "Сообщения", page: "messages" },
        { icon: "fas fa-portrait", text: "Портфолио", page: "portfolio" },
        { icon: "fas fa-cog", text: "Настройки", page: "settings" },
      ];
    } else {
      menuItems = [
        { icon: "fas fa-home", text: "Главная", page: "profile" },
        { icon: "fas fa-book-open", text: "Мои кружки", page: "circles" },
        { icon: "fas fa-chart-line", text: "Мои оценки", page: "grades" },
        {
          icon: "fas fa-calendar-alt",
          text: "Мое расписание",
          page: "schedule",
        },
        { icon: "fas fa-file-alt", text: "Мои материалы", page: "materials" },
        { icon: "fas fa-comments", text: "Мои сообщения", page: "messages" },
        { icon: "fas fa-portrait", text: "Мое портфолио", page: "portfolio" },
        { icon: "fas fa-cog", text: "Настройки", page: "settings" },
      ];
    }

    DOM.sidebarMenu.innerHTML = menuItems
      .map(
        (item) => `
                    <li>
                        <a href="#" data-page="${item.page}" class="${
          item.page === "profile" ? "active" : ""
        }">
                            <i class="${item.icon}"></i> ${item.text}
                        </a>
                    </li>
                `
      )
      .join("");

    // Назначаем обработчики для пунктов меню
    DOM.sidebarMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const page = this.getAttribute("data-page");
        loadDashboardContent(page);

        // Обновляем активный пункт меню
        DOM.sidebarMenu
          .querySelectorAll("a")
          .forEach((a) => a.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Загрузка кружков на страницу кружков
  async function loadCircles() {
    const allCircles = await getAllCircles();

    appState.circles = await allCircles.map((item) => {
      return {
        id: item.id,
        title: item.name,
        description: item.description,
        category: item.type,
        image: takeImageByType(item.type),
        participants: item.members_count,
      };
    });

    const allCategories = appState.circles.map((item) => item.category);

    const category = allCategories.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    category.unshift("ALL");

    const renderCircles = (circlesArray) => {
      return circlesArray
        .map(
          (circle) => `
                    <div class="circle-card">
                        <div class="circle-image">
                            <img src="${circle.image}" alt="${circle.title}">
                            <span class="circle-category">${takeCategoryByType(
                              circle.category
                            )}</span>
                        </div>
                        <div class="circle-info">
                            <h3>${circle.title}</h3>
                            <p>${circle.description}</p>
                            <div class="circle-meta">
                                <span><i class="fas fa-calendar-alt"></i>Каждый день</span>
                                <span><i class="fas fa-users"></i> ${
                                  circle.participants
                                } участников</span>
                            </div>
                            <div class="circle-actions">
                                <button class="btn transparent-btn view-circle-btn" data-circle-id="${
                                  circle.id
                                }">Подробнее</button>
                                <button class="btn gold-btn join-circle-btn" data-circle-id="${
                                  circle.id
                                }">Записаться</button>
                            </div>
                        </div>
                    </div>
                `
        )
        .join("");
    };

    DOM.circlesCategory.innerHTML = category
      .map(
        (item) => `
            <button data-filter-id=${item} class="filter-btn">${takeCategoryByType(
          item
        )}</button>
        `
      )
      .join("");

    DOM.circlesGrid.innerHTML = renderCircles(appState.circles);

    // Назначаем обработчики для фильтров
    document.querySelectorAll(".filter-btn").forEach((btn, index) => {
      if (index === 0) {
        btn.classList.add("active");
      }
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach((btn) => {
          btn.classList.remove("active");
        });

        this.classList.add("active");

        const filterId = this.getAttribute("data-filter-id");
        const filteredCircles = appState.circles.filter(
          (item) => item.category === filterId
        );
        if (filterId === "ALL") {
          (DOM.circlesGrid.innerHTML = renderCircles(appState.circles));
          return cirleActionsListeners()
        }
        DOM.circlesGrid.innerHTML = renderCircles(filteredCircles);
        cirleActionsListeners()
      });
    });

    // Назначаем обработчики для кнопок
    const cirleActionsListeners = () => {
      document.querySelectorAll(".view-circle-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const circleId = this.getAttribute("data-circle-id");
          viewCircle(circleId);
        });
      });

      document.querySelectorAll(".join-circle-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const circleId = this.getAttribute("data-circle-id");
          console.log("join");
          joinCircle(circleId);
        });
      });
    };

    cirleActionsListeners();
  }

  // Просмотр информации о кружке
  function viewCircle(circleId) {
    const circle = appState.circles.find(
      (c) => parseInt(c.id) === parseInt(circleId)
    );
    if (!circle) return;

    console.log(DOM);

    DOM.circleModalContent.innerHTML = `
                    <h2>${circle.title}</h2>
                    <div class="circle-image">
                        <img src="${circle.image}" alt="${circle.title}">
                    </div>
                    <div class="circle-info">
                        <p><strong>Категория:</strong> ${takeCategoryByType(
                              circle.category
                            )}</p>
                        <p><strong>Расписание:</strong> Каждый день </p>
                        <p><strong>Участников:</strong> ${circle.participants}</p>
                        <p><strong>Описание:</strong> ${circle.description}</p>
                    </div>
                    <div class="form-actions">
                           <button id="loginFromCircleBtn" class="btn gold-btn join-circle-btn" data-circle-id="${circle.id}">Записаться</button>
                    </div>
                `;

    showModal(DOM.circleModal);

      document
        .getElementById("loginFromCircleBtn")
        .addEventListener("click", function () {
          localStorage.setItem("targetCircle", circle.id);
          hideModal(DOM.circleModal);
          showModal(DOM.loginModal);
        });
  }

  // Запись в кружок
  function joinCircle(circleId) {
    if (!appState.isLoggedIn) {
      localStorage.setItem("targetCircle", circleId);
      showModal(DOM.loginModal);
      return;
    }
  }

  // Выход из кружка
  function leaveCircle(circleId) {
    const circle = appState.circles.find((c) => c.id === circleId);
    if (circle && circle.participants > 0) {
      circle.participants--;
      showToast("Вы вышли из кружка", "success");
      loadDashboardContent("circles");
    }
  }

  // Показ модального окна добавления кружка (для администратора)
  function showAddCircleModal() {
    DOM.circleModalContent.innerHTML = `
                    <h2>Добавить новый кружок</h2>
                    <form id="addCircleForm">
                        <div class="form-group">
                            <label for="newCircleTitle">Название</label>
                            <input type="text" id="newCircleTitle" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="newCircleDescription">Описание</label>
                            <textarea id="newCircleDescription" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newCircleCategory">Категория</label>
                                <select id="newCircleCategory" class="form-control" required>
                                    <option value="Гуманитарные">Гуманитарные</option>
                                    <option value="Технические">Технические</option>
                                    <option value="Творческие">Творческие</option>
                                    <option value="Спортивные">Спортивные</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="newCircleSchedule">Расписание</label>
                                <input type="text" id="newCircleSchedule" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="newCircleImage">Изображение (URL)</label>
                            <input type="text" id="newCircleImage" class="form-control" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Добавить</button>
                        </div>
                    </form>
                `;

    showModal(DOM.circleModal);

    document
      .getElementById("addCircleForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const newCircle = {
          id: appState.circles.length + 1,
          title: document.getElementById("newCircleTitle").value,
          description: document.getElementById("newCircleDescription").value,
          category: document.getElementById("newCircleCategory").value,
          schedule: document.getElementById("newCircleSchedule").value,
          image: document.getElementById("newCircleImage").value,
          participants: 0,
        };

        appState.circles.push(newCircle);
        hideModal(DOM.circleModal);
        showToast("Кружок успешно добавлен", "success");
        loadDashboardContent("circles");
      });
  }

  // Показ модального окна редактирования кружка
  function showEditCircleModal(circleId) {
    const circle = appState.circles.find((c) => c.id === circleId);
    if (!circle) return;

    DOM.circleModalContent.innerHTML = `
                    <h2>Редактировать кружок</h2>
                    <form id="editCircleForm">
                        <div class="form-group">
                            <label for="editCircleTitle">Название</label>
                            <input type="text" id="editCircleTitle" class="form-control" value="${
                              circle.title
                            }" required>
                        </div>
                        <div class="form-group">
                            <label for="editCircleDescription">Описание</label>
                            <textarea id="editCircleDescription" class="form-control" rows="3" required>${
                              circle.description
                            }</textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editCircleCategory">Категория</label>
                                <select id="editCircleCategory" class="form-control" required>
                                    <option value="Гуманитарные" ${
                                      circle.category === "Гуманитарные"
                                        ? "selected"
                                        : ""
                                    }>Гуманитарные</option>
                                    <option value="Технические" ${
                                      circle.category === "Технические"
                                        ? "selected"
                                        : ""
                                    }>Технические</option>
                                    <option value="Творческие" ${
                                      circle.category === "Творческие"
                                        ? "selected"
                                        : ""
                                    }>Творческие</option>
                                    <option value="Спортивные" ${
                                      circle.category === "Спортивные"
                                        ? "selected"
                                        : ""
                                    }>Спортивные</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editCircleSchedule">Расписание</label>
                                <input type="text" id="editCircleSchedule" class="form-control" value="${
                                  circle.schedule
                                }" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="editCircleImage">Изображение (URL)</label>
                            <input type="text" id="editCircleImage" class="form-control" value="${
                              circle.image
                            }" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Сохранить</button>
                        </div>
                    </form>
                `;

    showModal(DOM.circleModal);

    document
      .getElementById("editCircleForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        circle.title = document.getElementById("editCircleTitle").value;
        circle.description = document.getElementById(
          "editCircleDescription"
        ).value;
        circle.category = document.getElementById("editCircleCategory").value;
        circle.schedule = document.getElementById("editCircleSchedule").value;
        circle.image = document.getElementById("editCircleImage").value;

        hideModal(DOM.circleModal);
        showToast("Кружок успешно обновлен", "success");
        loadDashboardContent("circles");
      });
  }

  // Удаление кружка
  function deleteCircle(circleId) {
    if (confirm("Вы уверены, что хотите удалить этот кружок?")) {
      appState.circles = appState.circles.filter((c) => c.id !== circleId);
      showToast("Кружок успешно удален", "success");
      loadDashboardContent("circles");
    }
  }

  // Показ модального окна добавления оценки
  function showAddGradeModal() {
    DOM.gradeModalTitle.textContent = "Добавить оценку";

    // Заполняем список кружков
    const circleSelect = document.getElementById("gradeCircle");
    circleSelect.innerHTML = appState.circles
      .map((c) => `<option value="${c.id}">${c.title}</option>`)
      .join("");

    // Заполняем список студентов
    const studentSelect = document.getElementById("gradeStudent");
    studentSelect.innerHTML = appState.students
      .map((s) => `<option value="${s.id}">${s.name}</option>`)
      .join("");

    // Сбрасываем форму
    document.getElementById("gradeValue").value = "";
    document.getElementById("gradeComment").value = "";

    showModal(DOM.gradeModal);
  }

  // Показ модального окна редактирования оценки
  function showEditGradeModal(gradeId) {
    const grade = appState.grades.find((g) => g.id === gradeId);
    if (!grade) return;

    DOM.gradeModalTitle.textContent = "Редактировать оценку";

    // Заполняем список кружков
    const circleSelect = document.getElementById("gradeCircle");
    circleSelect.innerHTML = appState.circles
      .map(
        (c) =>
          `<option value="${c.id}" ${
            c.id === grade.circleId ? "selected" : ""
          }>${c.title}</option>`
      )
      .join("");

    // Заполняем список студентов
    const studentSelect = document.getElementById("gradeStudent");
    studentSelect.innerHTML = appState.students
      .map(
        (s) =>
          `<option value="${s.id}" ${
            s.id === grade.studentId ? "selected" : ""
          }>${s.name}</option>`
      )
      .join("");

    // Заполняем остальные поля
    document.getElementById("gradeValue").value = grade.value;
    document.getElementById("gradeComment").value = grade.comment || "";

    showModal(DOM.gradeModal);

    // Обработчик отправки формы
    DOM.gradeForm.onsubmit = function (e) {
      e.preventDefault();

      grade.circleId = parseInt(circleSelect.value);
      grade.studentId = parseInt(studentSelect.value);
      grade.value = parseFloat(document.getElementById("gradeValue").value);
      grade.comment = document.getElementById("gradeComment").value;
      grade.date = new Date().toISOString().split("T")[0];

      hideModal(DOM.gradeModal);
      showToast("Оценка успешно обновлена", "success");
      loadDashboardContent("grades");
    };
  }

  // Удаление оценки
  function deleteGrade(gradeId) {
    if (confirm("Вы уверены, что хотите удалить эту оценку?")) {
      appState.grades = appState.grades.filter((g) => g.id !== gradeId);
      showToast("Оценка успешно удалена", "success");
      loadDashboardContent("grades");
    }
  }

  // Показ модального окна добавления события
  function showAddEventModal() {
    // Заполняем список кружков
    const circleSelect = document.createElement("select");
    circleSelect.id = "eventCircle";
    circleSelect.className = "form-control";
    circleSelect.innerHTML = appState.circles
      .map((c) => `<option value="${c.id}">${c.title}</option>`)
      .join("");

    DOM.circleModalContent.innerHTML = `
                    <h2>Добавить новое событие</h2>
                    <form id="eventForm">
                        <div class="form-group">
                            <label for="eventTitle">Название события</label>
                            <input type="text" id="eventTitle" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="eventCircle">Кружок</label>
                            <div id="circleSelectContainer"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="eventDate">Дата</label>
                                <input type="date" id="eventDate" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="eventTime">Время</label>
                                <input type="text" id="eventTime" class="form-control" placeholder="14:00-16:00" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="eventLocation">Место проведения</label>
                            <input type="text" id="eventLocation" class="form-control" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Добавить</button>
                        </div>
                    </form>
                `;

    document.getElementById("circleSelectContainer").appendChild(circleSelect);
    showModal(DOM.circleModal);

    document
      .getElementById("eventForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const newEvent = {
          id: appState.events.length + 1,
          title: document.getElementById("eventTitle").value,
          circleId: parseInt(document.getElementById("eventCircle").value),
          date: document.getElementById("eventDate").value,
          time: document.getElementById("eventTime").value,
          location: document.getElementById("eventLocation").value,
        };

        appState.events.push(newEvent);
        hideModal(DOM.circleModal);
        showToast("Событие успешно добавлено", "success");
        loadDashboardContent("schedule");
      });
  }

  // Показ модального окна редактирования события
  function showEditEventModal(eventId) {
    const event = appState.events.find((e) => e.id === eventId);
    if (!event) return;

    // Заполняем список кружков
    const circleSelect = document.createElement("select");
    circleSelect.id = "eventCircle";
    circleSelect.className = "form-control";
    circleSelect.innerHTML = appState.circles
      .map(
        (c) =>
          `<option value="${c.id}" ${
            c.id === event.circleId ? "selected" : ""
          }>${c.title}</option>`
      )
      .join("");

    DOM.circleModalContent.innerHTML = `
                    <h2>Редактировать событие</h2>
                    <form id="eventForm">
                        <div class="form-group">
                            <label for="eventTitle">Название события</label>
                            <input type="text" id="eventTitle" class="form-control" value="${event.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="eventCircle">Кружок</label>
                            <div id="circleSelectContainer"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="eventDate">Дата</label>
                                <input type="date" id="eventDate" class="form-control" value="${event.date}" required>
                            </div>
                            <div class="form-group">
                                <label for="eventTime">Время</label>
                                <input type="text" id="eventTime" class="form-control" value="${event.time}" placeholder="14:00-16:00" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="eventLocation">Место проведения</label>
                            <input type="text" id="eventLocation" class="form-control" value="${event.location}" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Сохранить</button>
                        </div>
                    </form>
                `;

    document.getElementById("circleSelectContainer").appendChild(circleSelect);
    showModal(DOM.circleModal);

    document
      .getElementById("eventForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        event.title = document.getElementById("eventTitle").value;
        event.circleId = parseInt(document.getElementById("eventCircle").value);
        event.date = document.getElementById("eventDate").value;
        event.time = document.getElementById("eventTime").value;
        event.location = document.getElementById("eventLocation").value;

        hideModal(DOM.circleModal);
        showToast("Событие успешно обновлено", "success");
        loadDashboardContent("schedule");
      });
  }

  // Удаление события
  function deleteEvent(eventId) {
    if (confirm("Вы уверены, что хотите удалить это событие?")) {
      appState.events = appState.events.filter((e) => e.id !== eventId);
      showToast("Событие успешно удалено", "success");
      loadDashboardContent("schedule");
    }
  }

  // Показ модального окна добавления материала
  function showAddMaterialModal() {
    // Заполняем список кружков
    const circleSelect = document.createElement("select");
    circleSelect.id = "materialCircle";
    circleSelect.className = "form-control";
    circleSelect.innerHTML = appState.circles
      .map((c) => `<option value="${c.id}">${c.title}</option>`)
      .join("");

    DOM.circleModalContent.innerHTML = `
                    <h2>Добавить новый материал</h2>
                    <form id="materialForm">
                        <div class="form-group">
                            <label for="materialTitle">Название</label>
                            <input type="text" id="materialTitle" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="materialDescription">Описание</label>
                            <textarea id="materialDescription" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="materialCircle">Кружок</label>
                            <div id="circleSelectContainer"></div>
                        </div>
                        <div class="form-group">
                            <label for="materialFile">Файл</label>
                            <input type="file" id="materialFile" class="form-control">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Добавить</button>
                        </div>
                    </form>
                `;

    document.getElementById("circleSelectContainer").appendChild(circleSelect);
    showModal(DOM.circleModal);

    document
      .getElementById("materialForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const fileInput = document.getElementById("materialFile");
        const fileName =
          fileInput.files.length > 0 ? fileInput.files[0].name : "material.pdf";

        const newMaterial = {
          id: appState.materials.length + 1,
          title: document.getElementById("materialTitle").value,
          description: document.getElementById("materialDescription").value,
          circleId: parseInt(document.getElementById("materialCircle").value),
          file: fileName,
        };

        appState.materials.push(newMaterial);
        hideModal(DOM.circleModal);
        showToast("Материал успешно добавлен", "success");
        loadDashboardContent("materials");
      });
  }

  // Показ модального окна редактирования материала
  function showEditMaterialModal(materialId) {
    const material = appState.materials.find((m) => m.id === materialId);
    if (!material) return;

    // Заполняем список кружков
    const circleSelect = document.createElement("select");
    circleSelect.id = "materialCircle";
    circleSelect.className = "form-control";
    circleSelect.innerHTML = appState.circles
      .map(
        (c) =>
          `<option value="${c.id}" ${
            c.id === material.circleId ? "selected" : ""
          }>${c.title}</option>`
      )
      .join("");

    DOM.circleModalContent.innerHTML = `
                    <h2>Редактировать материал</h2>
                    <form id="materialForm">
                        <div class="form-group">
                            <label for="materialTitle">Название</label>
                            <input type="text" id="materialTitle" class="form-control" value="${material.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="materialDescription">Описание</label>
                            <textarea id="materialDescription" class="form-control" rows="3">${material.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="materialCircle">Кружок</label>
                            <div id="circleSelectContainer"></div>
                        </div>
                        <div class="form-group">
                            <label for="materialFile">Файл (текущий: ${material.file})</label>
                            <input type="file" id="materialFile" class="form-control">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Сохранить</button>
                        </div>
                    </form>
                `;

    document.getElementById("circleSelectContainer").appendChild(circleSelect);
    showModal(DOM.circleModal);

    document
      .getElementById("materialForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const fileInput = document.getElementById("materialFile");
        const fileName =
          fileInput.files.length > 0 ? fileInput.files[0].name : material.file;

        material.title = document.getElementById("materialTitle").value;
        material.description = document.getElementById(
          "materialDescription"
        ).value;
        material.circleId = parseInt(
          document.getElementById("materialCircle").value
        );
        material.file = fileName;

        hideModal(DOM.circleModal);
        showToast("Материал успешно обновлен", "success");
        loadDashboardContent("materials");
      });
  }

  // Удаление материала
  function deleteMaterial(materialId) {
    if (confirm("Вы уверены, что хотите удалить этот материал?")) {
      appState.materials = appState.materials.filter(
        (m) => m.id !== materialId
      );
      showToast("Материал успешно удален", "success");
      loadDashboardContent("materials");
    }
  }

  // Загрузка материала
  function downloadMaterial(materialId) {
    const material = appState.materials.find((m) => m.id === materialId);
    if (material) {
      showToast(`Начата загрузка файла: ${material.file}`, "success");
      // В реальном приложении здесь будет запрос к серверу для скачивания файла
    }
  }

  // Показ модального окна нового сообщения
  function showNewMessageModal() {
    // Заполняем список получателей
    const recipientSelect = document.createElement("select");
    recipientSelect.id = "messageRecipient";
    recipientSelect.className = "form-control";

    if (appState.currentUser.role === "admin") {
      // Администратор может писать всем студентам
      recipientSelect.innerHTML = appState.students
        .map((s) => `<option value="${s.id}">${s.name}</option>`)
        .join("");
    } else {
      // Студент может писать только администратору
      recipientSelect.innerHTML =
        '<option value="admin">Администратор</option>';
    }

    DOM.circleModalContent.innerHTML = `
                    <h2>Новое сообщение</h2>
                    <form id="messageForm">
                        <div class="form-group">
                            <label for="messageRecipient">Получатель</label>
                            <div id="recipientSelectContainer"></div>
                        </div>
                        <div class="form-group">
                            <label for="messageSubject">Тема</label>
                            <input type="text" id="messageSubject" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="messageText">Текст сообщения</label>
                            <textarea id="messageText" class="form-control" rows="5" required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Отправить</button>
                        </div>
                    </form>
                `;

    document
      .getElementById("recipientSelectContainer")
      .appendChild(recipientSelect);
    showModal(DOM.circleModal);

    document
      .getElementById("messageForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const newMessage = {
          id: appState.messages.length + 1,
          from:
            appState.currentUser.role === "admin"
              ? "admin"
              : appState.currentUser.id,
          to: document.getElementById("messageRecipient").value,
          subject: document.getElementById("messageSubject").value,
          text: document.getElementById("messageText").value,
          date: new Date().toISOString().split("T")[0],
        };

        appState.messages.push(newMessage);
        hideModal(DOM.circleModal);
        showToast("Сообщение успешно отправлено", "success");
        loadDashboardContent("messages");
      });
  }

  // Показ модального окна добавления работы в портфолио
  function showAddPortfolioModal() {
    DOM.circleModalContent.innerHTML = `
                    <h2>Добавить работу в портфолио</h2>
                    <form id="portfolioForm">
                        <div class="form-group">
                            <label for="portfolioTitle">Название работы</label>
                            <input type="text" id="portfolioTitle" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="portfolioDescription">Описание</label>
                            <textarea id="portfolioDescription" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="portfolioFile">Файл работы</label>
                            <input type="file" id="portfolioFile" class="form-control" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Добавить</button>
                        </div>
                    </form>
                `;

    showModal(DOM.circleModal);

    document
      .getElementById("portfolioForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const fileInput = document.getElementById("portfolioFile");
        const fileName =
          fileInput.files.length > 0 ? fileInput.files[0].name : "work.pdf";

        const newPortfolioItem = {
          id: appState.portfolio.length + 1,
          studentId: appState.currentUser.id,
          title: document.getElementById("portfolioTitle").value,
          description: document.getElementById("portfolioDescription").value,
          file: fileName,
        };

        appState.portfolio.push(newPortfolioItem);
        hideModal(DOM.circleModal);
        showToast("Работа успешно добавлена в портфолио", "success");
        loadDashboardContent("portfolio");
      });
  }

  // Показ модального окна редактирования работы в портфолио
  function showEditPortfolioModal(portfolioId) {
    const portfolioItem = appState.portfolio.find((p) => p.id === portfolioId);
    if (!portfolioItem) return;

    DOM.circleModalContent.innerHTML = `
                    <h2>Редактировать работу в портфолио</h2>
                    <form id="portfolioForm">
                        <div class="form-group">
                            <label for="portfolioTitle">Название работы</label>
                            <input type="text" id="portfolioTitle" class="form-control" value="${portfolioItem.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="portfolioDescription">Описание</label>
                            <textarea id="portfolioDescription" class="form-control" rows="3">${portfolioItem.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="portfolioFile">Файл работы (текущий: ${portfolioItem.file})</label>
                            <input type="file" id="portfolioFile" class="form-control">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn transparent-btn close-modal-btn">Отмена</button>
                            <button type="submit" class="btn gold-btn">Сохранить</button>
                        </div>
                    </form>
                `;

    showModal(DOM.circleModal);

    document
      .getElementById("portfolioForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const fileInput = document.getElementById("portfolioFile");
        const fileName =
          fileInput.files.length > 0
            ? fileInput.files[0].name
            : portfolioItem.file;

        portfolioItem.title = document.getElementById("portfolioTitle").value;
        portfolioItem.description = document.getElementById(
          "portfolioDescription"
        ).value;
        portfolioItem.file = fileName;

        hideModal(DOM.circleModal);
        showToast("Работа в портфолио успешно обновлена", "success");
        loadDashboardContent("portfolio");
      });
  }

  // Просмотр работы из портфолио
  function viewPortfolioItem(portfolioId) {
    const portfolioItem = appState.portfolio.find((p) => p.id === portfolioId);
    if (!portfolioItem) return;

    DOM.circleModalContent.innerHTML = `
                    <h2>${portfolioItem.title}</h2>
                    <p>${portfolioItem.description}</p>
                    <div class="form-actions">
                        <button class="btn transparent-btn close-modal-btn">Закрыть</button>
                        <button class="btn gold-btn download-portfolio-btn" data-id="${portfolioItem.id}">Скачать</button>
                    </div>
                `;

    showModal(DOM.circleModal);

    document
      .querySelector(".download-portfolio-btn")
      .addEventListener("click", function () {
        downloadPortfolioItem(portfolioItem.id);
      });
  }

  // Удаление работы из портфолио
  function deletePortfolioItem(portfolioId) {
    if (confirm("Вы уверены, что хотите удалить эту работу из портфолио?")) {
      appState.portfolio = appState.portfolio.filter(
        (p) => p.id !== portfolioId
      );
      showToast("Работа успешно удалена из портфолио", "success");
      loadDashboardContent("portfolio");
    }
  }

  // Загрузка работы из портфолио
  function downloadPortfolioItem(portfolioId) {
    const portfolioItem = appState.portfolio.find((p) => p.id === portfolioId);
    if (portfolioItem) {
      showToast(`Начата загрузка файла: ${portfolioItem.file}`, "success");
      // В реальном приложении здесь будет запрос к серверу для скачивания файла
    }
  }

  // Сохранение настроек
  function saveSettings(e) {
    e.preventDefault();
    showToast("Настройки успешно сохранены", "success");
  }

  // Обработка входа в систему
  async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Проверяем, что поля не пустые
    if (!email || !password) {
      showToast("Пожалуйста, заполните все поля", "error");
      return;
    }

    fetchLogin(email, password, showToast);
  }

  // Обработка регистрации
  async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;
    const role = document.getElementById("regUserType").value;
    const adminCode = document.getElementById("adminCode").value;

    // Простая валидация
    if (!name || !email || !password || !confirmPassword) {
      showToast("Пожалуйста, заполните все обязательные поля", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Пароли не совпадают", "error");
      return;
    }

    if (role === "admin" && adminCode !== "admin123") {
      showToast("Неверный код доступа администратора", "error");
      return;
    }

    await fetchRegistration(name, email, password, role, showToast);

    // Создаем нового пользователя
    // const newUser = {
    //     id: appState.students.length + 1,
    //     name: name,
    //     email: email,
    //     role: userType === 'admin' ? 'admin' : 'student'
    // };

    // appState.currentUser = newUser;
    // appState.isLoggedIn = true;

    // if (userType === 'student') {
    //     appState.students.push(newUser);
    // }

    // localStorage.setItem('currentUser', JSON.stringify(newUser));

    // hideModal(DOM.registerModal);
    // updateUI();
    // showPage('dashboard');
    // loadDashboardContent('profile');
  }

  // Обработка выхода из системы
  function handleLogout() {
    if (confirm("Вы уверены, что хотите выйти?")) {
      appState.currentUser = null;
      appState.isLoggedIn = false;
      localStorage.removeItem("currentUser");

      updateUI();
      showPage("home");

      showToast("Вы успешно вышли из системы", "success");
    }
  }

  // Обновление интерфейса после входа/выхода
  function updateUI() {
    if (appState.isLoggedIn) {
      DOM.authButtons.style.display = "none";
      DOM.userControls.style.display = "flex";

      // Обновляем данные пользователя
      if (appState.currentUser) {
        document.getElementById("userName").textContent =
          appState.currentUser.name;
        document.getElementById("userRole").textContent =
          appState.currentUser.role === "admin" ? "Администратор" : "Участник";

        // Заполняем данные в модальном окне профиля
        document.getElementById("userFullName").value =
          appState.currentUser.name;
        document.getElementById("userEmail").value =
          appState.currentUser.email || "";
      }
    } else {
      DOM.authButtons.style.display = "flex";
      DOM.userControls.style.display = "none";
    }
  }

  // Обработка загрузки аватарки
  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        DOM.avatarPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Сохранение профиля
  function saveProfile() {
    const newName = document.getElementById("userFullName").value.trim();
    const newEmail = document.getElementById("userEmail").value.trim();
    const newPhone = document.getElementById("userPhone").value.trim();
    const newAvatar = DOM.avatarPreview.src;

    if (newName) {
      appState.currentUser.name = newName;
      appState.currentUser.email = newEmail;
      appState.currentUser.phone = newPhone;

      if (newAvatar) {
        appState.currentUser.avatar = newAvatar;
        DOM.avatarImg.src = newAvatar;
      }

      // Обновляем данные в списке студентов (если это студент)
      const student = appState.students.find(
        (s) => s.id === appState.currentUser.id
      );
      if (appState.currentUser.role === "student") {
        if (student) {
          student.name = newName;
          student.email = newEmail;
        }
      }

      // Обновляем UI
      document.getElementById("userName").textContent = newName;

      hideModal(DOM.profileModal);
      showToast("Профиль успешно обновлен", "success");
    } else {
      showToast("Пожалуйста, укажите ФИО", "error");
    }
  }

  // Расчет среднего балла
  function calculateAverageGrade() {
    if (appState.currentUser.role === "admin") return 0;

    const studentGrades = appState.grades.filter(
      (g) => g.studentId === appState.currentUser.id
    );
    if (studentGrades.length === 0) return 0;

    const sum = studentGrades.reduce((total, grade) => total + grade.value, 0);
    return (sum / studentGrades.length).toFixed(1);
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

  // Показ уведомления
  function showToast(message, type) {
    const toast = DOM.toast;
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Запуск приложения
  init();
});
