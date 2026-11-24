CREATE DATABASE "RegistrationDB";

CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (username, email, password_hash) VALUES ('admin', 'vidkein75@gmail.com', '$2b$10$tNY5gR2C27nrWRIfbmkkBOgQWqCYmfCiSBtdpHWhOkE65ANhFcI6m');