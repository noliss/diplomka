require('dotenv').config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500', // Укажите точный адрес вашего клиента
  methods: ['GET', 'POST'],
  credentials: true // Позволяет передавать куки
}));

const jwtSecret = process.env.JWT_SECRET;

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
})

// Middleware для парсинга JSON-тел запросов
app.use(bodyParser.json());

// Настройка для обслуживания статических файлов
app.use('/uploads/avatars', express.static(path.join(__dirname, '..', 'public', 'uploads', 'avatars')));

// Подключение маршрутов аутентификации
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes)


// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});