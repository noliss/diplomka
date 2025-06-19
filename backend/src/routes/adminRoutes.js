const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { checkAdminRole, authenticateToken } = require('../middlewares/authMiddleware');

// Получить участников кружка
router.delete('/clubs/:clubId/delete', 
  authenticateToken, 
  checkAdminRole, 
  adminController.deleteClub
);

// Получить участников кружка
router.get('/clubs/:clubId/members', 
  authenticateToken, 
  checkAdminRole, 
  adminController.getClubMembers
);

// Обновить оценки участников
router.post('/clubs/:clubId/grades', 
  authenticateToken, 
  checkAdminRole, 
  adminController.updateGrades
);

module.exports = router;