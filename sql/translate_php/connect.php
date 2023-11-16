<?php
//Подключение к базе данных (в данном случае, MySQL)
define('DB_SERVER', '127.0.0.1:3306');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_DATABASE', 'translation_website');
@$con = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
if (!$con) {
  print("Ошибка подключения к базе данных ( номер -- ".mysqli_connect_errno()."): описание - ".mysqli_connect_error());
};
//Вычитываем информацию из Б/Д
function data_page_row($lang, $con){
  $lang_static = "page_value_tage_".$lang;
  $sql_static = "SELECT name_tage, value_tage FROM page_tage,$lang_static WHERE page_tage.id_tage = $lang_static.id_value_tage";
  $res_static = mysqli_query($con,$sql_static);
  $products_static = array();
  if (mysqli_num_rows($res_static) > 0) {
      while ($row = mysqli_fetch_assoc($res_static)) {
        $products_static[] = $row;
      }
  } else {
      echo "Нет данных для отображения.";
  }

  $lang_dinamic = "page_dinamic_value_tage_".$lang;
  $sql_dinamic = "SELECT id_value_tage, name_tage_dinamic, url_page, name_button, value_tage FROM page_dinamic_tage, $lang_dinamic WHERE page_dinamic_tage.id_tage = $lang_dinamic.id_value_tage";
  $res_dinamic = mysqli_query($con,$sql_dinamic);
  $products_dinamic = array();
  if (mysqli_num_rows($res_dinamic) > 0) {
      while ($row = mysqli_fetch_assoc($res_dinamic)) {
        $products_dinamic[] = $row;
      }
  } else {
      echo "Нет данных для отображения.";
  }

  $products = array();
  $products = array_merge($products_static, $products_dinamic);

  return $products;
}
?>