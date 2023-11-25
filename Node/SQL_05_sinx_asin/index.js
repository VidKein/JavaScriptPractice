const http = require('http');
const textInfo = require('./app');
const PORT = 3500;

//прослушыаем порт 3500
//Locakhost:3500
//Функция обрабатывает запро и дает ответ
//request, response
http.createServer(function (req, res) {
    console.log(textInfo.text());
    //Хедер заголовка
    res.setHeader("ContentType","text/html; charset=utf-8;")
    //Отсылаю запрос
    res.write(
        "<button>"+textInfo.text()[0]["name_button"]+"</button>"
        );
    res.write(
        "<p>"+textInfo.text()[0]["value_tage"]+"</p>"
        ); 
    res.write(
        "<img src="+textInfo.text()[0]['url_page']+" alt="+textInfo.text()[0]['name_tage_dinamic']+"></img>"
    );    
    //Заквнчиваю запрос
    res.end();//строка  
}).listen(PORT);