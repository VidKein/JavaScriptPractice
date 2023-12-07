//Синхронный запрос
const syncMysql        = require("sync-mysql");
const CONFIG        = require("./config");

//Синхроное подключение к БД
module.exports.text = (lang) => {
    //подключаемся к БД
    const connection = new syncMysql(CONFIG);
    //Запрос в БД статика
    let queryStatik = "SELECT name_tage, value_tage FROM page_tage,page_value_tage_"+lang+" WHERE page_tage.id_tage = page_value_tage_"+lang+".id_value_tage;";
    //Вычитаваем инфу статика
    const resStatik = connection.query(queryStatik);
    //Запрос в БД динамика
    let queryDinamik = "SELECT id_value_tage, name_tage_dinamic, url_page, name_button, value_tage FROM page_dinamic_tage, page_dinamic_value_tage_"+lang+" WHERE page_dinamic_tage.id_tage = page_dinamic_value_tage_"+lang+".id_value_tage;";
    //Вычитаваем инфу динамика
    const resDinamik = connection.query(queryDinamik);
    const res = [{resStatik}, {resDinamik}];
    return res;
}