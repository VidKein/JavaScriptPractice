require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

// Проверка подключения к базе
db.query('SELECT 1')
  .then(() => console.log('✅ MySQL работает'))
  .catch((err) => console.error('❌ Ошибка подключения к MySQL:', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));

// ===== Регистрация =====
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.send('Пользователь уже существует. <a href="/register.html">Назад</a>');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.redirect('/login.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера.');
  }
});

// ===== Вход =====
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.send('Пользователь не найден. <a href="/login.html">Назад</a>');
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.send('Неверный пароль. <a href="/login.html">Назад</a>');
    }

    req.session.user = user.username;
    res.redirect('/main.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера.');
  }
});

// ===== Защищённая страница =====
app.get('/main.html', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login.html');
  next();
});

// ===== Выход =====
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// ===== Запуск =====
app.listen(PORT, () => {
  console.log(`Сервер работает: http://localhost:${PORT}/register.html`);
});
