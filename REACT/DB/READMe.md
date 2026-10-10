### 1 Preparation
* node -v
* npm -v
### 2 start
npm create vite@latest measurements-app
### 3 edit
* Framework: React
* Variant: JavaScript
* Which linter to use : Oxlint


### 4 Установка зависимости
npm install

### 5 Start
npm run dev

adress
Local: http://localhost:5173/

Plain text
```txt

        ИЗМЕРЕНИЯ

Период: [ Последние 7 дней ▼ ]

Дата          Точка       X          Y          Высота
-------------------------------------------------------
26.09.2026    P001       ...        ...        ...
25.09.2026    P001       ...        ...        ...
25.09.2026    P002       ...        ...        ...
24.09.2026    P001       ...        ...        ...
```

Structure
```txt
measurements-app/
│
├── index.html                 ← главная HTML-страница
├── package.json               ← зависимости и команды проекта
├── package-lock.json
├── vite.config.js             ← настройки Vite
├── .gitignore
│
├── node_modules/              ← установленные npm-пакеты
│
├── public/                    ← статические файлы
│   └── ...
│
├── src/                       ← ВЕСЬ React-код
│   │
│   ├── main.jsx               ← точка входа React
│   ├── App.jsx                ← главное React-приложение
│   ├── index.css              ← глобальные стили
│   │
│   ├── components/            ← переиспользуемые компоненты
│   │   ├── Header.jsx
│   │   ├── Filters.jsx
│   │   ├── MeasurementsTable.jsx
│   │   └── MeasurementRow.jsx
│   │
│   ├── pages/                 ← страницы приложения
│   │   └── Measurements.jsx
│   │
│   ├── data/                  ← пока тестовые данные
│   │   └── measurements.js
│   │
│   └── services/              ← работа с API
│       └── api.js
│
└── server/                    ← Node.js + Express + PostgreSQL
    │
    ├── server.js              ← запуск Express
    ├── package.json
    ├── .env                   ← настройки БД
    │
    ├── db/
    │   ├── connection.js      ← подключение PostgreSQL
    │   └── queries.js         ← SQL-запросы
    │
    └── routes/

        └── measurements.js    ← API для измерений
```

### DB
* Инстал необходимых файлов
```txt
mkdir server
cd server
npm init -y - создаем файл
npm install express pg cors dotenv
```
* Состав - .env
```txt
DB_HOST=localhost
DB_PORT=5432
DB_NAME=твоя_база
DB_USER=твой_пользователь
DB_PASSWORD=твой_пароль
PORT=4000
```
* Состав - connection.js
```txt
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
```
* Состав - queries.js
```txt
const pool = require('./connection');

async function getAllPoints() {
  const result = await pool.query(`
    SELECT
      id,
      point_number,
      initial_x,
      initial_y,
      initial_z
    FROM points
    ORDER BY point_number;
  `);

  return result.rows;
}

module.exports = {
  getAllPoints,
};
```

* Состав - vite.config.js
```txt
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
```





   SELECT
      p.point_number,
      p.initial_x,
      p.initial_y,
      p.initial_z,
      sl.name AS location_name,
      pr.name AS project_name,
      cs.name AS coordinate_system,
      mt.name AS type_marker,
      ds.description AS description_marker
      
    FROM points p  

    JOIN survey_locations sl
      ON p.location_id = sl.id

    JOIN projects pr
      ON p.project_id = pr.id

    JOIN coordinate_systems cs
      ON p.coordinate_system_id = cs.id
      
    JOIN mark_types mt
      ON p.mark_type_id = mt.id
      
    JOIN mark_types ds
      ON p.mark_type_id = ds.id
      
      
    ORDER BY p.point_number,p.initial_x,p.initial_z,p.initial_z;