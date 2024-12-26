const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const jsonFilePath = path.join(__dirname, 'data.json');

// 📖 Получение данных JSON
app.get('/api/data/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения JSON:', err);
      return res.status(500).json({ error: 'Ошибка чтения JSON-файла' });
    }

    const jsonData = JSON.parse(data);
    if (!jsonData[id]) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json(jsonData[id]);
  });
});

// ✏️ Редактирование данных JSON
app.put('/api/data/:id', (req, res) => {
  const id = req.params.id;
  const { positionX, positionY, vycka, date, systemCoordinates, positionType } = req.body;

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения JSON:', err);
      return res.status(500).json({ error: 'Ошибка чтения JSON-файла' });
    }

    let jsonData = JSON.parse(data);

    if (!jsonData[id]) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    jsonData[id] = {
      position:  [positionX,positionY],
      vycka: Number(vycka),
      date,
      systemCoordinates,
      positionType
    };

    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Ошибка записи JSON:', err);
        return res.status(500).json({ error: 'Ошибка записи JSON-файла' });
      }
      res.json({ success: true, message: `Данные для ID ${id} обновлены.` });
    });
  });
});

// ➕ Добавление новых данных
app.post('/api/data/', (req, res) => {
  const { id, positionX, positionY, vycka, date, systemCoordinates, positionType } = req.body;

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения JSON:', err);
      return res.status(500).json({ error: 'Ошибка чтения JSON-файла' });
    }

    let jsonData = JSON.parse(data);

    if (jsonData[id]) {
      return res.status(400).json({ error: 'Элемент с таким ID уже существует' });
    }

    jsonData[id] = {
      position: [positionX,positionY],
      vycka: Number(vycka),
      date,
      systemCoordinates,
      positionType
    };

    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Ошибка записи JSON:', err);
        return res.status(500).json({ error: 'Ошибка записи JSON-файла' });
      }
      res.json({ success: true, message: `Данные для ID ${id} добавлены.` });
    });
  });
});

// 🗑️ Удаление данных по ID
app.delete('/api/data/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения JSON:', err);
      return res.status(500).json({ error: 'Ошибка чтения JSON-файла' });
    }

    let jsonData = JSON.parse(data);

    if (!jsonData[id]) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    delete jsonData[id]; // Удаляем элемент по ID

    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Ошибка записи JSON:', err);
        return res.status(500).json({ error: 'Ошибка записи JSON-файла' });
      }
      res.json({ success: true, message: `Данные для ID ${id} удалены.` });
    });
  });
});

// 🚀 Запуск сервера
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});