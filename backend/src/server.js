require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const clubRoutes = require("./routes/clubRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");

const app = express();
// Эти middleware должны быть подключены ДО маршрутов
app.use(express.json()); // для парсинга application/json
app.use(express.urlencoded({ extended: true })); // для парсинга application/x-www-form-urlencoded
app.use(cookieParser());
app.use(bodyParser.json());
// Разрешаем все домены
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const jwtSecret = process.env.JWT_SECRET;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "..", "public", "uploads", "avatars"))
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/clubs", clubRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
