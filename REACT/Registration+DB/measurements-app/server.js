import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import pool from './server/bd/connection.js';
import authRoutes from './server/routes/authRoutes.js';

const app = express();
const PORT = 4000;

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET отсутствует в .env');
}

app.use(express.json());

const PgStore = pgSession(session);

app.use(session({

    store: new PgStore({
        pool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    }),

    name: 'geo.sid',

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8
    }

}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Geo Assistant Server is running');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
