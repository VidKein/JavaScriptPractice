//follow-redirects пакет
const https = require("follow-redirects").https;
//request пакет
const request = require("request");
//async-request пакет АСИНХРОННЫЙ
const awaitRequest = require("async-request");


//follow-redirects
function ex_01() {
    const options = {
        "method" : "GET",
        "hostname" : "api.itgit.info",
        "path" : "/api/12/employee/read",
        "headers" : {
            "apikey" :"C52A7D86316ccA8B"
        },
        "maxRedirects" : 20
    };

    const req = https.request(options, (res) => {
        //Создаем масив
        let chanks =[];
        //Условия что делаем при получении информации
        res.on("data",(chank) => {
            //Заполняем массив
            chanks.push(chank);
        });
        res.on(error, (error)=>{console.log(error);})
        res.on('end', ()=>{
            let body = Buffer.concat(chanks);
            console.log(JSON.parse(body.toString()));
        });
    });
    req.end();
    
}
ex_01();

//request
function ex_02() {
    const options = {
        "method" : "GET",
        "url" : "https://api.itgit.info/api/12/employee/read",
        "headers" : {
            "apikey" :"C52A7D86316ccA8B"
        },
    };

    request(options, (error, res) => {
        if (error) {
            console.log(error);
        } else {
            let data = res.body
            data = JSON.parse(data);
            console.log(JSON.parse(data));
        }
    });
}
ex_02();

//async-request
async function ex_03() {
    let data = await awaitRequest("https://api.itgit.info/api/12/employee/read", 
    {
        "method" : "GET",
        "headers" : {
            "apikey" :"C52A7D86316ccA8B"
        },
    });
    data = JSON.parse(data.body);
    console.log(data);
}
ex_03();

/*МЕТОД POST*/
//посылаем числа для генерации случайных в интервале мин-макс
async function ex_04() {
    let data = await awaitRequest("https://api.itgit.info/api/12/employee/read", 
    {
        "method" : "POST",
        "data" : {
            "min" : 10,
            "max" : 50
        },
        "headers" : {
            "apikey" :"C52A7D86316ccA8B"
        },
    });
    data = JSON.parse(data.body);
    console.log(data);
}
ex_04();