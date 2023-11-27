// Выбираем язык браузера пользователя
let language = window.navigator.language;
let languageFistTwo = language.substr(0,2); 
//Список языков которые использует язык
let langList =["en","ru","uk"];
//Управляем изменениями языка сайта
let currentLocation = document.getElementsByTagName('html')[0];
window.onload = ()=>{ 
    //Устанавливаем язык переключателя
    if(langList.some(test => test === languageFistTwo)){
        currentLocation.setAttribute('lang', languageFistTwo);
        document.getElementById(languageFistTwo).className="active";
        console.log("Язык - "+languageFistTwo);
    }else{
        //меняем локализацию сайта
        currentLocation.setAttribute('lang', "en");
        document.getElementById("en").className="active";
    }
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