//Асинхронный запрос
const mysql         = require("mysql");
//Синхронный запрос
const syncMysql        = require("sync-mysql");

const CONFIG        = require("./config");

//Асинхроное подключение к БД
function asinx() {
    const connection = mysql.createConnection(CONFIG);
    //подключаемся к БД
    connection.connect();
    //Запрос в БД
    let query = "SELECT id_value_tage, name_tage_dinamic, url_page, name_button, value_tage FROM page_dinamic_tage, page_dinamic_value_tage_ru WHERE page_dinamic_tage.id_tage = page_dinamic_value_tage_ru.id_value_tage;"; 
    //Вычитка в БД
    connection.query(query, (error, res)=>{
        if (error) {
            throw error;
        } else {
        console.log("Асинхронный запрос");
        //Выводим весь список
        //console.log(res);
        //Выводим первый элемент
        //console.log(res[0]);
        res.forEach(element => {
        //Выводит текст
        console.log(element.value_tage)})
        }
        });
    //Останавливаем подключение
    connection.end();
}
//asinx();
//Синхроное подключение к БД
module.exports.text = function sinx() {
    //подключаемся к БД
    const connection = new syncMysql(CONFIG);
    //Запрос в БД
    let query = "SELECT id_value_tage, name_tage_dinamic, url_page, name_button, value_tage FROM page_dinamic_tage, page_dinamic_value_tage_en WHERE page_dinamic_tage.id_tage = page_dinamic_value_tage_en.id_value_tage;";
    //Вычитаваем инфу
    const res = connection.query(query);
    //Весь список
    //console.log(res);
    //Выводим первый элемент
    //console.log(res[0]);
    //Выбираем текст
    res.forEach(element => {
    //Выводит текст
    console.log(element.value_tage)})
    return res;
}
//ssinx();