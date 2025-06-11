const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { getVerifyTokenInfo } = require('../utils/helpers')

// Настройка хранения файлов в памяти
const storage = multer.memoryStorage(); // Храним файл в памяти для дальнейшей обработки

// Экспортируем multer с настроенной конфигурацией
const upload = multer({ storage: storage });

// Middleware для обработки изображений
const processImage = async (req, res, next) => {
    if (!req.file) return next();

    if (!req.headers['authorization']?.length) {
        return res.sendStatus(401);
    }

    // Извлекаем токен из куки
    const token = req.headers['authorization'].replace("Bearer", '').trim();

    const { id } = getVerifyTokenInfo(token)

    const outputDir = path.join(__dirname, '../../public/uploads/avatars');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilePath = path.join(outputDir, `${id}.webp`);

    try {
        await sharp(req.file.buffer)
            .resize(256, 256)
            .toFile(outputFilePath);

        next();
    } catch (error) {
        console.error('Ошибка при обработке изображения:', error);
        res.status(500).send('Ошибка при обработке изображения');
    }
};

module.exports = { upload, processImage };