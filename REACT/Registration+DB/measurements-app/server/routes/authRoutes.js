
import express from 'express';

import {
    register,
    login,
    me,
    logout
} from '../controllers/authController.js';

const router = express.Router();

// Регистрация
router.post('/register', register);

// Авторизация
router.post('/login', login);

// Проверка авторизации
router.get('/me', me);

// Выход
router.post('/logout', logout);

export default router;
