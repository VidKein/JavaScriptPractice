const mysql = require('mysql');
//подключаем базу данных, конфигурация
const conn = mysql.createConnection(
    { 
        host:'127.0.0.1',
        user:'root',
        database:'translation_website',
        password:''
    }
);
conn.connect(err=>{
    if(err){
        console.log(err);
        return err;
    }else{
        console.log('Data base --> OK');
    }
})

//Формируем запрос к Б/Д
let query = "SELECT id_value_tage, name_tage_dinamic, url_page, name_button, value_tage FROM page_dinamic_tage, page_dinamic_value_tage_ru WHERE page_dinamic_tage.id_tage = page_dinamic_value_tage_ru.id_value_tage;";  

//ОТКРЫВЕМ СОЕДИНЕНИЕ
conn.query(query,(err,result,field)=>{
console.log("Ошибки - "+err);
console.log(result);
console.log(field);
});

//ЗАКРЫВАЕМ СОЕДИНЕНИЯ
conn.end( err=>{
    if(err){
        console.log(err);
        return err;
    }else{
        console.log('Data base --> Close');
    }
}
)