const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const filePath = 'data.json';

// Middleware для обработки JSON
app.use(express.json());

// Сервировать статические файлы (HTML и JS)
app.use(express.static(path.join(__dirname, 'public')));

// Обработка POST-запроса для добавления или обновления данных
app.post('/update-json', (req, res) => {
  const newData = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return res.status(500).send('Ошибка чтения файла.');
    }

    try {
      const jsonData = JSON.parse(data);

      jsonData[newData.id] = {
        position: newData.position,
        vycka: newData.vycka,
        date: newData.date,
        systemCoordinates: newData.systemCoordinates,
        positionType: newData.positionType,
      };

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error('Ошибка записи файла:', err);
          return res.status(500).send('Ошибка записи файла.');
        }
        res.send(`Данные для ID ${newData.id} успешно добавлены или обновлены.`);
      });
    } catch (parseErr) {
      console.error('Ошибка парсинга JSON:', parseErr);
      res.status(500).send('Ошибка парсинга JSON.');
    }
  });
});

// Обработка GET-запроса для получения данных по ID
app.get('/get-json/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return res.status(500).send('Ошибка чтения файла.');
    }

    try {
      const jsonData = JSON.parse(data);

      if (jsonData[id]) {
        res.json(jsonData[id]);
      } else {
        res.status(404).send(`Данные для ID ${id} не найдены.`);
      }
    } catch (parseErr) {
      console.error('Ошибка парсинга JSON:', parseErr);
      res.status(500).send('Ошибка парсинга JSON.');
    }
  });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
