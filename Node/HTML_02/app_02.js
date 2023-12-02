//создаем метод для работы с адресом
const http = require('http');
//создаем метод для работы с файдами
const fs = require('fs');
const PORT = 3500;
//прослушыаем порт 3500
//Locakhost:3500
//Функция обрабатывает запро и дает ответ
//request, response
http.createServer(function (req, res) {
    //следим за адресом
    const url = req.url;
    //Хедер заголовка
    res.setHeader("ContentType","text/html; charset=utf-8;")
    switch (url) {
        case "/": 
        console.log("main page");        
        //Отсылаю запрос
        res.write("<h1>Main page</h1>");
        //Заквнчиваю запрос
        res.end();//строка  
        break;
        
        case "/contakt": 
        console.log("comtakt page");        
        //Отсылаю файл (СИНХРОННЫЙ ЗАПРОС )
        let data = fs.readFileSync('./Node/HTML_02/page/contakt.html',{encoding : 'utf8', flag:"r"});
        res.write(data);
        //Заквнчиваю запрос
        res.end();//строка  
        break;
    
        default:
            
            if (url.includes("img")) {
                //Отсылаю файл (AСИНХРОННЫЙ ЗАПРОС !!!!!!!+++++ )
                fs.readFile('./Node/HTML_02/page/'+url,{},(err, img)=>{
                    if (err) {
                        //делаем чтото если ошибка
                    } else {
                        //Выводим картинку
                        console.log("img open"); 
                        //Определяем тип файла
                        res.setHeader("ContentType","image/jpeg");
                        res.write(img);
                        //Заквнчиваю запрос
                        res.end();//строка  
                    }
                });
            }else{
                //Выводим ошибку
                console.log("404");        
                //Отсылаю запрос
                res.write("<h1>404</h1>");
            }   
        break;
    }  
}).listen(PORT);