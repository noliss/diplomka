const db = require('./db');

const Club = {
  create: (name, description, clubType) => {
     return new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM clubs WHERE name = ?',
        [name],
        (err, existingClub) => {
          if (err) return reject(err);
          if (existingClub) {
            return reject(new Error('Кружок с таким названием уже существует'));
          }

          db.run(
            'INSERT INTO clubs (name, description, type, created_at) VALUES (?, ?, ?, datetime("now"))',
            [name, description, clubType], 
            function(err) {
              if (err) return reject(err);
              resolve(this.lastID);
            }
          );
        }
      );
    });
  },

  // Получить все кружки
  getAll: (callback) => {
    db.all('SELECT * FROM clubs', callback);
  },

  // Получить кружок по ID
  getById: (id, callback) => {
    db.get('SELECT * FROM clubs WHERE id = ?', [id], callback);
  },

  // Удалить кружок
  delete: (id, callback) => {
    db.run('DELETE FROM clubs WHERE id = ?', [id], callback);
  }
};

module.exports = Club;