const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

let serverProcess = null;

// Разрешаем статические файлы для фронтенда
app.use(express.static('public'));

// Запуск сервера
app.get('/start', (req, res) => {
    if (!serverProcess) {
        serverProcess = exec('node child_server.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Ошибка: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Ошибка: ${stderr}`);
                return;
            }
            console.log(`Вывод: ${stdout}`);
        });
        console.log('Сервер запущен!');
        res.send('Сервер запущен!');
    } else {
        console.log('Сервер уже работает.');
        res.send('Сервер уже работает.');
    }
});

// Остановка сервера
app.get('/stop', (req, res) => {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
        console.log('Сервер остановлен!');
        res.send('Сервер остановлен!');
    } else {
        console.log('Сервер не был запущен.');
        res.send('Сервер не был запущен.');
    }
});

// Запуск интерфейса
app.listen(PORT, () => {
    console.log(`Управляющий сервер запущен: http://localhost:${PORT}`);
});
