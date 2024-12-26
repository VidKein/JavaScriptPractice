//Переменная для парсинга боди POST запроса
const {parse} = require('querystring');

//создаем метод для работы с адресом
const http = require('http');
//PORT=3500 npm start
const PORT = process.env.PORT || 3500;
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
    fs.readFile('./page'+filePath, (error,data)=>{
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
//request - хранит информацию о запросе, response - управляет отправкой ответа
http.createServer((req, res)=>{
let lang;
//Выводим информацию из БД
const {text} = require("./bd");

    //Язык!!!!!!!!!!!!!!!!!
    //let languageFistTwo = req.headers["accept-language"].substr(0,2);

    if (req.method == "POST") {
        //Создаем переменную через которую будим работать
        let body = "";
        req.on("data", chunk =>{
            body += chunk.toString();
        });
        req.on("end",()=>{
            //Парсим POST запрос
            let pars = parse(body);
            res.write(JSON.stringify(text(pars.lang)));
        });
    }    

    //следим зв адресом
    const url = req.url;
    console.log(url);  

    
    switch (url) {
        
        case "/": 
        saticFile(res,'/html/translate.html','.html');
        break;

        default:
            //считываем расширение
            const extName = String(path.extname(url)).toLowerCase();
            if (extName in mimeTypes) {
                saticFile(res, url, extName)
            } else {
                res.statusCode = 404;
            }
        break;
    }  
}).listen(PORT, () => {
    console.log(`Управляющий сервер запущен: http://localhost:${PORT}`);
});