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
          uc.rating as grade,
          uc.raring_desc as comment
        FROM user_clubs uc
        JOIN users u ON uc.user_id = u.id
        WHERE uc.club_id = ?`,
        [clubId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Преобразуем null в undefined для consistency
            const members = rows.map(row => ({
              ...row,
              comment: row.comment || undefined
            }));
            resolve(members || []);
          }
        }
      );
    });
  },

  // Обновить оценки участников
  updateGrades: (clubId, grades) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Начинаем транзакцию для атомарности
        db.run("BEGIN TRANSACTION");

        try {
          // Подготавливаем запрос
          const stmt = db.prepare(
            `UPDATE user_clubs 
             SET rating = ?, raring_desc = ? 
             WHERE user_id = ? AND club_id = ?`
          );

          // Выполняем для каждой оценки
          grades.forEach((grade) => {
            stmt.run(
              [grade.grade, grade.comment || null, grade.userId, clubId],
              (err) => {
                if (err) throw err;
              }
            );
          });

          // Завершаем транзакцию
          stmt.finalize();
          db.run("COMMIT", (err) => {
            if (err) throw err;
            resolve();
          });
        } catch (error) {
          db.run("ROLLBACK");
          reject(error);
        }
      });
    });
  },
};

module.exports = UserClub;
