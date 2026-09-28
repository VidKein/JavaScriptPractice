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