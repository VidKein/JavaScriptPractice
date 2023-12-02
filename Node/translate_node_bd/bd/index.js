//Синхронный запрос
const syncMysql        = require("sync-mysql");
const CONFIG        = require("./config");


//Синхроное подключение к БД
module.exports.text = () => {
    //подключаемся к БД
    const connection = new syncMysql(CONFIG);
    //Запрос в БД
    let query = "SELECT id_value_tage, name_tage_dinamic, url_page, name_button, value_tage FROM page_dinamic_tage, page_dinamic_value_tage_en WHERE page_dinamic_tage.id_tage = page_dinamic_value_tage_en.id_value_tage;";
    //Вычитаваем инфу
    const res = connection.query(query);
    //Весь список
    console.log(res);
    return res;
}