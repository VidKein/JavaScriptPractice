### 1 Preparation
* node -v
* npm -v
### 2 start
npm create vite@latest react-start
### 3 edit
* Framework: React
* Variant: JavaScript
* Which linter to use : Oxlint

Structure
```txt
react-start
│
├── node_modules/ <-- находятся инсталированные модули
├── public/ <-- находятся статические файлы, те которые не использует реакт (логотипы на начальной странице,инструкции...)
├── src/ <-- Здесь будет практически весь наш React-код
│   ├── assets/ <-- файлы которые являются частью React-приложения и импортируются
│   │    ├── imagen/
│   │          ├──imagen.png
│   │    ├── icons/
│   │          ├──logo.png
│   ├── App.jsx<-- формирует HTML страницу
│   ├── main.jsx <-- точка входа React-приложения
│   └── ...
│
├── index.html <-- НАЧАЛЬНАЯ СТРАНИЦА !!!!!
├── package.json <-- Список распакованных МОДУЛЕЙ !!!!
└── vite.config.js <-- ?????
```

### 4 Open - React-start
cd react-start

### 5 Установка зависимости
npm install

### 6 Start
npm run dev

adress
Local: http://localhost:5173/
