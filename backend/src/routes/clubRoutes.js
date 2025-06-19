const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuthenticateToken, checkAdminRole } = require('../middlewares/authMiddleware');
const clubController = require('../controllers/clubController');

// Получить все кружки
router.get('/', optionalAuthenticateToken, clubController.getAllClubs)

// Создать клуб
router.post('/create', authenticateToken, checkAdminRole, clubController.createClub);

// Вступить в кружок
router.post('/:clubId/join', authenticateToken, clubController.joinToClub)

// Покинуть кружок
router.post('/:clubId/leave', authenticateToken, clubController.leaveClub)

// Получить кружки текущего пользователя
router.get('/me', authenticateToken, clubController.getUserClubs);

// Получить кружки другого пользователя (по ID)
router.get('/:userId', authenticateToken, clubController.getUserClubs);

module.exports = router;