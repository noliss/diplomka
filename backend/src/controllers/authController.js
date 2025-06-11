const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/User');
const { handleValidationErrors, getVerifyTokenInfo } = require('../utils/helpers');

// Регистрация пользователя
exports.register = (req, res) => {
    console.log(req.body)
    const validationErrors = handleValidationErrors(req);

    if (validationErrors) {
        return res.status(400).json([...validationErrors]);
    }

    const { username, password, email, role } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
            return res.status(500).json([{ message: 'Ошибка сервера' }]);
        }
        
        if (row) {
            return res.status(400).json([{ message: 'Пользователь уже существует' }]);
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        db.run(`INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`, [username, hashedPassword, email, role], function(err) {
            if (err) {
                return res.status(500).json([{ message: 'Ошибка сервера' }]);
            }
            res.status(201).json({ message: 'Пользователь зарегистрирован' });
        });
    });
};

// Авторизация пользователя
exports.login = (req, res) => {
    const validationErrors = handleValidationErrors(req);

    if (validationErrors) {
        return res.status(400).json([...validationErrors]);
    }

    const { email, password } = req.body;

    // Запрос к базе данных для получения пользователя по имени
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) {
            return res.status(400).json([ { message: 'Неверные учетные данные' }]);
        }

        // Сравнение введенного пароля с хешем из базы данных
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json([{ message: 'Неверные учетные данные' }]);
        }

        // Создание токена JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Возвращаем токен пользователю
        // res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 }); // Установите secure: true в продакшене
        return res.status(200).json({ token });
    });
};

exports.logout = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(200).json([{ message: 'Вы уже вышли из системы' }])
    }

    res.clearCookie('token');
    res.status(200).json({ message: 'Вы вышли из системы' });
}

exports.check = (req, res) => {
    if (!req.headers['authorization']?.length) {
        return res.sendStatus(401);
    }

    // Извлекаем токен из куки
    const token = req.headers['authorization'].replace("Bearer", '').trim();

    console.log(token)

    if (!token) {
        return res.status(401);
    }

    try {
        const { id } = getVerifyTokenInfo(token);
        if (id) {
            res.status(200).json([{ message: 'Сессия валидна' }])
        }
    } catch(err) {
        return res.status(401).json([{ message: 'Непредвиденная ошибка' }]);
    }
}

exports.test = (req, res) => {
    res.status(200).json({ message: 'PROTECTED' })
}