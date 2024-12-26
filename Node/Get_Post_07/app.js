//http://localhost:3500/
const http = require('http');
const url = require('url');
//Переменная для парсинга боди POST запроса
const {parse} = require('querystring');



//GET,POST --> получаем и обрабатываем запрос
//Создаем сервер для проверки
http.createServer((req, res)=>{
    console.log("serwer work");
    //GET
    if (req.method == "GET") {
        console.log(req.method);//!!!!!!
        //Читаем путь
        let urlReq = url.parse(req.url,true);//!!!!!!
        //путь в целом
        console.log(urlReq);
        //Выводим путь не используя lang 
        //Содержание запроса ?lang=язык
        console.log(urlReq.path.substr(1,3));
        console.log(urlReq.query.lang);
        switch (urlReq.query.lang) {
            case "ru":
                res.write("Язык руский");        
                break;
            case "ua":
                res.write("Язик український");        
                break;
            case "en":
                res.write("Lang anglis");        
                break;
            default:
                res.write("Язык не задaн");        
                break;
        }
        res.end("/end GET");
    } else {//POST
        //Создаем переменную через которую будим работать
        let body = "";
        req.on("data", chunk =>{
            body += chunk.toString();
        })
        req.on("end",()=>{
            console.log(body);
            //Парсим POST запрос
            let pars = parse(body);
            //Выводим информацию
            console.log(pars.lang);
            switch (pars.lang) {
                case "ru":
                    res.write("Язык руский");        
                    break;
                case "ua":
                    res.write("Язик український");        
                    break;
                case "en":
                    res.write("Lang anglis");        
                    break;
                default:
                    res.write("Язык не задaн");        
                    break;
            }
            res.end(" /end POST")
        });
    }
}).listen(3500);