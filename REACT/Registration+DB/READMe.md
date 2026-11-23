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

### 5 Установка библиотек Node.js+БД
measurements-app
├── npm install express express-session - Управление сессиями
├── npm install connect-pg-simple - Хранение сессий в PostgreSQL
├── npm install bcrypt - Хеширование паролей
├── npm install pg - Подключение PostgreSQL
├── npm install dotenv

adress
Local: http://localhost:5173/


Structure
```txt
measurements-app/
                ├── server/
                │     ├── bd/
                │     │     ├── connection.js <- присоединение к БД
                │     │     ├── queries.js<- обработка информации из БД
                │     │     ├── .env<- данные для входа
                │     ├──services/
                │     │      ├── authService.js<- Здесь находится бизнес-логика регистрации
                │     ├──controllers/
                │     │      ├── authController.js
                │     ├──routes/
                │           ├── authRoutes.js
                ├── src/
                │   ├── Registration/
                │          ├── authentication.css
                │          ├── Registration.jsx<- логика аудентификации
                ├── server.js
                ├── App.jsx <-страницу которую нужно отобразить
                ├── index.css
                ├── main.jsx <- точка входа

```

### BD

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