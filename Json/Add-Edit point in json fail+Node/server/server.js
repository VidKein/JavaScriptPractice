/*Установите зависимости:
npm install express
npm install express cors*/
const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Для поддержки запросов с других доменов
const path = require('path');// Абсолютный путь к файлу

const app = express();
const PORT = process.env.PORT || 4000; // Используется переменная окружения или 4000 по умолчанию
//
app.use(express.json());
app.use(cors()); // Разрешаем CORS для всех источников
// Путь к файлу
const DATA_FILE = path.join(__dirname, 'data', 'koordinats.json');

// Публичный доступ к data.json для обрашения
app.get('/data/koordinats.json', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла data.json' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

// Добавление данных
app.post('/data', (req, res) => {
    const {dataName, dataJobs, id, positionX, positionY, vyska, date, systemCoordinates, positionType } = req.body;    
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения данных' });
        } else {
            const jsonData = JSON.parse(data);
            if (jsonData[id]) {return res.status(400).json({ error: 'Элемент с таким ID уже существует' });}
            //Собираем в массив
            jsonData[dataName][dataJobs][id] = {
                position: [Number(positionX),Number(positionY)],
                date:date,
                vyska: Number(vyska),
                systemCoordinates: systemCoordinates[0],
                positionType: positionType[0]
              };
            //Вносим иформацию в файл
            fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                  console.error('Ошибка записи JSON:', err);
                  return res.status(500).json({ error: 'Ошибка записи JSON-файла' });
                }
                res.json({ success: true, message: `Данные точки ${id} добавлены.` });
            });
        }
    });
    
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});