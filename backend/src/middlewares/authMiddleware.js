const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {

    if (!req.headers['authorization']?.length) {
        return res.sendStatus(401);
    }

    // Извлекаем токен из куки
    const token = req.headers['authorization'].replace("Bearer", '').trim();

    console.log(token)

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next(); // Переходим к следующему middleware или обработчику маршрута
    });
};