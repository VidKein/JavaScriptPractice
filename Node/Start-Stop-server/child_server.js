const express = require('express');
const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
    res.send('🚀 Дочерний сервер запущен!');
});

app.listen(PORT, () => {
    console.log(`🚀 Дочерний сервер запущен на http://localhost:${PORT}`);
});
