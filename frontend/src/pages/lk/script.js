// script.js

const getProfileData = async () => {
    try {
        // Извлекаем токен
        const token = localStorage.getItem('token') 
        const response = await fetch('http://localhost:5000/api/user/profile/', {
            method: 'GET',
            credentials: 'include', 
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            const errorData = await response.json(); 

            // Проверяем наличие ошибок и выводим их
            if (errorData.errors && Array.isArray(errorData.errors)) {
                errorData.errors.forEach(error => {
                    showToast(error.message, 'error');
                });
                window.location.href = '/';
            } else {
                window.location.href = '/';
                showToast('Произошла ошибка при входе', 'error');
            }
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        return data;
        
        // showToast('Вы успешно вошли в систему', 'success');

        // hideModal(DOM.loginModal);

        // Здесь вы можете добавить логику для обновления состояния приложения после успешного входа:
        // appState.currentUser = data.user; // Например, если сервер возвращает пользователя
        // appState.isLoggedIn = true;
        // localStorage.setItem('currentUser', JSON.stringify(data.user));
        
    } catch (error) {
        console.error('Error:', error); // Обрабатываем ошибку
        window.location.href = '/';
    }
}

const fetchLogout = async () => {
    try {
        // Извлекаем токен
        const token = localStorage.getItem('token') 
        const response = await fetch('http://localhost:5000/api/auth/logout/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            const errorData = await response.json(); 

            // Проверяем наличие ошибок и выводим их
            if (errorData.errors && Array.isArray(errorData.errors)) {
                errorData.errors.forEach(error => {
                    showToast(error.message, 'error');
                });
            } else {
                showToast('Произошла ошибка при входе', 'error');
            }
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        window.location.href = '/';
        localStorage.removeItem('token')
        return data;
    } catch (error) {
        console.error('Error:', error); // Обрабатываем ошибку
        // window.location.href = '/';
    }
}

const updateProfile = async (username, avatar) => {
    try {
        // Извлекаем токен
        const token = localStorage.getItem('token')
        const formData = new FormData();
        formData.append('username', username);
        formData.append('avatar', avatar); 
        const response = await fetch('http://localhost:5000/api/user/update-info/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` 
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json(); 

            // Проверяем наличие ошибок и выводим их
            if (errorData.errors && Array.isArray(errorData.errors)) {
                errorData.errors.forEach(error => {
                    showToast(error.message, 'error');
                });
                window.location.href = '/';
            } else {
                window.location.href = '/';
                showToast('Произошла ошибка при входе', 'error');
            }
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        return data;
        
        // showToast('Вы успешно вошли в систему', 'success');

        // hideModal(DOM.loginModal);

        // Здесь вы можете добавить логику для обновления состояния приложения после успешного входа:
        // appState.currentUser = data.user; // Например, если сервер возвращает пользователя
        // appState.isLoggedIn = true;
        // localStorage.setItem('currentUser', JSON.stringify(data.user));
        
    } catch (error) {
        console.error('Error:', error); // Обрабатываем ошибку
        window.location.href = '/';
    }
}

function getRoleName(role) {
    if (role === 'admin') {
        return 'Администратор';
    }
    
    return 'Участник';
}

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const mainContent = document.getElementById('mainContent');
    const dashboardContent = document.getElementById('dashboardContent');
    const otherContent = document.getElementById('otherContent');
    const navLinks = document.querySelectorAll('nav ul li a, .sidebar-menu li a');
    const logoutBtn = document.getElementById('logoutBtn');
    const userAvatarBtn = document.getElementById('userAvatarBtn');
    const editAvatarBtn = document.getElementById('editAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const closeModalBtns = document.querySelectorAll('.close-btn, .close-modal-btn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarImg = document.getElementById('avatarImg');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const userFullName = document.getElementById('userFullName');
    const userName = document.getElementById('userName');
    const addCircleModal = document.getElementById('addCircleModal');
    const addCircleSaveBtn = document.getElementById('addCircleSaveBtn');

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
            messages: 5
        },
        circles: [
            {
                id: 1,
                title: "Программирование на Python",
                description: "Изучение основ программирования на языке Python для начинающих",
                category: "Программирование",
                image: "https://source.unsplash.com/random/300x200/?python"
            },
            {
                id: 2,
                title: "Математический анализ",
                description: "Углубленное изучение математического анализа для старшеклассников",
                category: "Математика",
                image: "https://source.unsplash.com/random/300x200/?math"
            },
            {
                id: 3,
                title: "Английский язык",
                description: "Разговорный английский язык для среднего уровня",
                category: "Языки",
                image: "https://source.unsplash.com/random/300x200/?english"
            }
        ],
        grades: [
            {
                id: 1,
                subject: "Программирование на Python",
                value: 5.0,
                date: "2023-05-15",
                comment: "Отличная работа над проектом"
            },
            {
                id: 2,
                subject: "Математический анализ",
                value: 4.5,
                date: "2023-05-10",
                comment: "Хорошо, но есть над чем работать"
            },
            {
                id: 3,
                subject: "Английский язык",
                value: 4.0,
                date: "2023-05-05",
                comment: "Старайтесь больше практиковать разговорную речь"
            }
        ]
    };

    // Инициализация приложения
    async function initApp() {
        // Загружаем данные пользователя
        await loadUserData();
        
        // Показываем главную страницу
        showPage('dashboard');
        
        // Генерируем контент для главной страницы
        generateDashboardContent();

    }

    // Загрузка данных пользователя
    async function loadUserData() {
        const userData = await getProfileData();
        userName.textContent = userData.username;
        document.getElementById('userRole').textContent = getRoleName(userData.role);
        
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
        dashboardContent.style.display = 'none';
        otherContent.style.display = 'none';
        
        // Убираем активный класс у всех ссылок
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Добавляем активный класс к текущей ссылке
        document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
            link.classList.add('active');
        });
        
        // Показываем нужный контент
        if (page === 'dashboard') {
            dashboardContent.style.display = 'block';
            generateDashboardContent();
        } else {
            otherContent.style.display = 'block';
            otherContent.innerHTML = `<h2>${getPageTitle(page)}</h2><p>Контент для страницы "${getPageTitle(page)}" будет здесь.</p>`;
            
            // Генерируем специфический контент для некоторых страниц
            if (page === 'circles') {
                generateCirclesContent();
            } else if (page === 'grades') {
                generateGradesContent();
            }
        }
    }

    // Получение заголовка страницы
    function getPageTitle(page) {
        const titles = {
            'dashboard': 'Главная',
            'circles': 'Мои кружки',
            'grades': 'Успеваемость',
            'schedule': 'Расписание',
            'materials': 'Материалы',
            'messages': 'Сообщения',
            'portfolio': 'Портфолио',
            'settings': 'Настройки'
        };
        return titles[page] || page;
    }

    // Генерация контента для главной страницы
    function generateDashboardContent() {
        dashboardContent.innerHTML = `
            <div class="section-header">
                <h2>Добро пожаловать, ${currentUser.name.split(' ')[1] ?? currentUser.name.split(' ')[0]}!</h2>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="stat-number">${currentUser.stats.circles}</div>
                    <div class="stat-title">Мои кружки</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-number">${currentUser.stats.materials}</div>
                    <div class="stat-title">Материалы</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-number">${currentUser.stats.grades}</div>
                    <div class="stat-title">Средний балл</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="stat-number">${currentUser.stats.messages}</div>
                    <div class="stat-title">Новые сообщения</div>
                </div>
            </div>
            
            <div class="section-header">
                <h2>Мои кружки</h2>
                <button class="btn gold-btn" id="addCircleBtn">Добавить кружок</button>
            </div>
            
            <div class="circles-grid" id="circlesGrid"></div>
            
            <div class="section-header">
                <h2>Последние оценки</h2>
            </div>
            
            <div class="grades-container" id="gradesContainer"></div>
        `;
        
        // Генерируем карточки кружков
        generateCirclesGrid();
        
        // Генерируем последние оценки
        generateGradesGrid();
        
        // Добавляем обработчик для кнопки добавления кружка
        document.getElementById('addCircleBtn').addEventListener('click', function() {
            addCircleModal.style.display = 'flex';
        });
    }

    // Генерация сетки кружков
    function generateCirclesGrid() {
        const circlesGrid = document.getElementById('circlesGrid');
        if (!circlesGrid) return;
        
        circlesGrid.innerHTML = '';
        
        currentUser.circles.forEach(circle => {
            const circleCard = document.createElement('div');
            circleCard.className = 'circle-card';
            circleCard.innerHTML = `
                <div class="circle-image">
                    <img src="${circle.image}" alt="${circle.title}">
                    <span class="circle-category">${circle.category}</span>
                </div>
                <div class="circle-info">
                    <h3>${circle.title}</h3>
                    <p>${circle.description}</p>
                    <div class="circle-actions">
                        <button class="btn transparent-btn">Подробнее</button>
                        <button class="btn danger-btn" data-circle-id="${circle.id}">Выйти</button>
                    </div>
                </div>
            `;
            circlesGrid.appendChild(circleCard);
        });
    }

    // Генерация сетки оценок
    function generateGradesGrid() {
        const gradesContainer = document.getElementById('gradesContainer');
        if (!gradesContainer) return;
        
        gradesContainer.innerHTML = '';
        
        currentUser.grades.forEach(grade => {
            const gradeCard = document.createElement('div');
            gradeCard.className = 'grade-card';
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
    function generateCirclesContent() {
        otherContent.innerHTML = `
            <div class="section-header">
                <h2>Мои кружки</h2>
                <button class="btn gold-btn" id="addCircleBtn">Добавить кружок</button>
            </div>
            
            <div class="circles-grid" id="circlesGrid"></div>
        `;
        
        generateCirclesGrid();
        
        // Добавляем обработчик для кнопки добавления кружка
        document.getElementById('addCircleBtn').addEventListener('click', function() {
            addCircleModal.style.display = 'flex';
        });
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
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Скрытие модального окна
    function hideModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Обработчики событий

    // Переключение между страницами
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });

    // Выход из системы
    logoutBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            fetchLogout()
            // В реальном приложении здесь будет перенаправление на страницу входа
            alert('Вы вышли из системы');
        }
    });

    // Открытие модального окна профиля
    userAvatarBtn.addEventListener('click', function() {
        showModal(avatarModal);
    });

    editAvatarBtn.addEventListener('click', function() {
        showModal(avatarModal);
    });

    // Закрытие модальных окон
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    // Загрузка аватарки
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        currentUser.avatarFile = e.target.files[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Сохранение профиля
    saveProfileBtn.addEventListener('click', async function() {
        const newName = userFullName.value.trim();
        const newAvatar = avatarPreview.src;
        console.log(avatarPreview)
        
        if (newName) {
            currentUser.name = newName;
            userName.textContent = newName;
            
            if (newAvatar) {
                currentUser.avatar = newAvatar;
                avatarImg.src = newAvatar;
            }
            try {
                await updateProfile(newName, currentUser.avatarFile, showToast)
                hideModal(avatarModal);
                window.location.reload();
            } catch(error) {
                showToast(error, 'error');
            }
        } else {
            showToast('Пожалуйста, введите ФИО', 'error');
        }
    });

    // Добавление нового кружка
    addCircleSaveBtn.addEventListener('click', function() {
        const title = document.getElementById('circleTitle').value.trim();
        const description = document.getElementById('circleDescription').value.trim();
        const category = document.getElementById('circleCategory').value;
        
        if (title && description && category) {
            const newCircle = {
                id: currentUser.circles.length + 1,
                title: title,
                description: description,
                category: category,
                image: "https://source.unsplash.com/random/300x200/?education"
            };
            
            currentUser.circles.push(newCircle);
            currentUser.stats.circles++;
            
            // Очищаем форму
            document.getElementById('circleTitle').value = '';
            document.getElementById('circleDescription').value = '';
            
            hideModal(addCircleModal);
            showToast('Кружок успешно добавлен', 'success');
            
            // Обновляем отображение кружков
            if (dashboardContent.style.display === 'block') {
                generateDashboardContent();
            } else {
                generateCirclesContent();
            }
        } else {
            showToast('Пожалуйста, заполните все поля', 'error');
        }
    });

    // Показ уведомления
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Инициализация категорий кружков
    function initCategories() {
        const categories = ['Программирование', 'Математика', 'Языки', 'Искусство', 'Наука', 'Спорт'];
        const categorySelect = document.getElementById('circleCategory');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Запуск приложения
    initCategories();
    initApp();
});