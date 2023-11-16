<?php
//Получаем запрос
$lang = "ru";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $lang = $_POST["lang"];
};

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