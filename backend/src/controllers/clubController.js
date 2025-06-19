const Club = require('../models/Club');
const db = require('../models/db');
const UserClub = require('../models/UserClub');

exports.getAllClubs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    let query, params;

    if (isAdmin) {
      // Запрос для админа - все кружки
      query = `
        SELECT 
          c.*,
          COUNT(uc.user_id) as members_count,
          EXISTS (
            SELECT 1 FROM user_clubs 
            WHERE club_id = c.id AND user_id = ?
          ) as is_member
        FROM clubs c
        LEFT JOIN user_clubs uc ON c.id = uc.club_id
        GROUP BY c.id 
        ORDER BY c.created_at DESC
      `;
      params = [userId];
    } else if (userId) {
      // Запрос для авторизованного пользователя - исключая свои кружки
      query = `
        SELECT 
          c.*,
          COUNT(uc.user_id) as members_count,
          FALSE as is_member
        FROM clubs c
        LEFT JOIN user_clubs uc ON c.id = uc.club_id
        WHERE c.id NOT IN (
          SELECT club_id FROM user_clubs WHERE user_id = ?
        )
        GROUP BY c.id 
        ORDER BY c.created_at DESC
      `;
      params = [userId];
    } else {
      // Запрос для неавторизованного пользователя - все кружки
      query = `
        SELECT 
          c.*,
          COUNT(uc.user_id) as members_count,
          FALSE as is_member
        FROM clubs c
        LEFT JOIN user_clubs uc ON c.id = uc.club_id
        GROUP BY c.id 
        ORDER BY c.created_at DESC
      `;
      params = [];
    }

    const clubs = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => 
        err ? reject(err) : resolve(rows)
      );
    });

    res.json({ success: true, clubs: clubs || [] });
    
  } catch (error) {
    console.error('Ошибка при получении кружков:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка кружков',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createClub = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Тело запроса отсутствует' });
    }

    const { name, description, type: clubType } = req.body;

    if (!name || !clubType) {
      return res.status(400).json({ 
        message: 'Название и тип кружка обязательны' 
      });
    }

    const allowedTypes = ['SPORT', 'MATH', 'SCIENCE', 'LANGUAGE', 'ART', 'OTHER'];
    if (!allowedTypes.includes(clubType)) {
      return res.status(400).json({
        message: `Недопустимый тип кружка. Допустимые значения: ${allowedTypes.join(', ')}`,
        allowedTypes
      });
    }

    // Создаем кружок (передаем clubType)
    const clubId = await Club.create(name, description, clubType);

    res.status(201).json({
      success: true,
      message: 'Кружок успешно создан',
      club: {
        id: clubId,
        name,
        description,
        type: clubType
      }
    });

  } catch (error) {
    console.error('Ошибка при создании кружка:', error);
    
    if (error.message.includes('уже существует')) {
      return res.status(409).json({ 
        success: false,
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании кружка',
      error: error.message
    });
  }
};

exports.joinToClub = async (req, res) => {
  try {
    const userId = req.user.id;
    const clubId = req.params.clubId;

    const club = await new Promise((resolve, reject) => {
      Club.getById(clubId, (err, club) => err ? reject(err) : resolve(club));
    });
    
    if (!club) {
      return res.status(404).json({ message: 'Кружок не найден' });
    }

    const existingMembership = await new Promise((resolve, reject) => {
      db.get(
        'SELECT 1 FROM user_clubs WHERE user_id = ? AND club_id = ?',
        [userId, clubId],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Вы уже состоите в этом кружке' });
    }

    await new Promise((resolve, reject) => {
      UserClub.joinClub(userId, clubId, (err) => err ? reject(err) : resolve());
    });

    res.json({ message: 'Вы успешно вступили в кружок' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.leaveClub = async (req, res) => {
  try {
    const userId = req.user.id;
    const clubId = req.params.clubId;

    const club = await new Promise((resolve, reject) => {
      Club.getById(clubId, (err, club) => err ? reject(err) : resolve(club));
    });

    if (!club) {
      return res.status(404).json({ message: 'Кружок не найден' });
    }

    const membership = await new Promise((resolve, reject) => {
      db.get(
        'SELECT 1 FROM user_clubs WHERE user_id = ? AND club_id = ?',
        [userId, clubId],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });

    if (!membership) {
      return res.status(400).json({ message: 'Вы не состоите в этом кружке' });
    }

    await new Promise((resolve, reject) => {
      UserClub.leaveClub(userId, clubId, err => err ? reject(err) : resolve());
    });

    res.json({ message: 'Вы успешно покинули кружок' });
  } catch (error) {
    console.error('Ошибка при выходе из кружка:', error);
    res.status(500).json({ 
      message: 'Произошла ошибка при выходе из кружка',
      error: error.message 
    });
  }
};

exports.getUserClubs = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id; // Можно запросить для другого пользователя

    const clubs = await new Promise((resolve, reject) => {
      UserClub.getUserClubsWithDetails(userId, (err, clubs) => 
        err ? reject(err) : resolve(clubs)
      );
    });

    res.json({
      success: true,
      clubs: clubs || []
    });

  } catch (error) {
    console.error('Ошибка при получении кружков пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении кружков пользователя',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};