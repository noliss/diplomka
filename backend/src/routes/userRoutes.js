const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUpdateInfo } = require('../middlewares/validationMiddleware');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { upload, processImage } = require('../middlewares/imageFormatterMiddleware');

// Обновление информации authenticateToken
router.post('/update-info', authenticateToken, validateUpdateInfo, upload.single('avatar'), processImage, userController.updateUser)

router.get('/profile', authenticateToken, userController.profile)

module.exports = router;