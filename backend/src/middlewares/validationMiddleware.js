const { body } = require('express-validator');

const validateRegistration = [
    body('username')
        .isString().withMessage('Имя пользователя должно быть строкой')
        .isLength({ min: 3 }).withMessage('Имя пользователя должно содержать не менее 3 символов'),
    body('password')
        .isString().withMessage('Пароль должен быть строкой')
        .isLength({ min: 6 }).withMessage('Пароль должен содержать не менее 6 символов'),
    body('email')
        .isEmail().withMessage('Некорретный Email'),
    body('role')
        .isLength({ min: 1 }).withMessage('Роль не указана')
        .isIn(['student', 'admin']).withMessage('Неверно указана Роль') // Проверка на допустимые роли
];

const validateAuth = [
  body('email')
        .isString().withMessage('Email должен быть строкой')
        .isLength({ min: 3 }).withMessage('Email должен содержать не менее 5 символов'),
    body('password')
        .isString().withMessage('Пароль должен быть строкой')
        .isLength({ min: 6 }).withMessage('Пароль должен содержать не менее 6 символов'),
]

const validateUpdateInfo = [
    body('email')
        .optional()
        .isEmail().withMessage('Некорректный Email'),
    body('username')
        .optional()
        .isString().withMessage('Имя пользователя должно быть строкой')
        .isLength({ min: 3 }).withMessage('Имя пользователя должно содержать не менее 3 символов'),
    body('phone')
        .optional()
        .notEmpty().withMessage("Номер телефона не должен быть пустым")
        .isMobilePhone().withMessage("Некорректный номер телефона"),

]

module.exports = {
    validateRegistration,
    validateAuth,
    validateUpdateInfo
};