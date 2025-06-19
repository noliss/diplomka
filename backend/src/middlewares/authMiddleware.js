const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    if (!req.headers['authorization']?.length) {
        return res.sendStatus(401);
    }

    const token = req.headers['authorization'].replace("Bearer", '').trim();

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// для опциональной аутентификации
exports.optionalAuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return next(); // Пропускаем неавторизованных пользователей
    }

    const token = authHeader.replace("Bearer", '').trim();

    if (!token) {
        return next(); // Пропускаем неавторизованных пользователей
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(); // Пропускаем даже если токен невалидный
        }
        req.user = user;
        next();
    });
};

exports.checkAdminRole = (req, res, next) => {
    console.log(req.user)
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ 
            success: false,
            message: 'Доступ запрещен. Требуются права администратора' 
        });
    }
    next();
};