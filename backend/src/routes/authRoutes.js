const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateAuth } = require('../middlewares/validationMiddleware');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Регистрация пользователя с валидацией
router.post('/register', validateRegistration, authController.register);

// Авторизация пользователя (пример)
router.post('/login', validateAuth, authController.login);

// Выход пользователя
router.get('/logout', authController.logout)

// Проверка валидности токена
router.get('/check', authController.check)


// Тестовая среда
router.get('/test', authenticateToken, authController.test)

module.exports = router;