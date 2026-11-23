
import {
    registerUser,
    loginUser
} from '../services/authService.js';

import { getUserById } from '../bd/queries.js';

// РЕГИСТРАЦИЯ
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await registerUser(
            username,
            email,
            password
        );

        res.status(201).json({
            success: true,
            message: 'Регистрация успешна',
            user
        });

    } catch (error) {
        if (
            error.message === 'Заполните все поля' ||
            error.message === 'Пользователь с таким email уже существует'
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Ошибка регистрации:', error);

        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
}

// АВТОРИЗАЦИЯ
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        req.session.regenerate((error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'Ошибка создания сессии'
                });
            }

            req.session.userId = user.id;

            req.session.save((error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({
                        success: false,
                        message: 'Ошибка сохранения сессии'
                    });
                }

                res.json({
                    success: true,
                    message: 'Авторизация успешна',
                    user
                });
            });
        });

    } catch (error) {
        if (
            error.message === 'Введите email и пароль' ||
            error.message === 'Неверный email или пароль'
        ) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        console.error('Ошибка авторизации:', error);

        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
}

// ПРОВЕРКА СЕССИИ
export async function me(req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не авторизован'
            });
        }

        const user = await getUserById(req.session.userId);

        if (!user || !user.is_active) {
            return req.session.destroy(() => {
                res.status(401).json({
                    success: false,
                    message: 'Сессия недействительна'
                });
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Ошибка проверки сессии:', error);

        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
}

// ВЫХОД
export function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Ошибка выхода'
            });
        }

        res.clearCookie('geo.sid', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({
            success: true,
            message: 'Выход выполнен'
        });
    });
}
