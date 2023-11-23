const http = require('http');
const PORT = 3500;
//прослушыаем порт 3500
//Locakhost:3500
//Функция обрабатывает запро и дает ответ
//request, response
http.createServer(function (req, res) {
    console.log(req.url);
    console.log(req.method);
    console.log("Serwer work");
    //Хедер заголовка
    res.setHeader("ContentType","text/html; charset=utf-8;")
    //Отсылаю запрос
    res.write("<h1>Hellow world</h1><p>000000</p>");
    //Заквнчиваю запрос
    res.end();//строка  
}).listen(PORT);
