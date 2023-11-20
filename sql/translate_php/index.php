<?
require_once "./connect.php";
require_once "./lang.php";
$array_settings = data_page_row($lang, $con);
?>
<!DOCTYPE html>
<html lang="<?php echo $lang;?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php langSati($array_settings ,"title", 0)?></title>
    <style>
        .picter1 .active{
            display: block;
        }
        .content{
        display: flex;
        }
        img{
        width: 500px;
        }
        #infoTextPicture{
        margin: 0 15px;
        }
        .links {
        margin: 15px 0;
        }
        .languageSelect {
        position: absolute;
        margin: 0;
        padding: 0;
        top: 1rem;
        right: 3rem;
        font-weight: 600;
        display: inline-flex;
        flex-direction: column;
        color: rgb(12, 12, 12);
        text-transform: uppercase;
        height: 24px;
        overflow: hidden;
        cursor: pointer;
        font-size: 12px;
        }
        .languageSelect li {
        text-align: center;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background:  #e9e8e6;
        order: 2;
        padding: 6px;
        min-height: 24px;
        }
        .languageSelect li:hover {
        cursor: pointer;
        background:#bdb9b4;
        }

        .languageSelect.open {
        height: auto;
        }

        .languageSelect li.active {
        order: 1;
        pointer-events: none;
        }
        a{
            text-decoration: none;
            color: black;
        }
    </style>
</head>
<body>
        <ul class="languageSelect" id="languageSelect"> 
            <li data-lang="uk" id="uk"><a href="<?php echo "$_SERVER[PHP_SELF]?lang=uk"?>">UA</a></li>
            <li data-lang="ru" id="ru"><a href="<?php echo "$_SERVER[PHP_SELF]?lang=ru"?>">RU</a></li> 
            <li data-lang="en" id="en"><a href="<?php echo "$_SERVER[PHP_SELF]?lang=en"?>">ENG</a></li>
        </ul>
    <header>
        <h1 id="title_page"><?php langSati($array_settings ,"title_page", 0)?></h1>
        <h3 id="info_site"><?php langSati($array_settings ,"info_site", 0)?></h3>
    </header>
    <section>
        <button class="links" id="img1" name="picter1"><?php langSati($array_settings , "name_button", 1)?></button>
        <button class="links" id="img2" name="picter2"><?php langSati($array_settings , "name_button", 2)?></button>
        <button class="links" id="img3" name="picter3"><?php langSati($array_settings , "name_button", 3)?></button>
    </section>
    <article>
        <div class="content" id="picter1">
        <img id="<?php langSati($array_settings , "name_tage_dinamic", 1)?>" src="<?php langSati($array_settings , "url_page", 1)?>" alt="">
        <p id="infoTextPicture1"><?php langSati($array_settings , "value_tage", 1)?></p>
        </div>
        <div class="content" id="picter2" style="display: none;" >
        <img id="<?php langSati($array_settings , "name_tage_dinamic", 2)?>" src="<?php langSati($array_settings , "url_page", 2)?>" alt="">
        <p id="infoTextPicture2"><?php langSati($array_settings , "value_tage", 2)?></p>
        </div>
        <div class="content" id="picter3" style="display: none;" >
        <img id="<?php langSati($array_settings , "name_tage_dinamic", 3)?>" src="<?php langSati($array_settings , "url_page", 3)?>" alt="">
        <p id="infoTextPicture3"><?php langSati($array_settings , "value_tage", 3)?></p>
        </div>   
    </article>
</body>
<script>
//Управляем изменениями языка сайта
let currentLocation = document.getElementsByTagName('html')[0].lang;
window.onload = ()=>{ 
    document.getElementById(currentLocation).className="active";
    console.log("Язык - "+currentLocation);
}
//Открываем / закрываем меню языка
    let languageSelect = document.getElementById("languageSelect");
    languageSelect.addEventListener("click",(e)=>{
        if(e.currentTarget.className == "languageSelect open"){
            e.currentTarget.setAttribute('class', "languageSelect");
        }else{
            e.currentTarget.className += " open";  
        };
    })
    
//Выбираем язык
//Выбираем переключатель языка
let le = document.getElementsByTagName("li");
let markerLang;
for (let i = 0; i < le.length; i++) {
        le[i].addEventListener("click", (e)=>{
            for(let langBloc of le){langBloc.removeAttribute("class");}
            e.target.className = "active";
            markerLang = e.target.id;
        })
}

//Переключение картинок
let links = document.getElementsByClassName("links");
let content = document.getElementsByClassName("content");
for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", (e)=>{
    for(let picturBloc of content){picturBloc.style = "display: none;";}
    document.getElementById(e.currentTarget.name).style = "display: flex;";    
    })
}

</script>   
</html>