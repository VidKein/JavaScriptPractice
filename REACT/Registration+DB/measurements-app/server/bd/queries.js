import pool from './connection.js';

// Поиск пользователя по email
export async function getUserByEmail(email) {

    const result = await pool.query(
        `SELECT *
         FROM public.users
         WHERE email = $1`,
        [email]
    );

    return result.rows[0] || null;
}

// Получение пользователя по ID
export async function getUserById(id) {

    const result = await pool.query(
        `SELECT id, username, email, role, is_active
         FROM public.users
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}