<?php
//Определяем локализацию сайта
$lokal = substr($_SERVER["HTTP_ACCEPT_LANGUAGE"],0,2);
//Список языков которые использует язык
$langList =["en","ru","uk"];
//Перебор массива
if (in_array($lokal, $langList)) {
  $lang = $lokal;
}else{
  $lang = "en";
}

//Получаем запрос
if (isset($_GET["lang"])) {
  $lang = $_GET["lang"];
}

//Заполняем сайт текстом
function langSati($array_settings, $var, $nam){
  if(isset($array_settings)){ 
  foreach($array_settings as $keys=>$value){
    if ($array_settings[$keys]["name_tage"] === $var) {
      echo $array_settings[$keys]["value_tage"];
    }
    if ($array_settings[$keys]["id_value_tage"]) {
      if ($array_settings[$keys]["id_value_tage"] == $nam) {
        echo $array_settings[$keys][$var]; 
      }
    }
  }
  }
};
?>