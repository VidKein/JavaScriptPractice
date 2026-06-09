const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Путь к JSON
const DATA_FILE = path.join(__dirname, 'koordinats.json');
const EXPORT_DIR = path.join(__dirname, '..','export');

app.use(cors());
app.use(express.json()); // вместо body-parser

// Убедись, что export-папка есть
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR);
}

app.post('/exportLispPoint', (req, res) => {
  const { type, place, tapeFain } = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения JSON:', err);
      return res.status(500).send('Ошибка чтения файла');
    }

    try {
      const jsonData = JSON.parse(data);
      const targetPoint = jsonData?.[type]?.[place];

      if (!targetPoint) {
        return res.status(404).send('Данные не найдены');
      }

      const lines = Object.entries(targetPoint).map(([id, obj]) => {
        const [x, y] = obj.position;
        return `${id};${x};${y};${obj.vycka};${obj.date};${obj.systemCoordinates};${obj.positionType}`;
      });

      const output = lines.join('\n');
      const ext = tapeFain === '.txt' ? '.txt' : '.csv';
      const fileName = `${place}${ext}`;
      const filePath = path.join(EXPORT_DIR, fileName);

      fs.writeFileSync(filePath, output, 'utf8');

      res.download(filePath, fileName, err => {
        if (err) {
          console.error('Ошибка при отправке файла:', err);
        } else {
          console.log(`✅ Файл отправлен: ${fileName}`);
        // Файл можно удалить после отправки, если нужно (опционально)
        fs.unlinkSync(filePath);
        }
      });
    } catch (e) {
      console.error('Ошибка обработки JSON:', e);
      res.status(500).send('Ошибка обработки данных');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
