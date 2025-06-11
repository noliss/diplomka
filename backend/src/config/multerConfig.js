const multer = require('multer');
const path = require('path');

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/avatars');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Экспортируем multer с настроенной конфигурацией
const upload = multer({ storage: storage });

module.exports = upload;