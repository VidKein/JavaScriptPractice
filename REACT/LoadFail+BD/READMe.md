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


Structure
```txt
measurements-app/
├── src/
│   ├── App.jsx
│   ├── CsvPreview.jsx      ← новый файл
│   ├── AddPointForm.jsx
│   ├── index.css
│   └── ...
├── package.json
└── ...
```

### CSV
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