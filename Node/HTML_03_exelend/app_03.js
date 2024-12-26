//создаем метод для работы с адресом
const http = require('http');
const PORT = 3500;
//создаем метод для работы с файдами
const fs = require('fs');
//Работа с портом
const path = require('path');
//Список констант для работы с загаловками
const mimeTypes = {
    '.html': 'text/html',
    '.js':'text/javascript',
    '.css':'text/css',
    '.json':'application/json',
    '.png':'image/png',
    '.jpg':'image/jpeg',
    '.gif':'image/gif',
    '.ttf':'font/ttf',
    '.svg':'image/svg+xml',
    '.eot':'application/vnd.ms-fontobject',
};
//Функция для подготовки запроса
function saticFile(res, filePath, ext) {//респонс от сервера+путь к файлу+его расширение
    res.setHeader("Content-Type", mimeTypes[ext]);
    //Асихронная аперация
    fs.readFile('./Node/HTML_03_exelend/page'+filePath, (error,data)=>{
        if (error) {
            res.statusCode = 404;
            res.end();
        }else{
           res.end(data); 
        }
    });

}

//прослушыаем порт 3500
//Locakhost:3500
//Функция обрабатывает запро и дает ответ
//request, response
http.createServer(function (req, res) {
    //следим зв адресом
    const url = req.url;
    console.log(url);  
    switch (url) {
        case "/":
        saticFile(res,'/translate.html','.html');
        break;

        default:
            //считываем расширение
            const extName = String(path.extname(url)).toLowerCase();
            if (extName in mimeTypes) {
                saticFile(res, url, extName)
            } else {
                res.statusCode = 404;
                res.end();
            }
        break;
    }  
}).listen(PORT);