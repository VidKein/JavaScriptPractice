const http = require('http');
const url = require('url');
//создаем метод для работы с файдами
const fs = require('fs');

//Переменная для парсинга боди POST запроса
const {parse} = require('querystring');

http.createServer((req, res)=>{
    //следим за адресом
    const url = req.url;
            if (req.method == "GET") {
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