CREATE DATABASE "RegistrationDB";

CREATE TABLE users_geo (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    access INTEGER NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email_username VARCHAR(255) NOT NULL,
    password_username VARCHAR(255) NOT NULL
);
INSERT INTO users_geo (access, username, email_username, password_username) VALUES (0, 'admin', 'vidkein75@gmail.com', '$2b$10$tNY5gR2C27nrWRIfbmkkBOgQWqCYmfCiSBtdpHWhOkE65ANhFcI6m');