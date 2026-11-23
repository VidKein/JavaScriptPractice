import bcrypt from 'bcrypt';
import {
    getUserByEmail
} from '../bd/queries.js';

import pool from '../bd/connection.js';

// РЕГИСТРАЦИЯ
export async function registerUser(username, email, password) {
    if (
        !username?.trim() ||
        !email?.trim() ||
        !password
    ) {
        throw new Error('Заполните все поля');
    }

    email = email.trim().toLowerCase();
    username = username.trim();

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
        `INSERT INTO public.users
            (username, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, username, email, role, created_at`,
        [username, email, passwordHash]
    );

    return result.rows[0];
}

// АВТОРИЗАЦИЯ
export async function loginUser(email, password) {
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
    ) {
        throw new Error('Введите email и пароль');
    }

    email = email.trim().toLowerCase();

    const user = await getUserByEmail(email);

    if (!user || !user.is_active) {
        throw new Error('Неверный email или пароль');
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error('Неверный email или пароль');
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    };
}