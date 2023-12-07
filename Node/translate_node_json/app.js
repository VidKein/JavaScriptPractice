const http = require('http');
const url = require('url');
//создаем метод для работы с файдами
const fs = require('fs');
//Работа с портом
const path = require('path');

//Переменная для парсинга боди POST запроса
const {parse} = require('querystring');

http.createServer((req, res)=>{
    //следим за адресом
    const url = req.url;
    //Выводим картинку
            if (req.method == "GET") {
                if(url.includes("img")){
                    //Список констант для работы с загаловками
                    const mimeTypes = {
                        '.png':'image/png',
                        '.jpg':'image/jpeg',
                        '.gif':'image/gif',
                        '.ttf':'font/ttf',
                        '.svg':'image/svg+xml',
                    };
                    const extName = String(path.extname(url)).toLowerCase();
                    if (extName in mimeTypes) {
                        res.setHeader("ContentType",mimeTypes[extName]);
                    }
                    let img = fs.readFileSync('./page'+url);
                    res.write(img);
                }
                //Отсылаю файл (СИНХРОННЫЙ ЗАПРОС )
                let data = fs.readFileSync('./page/index.html',{encoding : 'utf8', flag:"r"});
                res.write(data);
                //Заквнчиваю запрос
                res.end();//строка  
            }else{
                //Создаем переменную через которую будим работать
                let body = "";
                req.on("data", chunk =>{
                    body += chunk.toString();
                });
                req.on("end",()=>{
                    //Парсим POST запрос
                    let pars = parse(body);
                    //Выводим информацию
                    console.log(pars.lang);
                    //считываем json файлы
                    const langEng = fs.readFileSync("./page/json/"+pars.lang+".json",{encoding : "utf8"});
                    res.end(langEng);
                });
            }     
}).listen(3500);