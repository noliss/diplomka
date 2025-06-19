const db = require("./db");

const UserClub = {
  // Вступить в кружок
  joinClub: (userId, clubId, callback) => {
    db.run(
      "INSERT INTO user_clubs (user_id, club_id) VALUES (?, ?)",
      [userId, clubId],
      callback
    );
  },

  // Покинуть кружок
  leaveClub: (userId, clubId, callback) => {
    db.run(
      "DELETE FROM user_clubs WHERE user_id = ? AND club_id = ?",
      [userId, clubId],
      callback
    );
  },

  // Получить все кружки пользователя
  getUserClubs: (userId, callback) => {
    db.all(
      `SELECT c.* FROM clubs c
       JOIN user_clubs uc ON c.id = uc.club_id
       WHERE uc.user_id = ?`,
      [userId],
      callback
    );
  },

  // Получить всех участников кружка
  getClubMembers: (clubId, callback) => {
    db.all(
      `SELECT u.* FROM users u
       JOIN user_clubs uc ON u.id = uc.user_id
       WHERE uc.club_id = ?`,
      [clubId],
      callback
    );
  },

  rateUserInClub: (userId, clubId, rating, callback) => {
    db.run(
      "UPDATE user_clubs SET rating = ? WHERE user_id = ? AND club_id = ?",
      [rating, userId, clubId],
      callback
    );
  },

  // Получить все кружки пользователя с дополнительной информацией
  getUserClubsWithDetails: (userId, callback) => {
    db.all(
      `SELECT 
        c.*,
        COUNT(uc2.user_id) as members_count,
        uc.joined_at,
        uc.rating as user_rating
      FROM user_clubs uc
      JOIN clubs c ON uc.club_id = c.id
      LEFT JOIN user_clubs uc2 ON uc2.club_id = c.id
      WHERE uc.user_id = ?
      GROUP BY c.id
      ORDER BY uc.joined_at DESC`,
      [userId],
      callback
    );
  },
  getMembersWithGrades: (clubId) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          u.id, 
          u.username as name, 
          u.email, 
          uc.rating as grade
        FROM user_clubs uc
        JOIN users u ON uc.user_id = u.id
        WHERE uc.club_id = ?`,
        [clubId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },

  // Обновить оценки участников
  updateGrades: (clubId, grades) => {
    return new Promise((resolve, reject) => {
      // Начинаем транзакцию для массового обновления
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const stmt = db.prepare(
          "UPDATE user_clubs SET rating = ? WHERE club_id = ? AND user_id = ?"
        );

        grades.forEach((grade) => {
          stmt.run([grade.grade, clubId, grade.userId]);
        });

        stmt.finalize((err) => {
          if (err) {
            db.run("ROLLBACK");
            reject(err);
          } else {
            db.run("COMMIT", (err) => {
              if (err) reject(err);
              else resolve();
            });
          }
        });
      });
    });
  },
  deleteClub: (clubId) => {
    return new Promise((resolve, reject) => {
    db.run('DELETE FROM clubs WHERE id = ?', [clubId], function(err) {
      if (err) reject(err);
      resolve(this.changes);
    });
  });
  }
};

module.exports = UserClub;
