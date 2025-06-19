const db = require("./db");

const UserRatingModel = {
  getLatestUserRatings: (userId, limit = 5) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
        c.name AS club_name,
        uc.rating,
        uc.raring_desc AS comment,
        uc.joined_at AS rated_date
      FROM 
        user_clubs uc
      JOIN 
        clubs c ON uc.club_id = c.id
      WHERE 
        uc.user_id = ? 
        AND uc.rating IS NOT NULL
      ORDER BY 
        uc.joined_at DESC
      LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const result = rows.map((row) => ({
              clubName: row.club_name,
              rating: row.rating,
              comment: row.comment || null,
              date: row.rated_date,
            }));
            resolve(result);
          }
        }
      );
    });
  },
};

module.exports = UserRatingModel;
