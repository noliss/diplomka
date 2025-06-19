const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { handleValidationErrors, getVerifyTokenInfo } = require('../utils/helpers');

// Обновление информации о пользователе 
exports.updateUser = async (req, res) => {
  const validationErrors = handleValidationErrors(req);

  if (validationErrors) {
      return res.status(400).json([...validationErrors]);
  }

  try {
        if (!req.headers['authorization']?.length) {
          return res.sendStatus(401);
      }

      // Извлекаем токен из куки
      const token = req.headers['authorization'].replace("Bearer", '').trim();
      const { username, email, phone } = req.body;
      const file = req.file;
      console.log(req.body)
      const { id } = getVerifyTokenInfo(token);
      const updateFields = [];
      const params = [];

      if (username) {
          updateFields.push('username = ?');
          params.push(username);
      }
      if (email) {
          updateFields.push('email = ?');
          params.push(email);
      }
      if (file) {
        // Формируем ссылку на файл
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${id}.webp`;
        updateFields.push('avatar = ?');
        params.push(fileUrl); 
        console.log('File URL:', fileUrl);
    }
      if (phone) {
          updateFields.push('phone = ?');
          params.push(phone);
      }

      // Если нет полей для обновления, возвращаем ошибку
      if (updateFields.length === 0) {
          return res.status(400).json({ message: 'Нет данных для обновления' });
      }

      params.push(id);

      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(sql, params, function(err) {
          if (err) {
              console.error(err);
              return res.status(500).json([{ message: 'Не удалось обновить информацию' }]);
          }

          if (this.changes === 0) {
              return res.status(404).json([{ message: 'Пользователь не найден' }]);
          }

          return res.status(200).json([{ message: 'Информация о пользователе успешно обновлена' }]);
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json([{ message: 'Не удалось обновить информацию' }]);
  }
}

exports.profile = (req, res) => {
  try {
    if (!req.headers['authorization']?.length) {
        return res.sendStatus(401);
    }
    const token = req.headers['authorization'].replace("Bearer", '').trim();
    const { id } = getVerifyTokenInfo(token);

    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) {
          return res.status(500).json([{ message: 'Ошибка сервера' }]);
      }
      
      if (!row) {
          return res.status(400).json([{ message: 'Пользователя не существует' }]);
      }

      const { username, phone, role, email, avatar } = row;

      res.status(200).json({username, phone, role, email, avatar})
  });
  } catch(error) {
    console.log(error);
    return res.status(500).json([{ message: 'Ошибка сервера' }])
  }
}