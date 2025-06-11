const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Функция для обработки ошибок валидации
exports.handleValidationErrors = (req) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
      return errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
      }));
  }
  return null;
};

// Получение информации из токена
exports.getVerifyTokenInfo = (token) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.verify(token, jwtSecret, (err, decoded) => {
    console.log(token);
    console.log(jwtSecret);
    if (err) {
      console.warn("Проблемы с расшифровкой токена");
      console.warn(err)
      return
    }

    console.log("Токен успешно декодирован");
    console.log(decoded);
    return decoded;
  })
}