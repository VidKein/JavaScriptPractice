//создаем XHR обьект
let xhr = new XMLHttpRequest();
//Выбираем блоки изменения
let section = document.querySelector('section');
let article = document.querySelector('article');
       

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
        //запрос на извлечение
        xhr.open("post", "index.js", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        let data = "lang=" + encodeURIComponent(languageFistTwo);
        xhr.send(data);
        createСontent();
    }else{
        //меняем локализацию сайта
        currentLocation.setAttribute('lang', "en");
        document.getElementById("en").className="active";
        console.log("Язык - eng");
        //запрос на извлечение
        xhr.open("post", "index.js", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        let data = "lang=en";
        xhr.send(data);
        createСontent();
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
            console.log("Язык - "+markerLang);
            currentLocation.setAttribute('lang', markerLang);
            //запрос на извлечение
            xhr.open("post", "./index.js", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // Формируем данные для отправки
            var data = "lang=" + encodeURIComponent(markerLang);
            xhr.send(data);
            //Изменения адреса, якорь
            window.history.pushState(null, null, markerLang); 
            xhr.onload = ()=>{
                var responseNew = JSON.parse(xhr.response);
                        document.title = responseNew[0].resStatik[0].value_tage;
                        document.getElementById(responseNew[0].resStatik[1].name_tage).innerText = responseNew[0].resStatik[1].value_tage;
                        document.getElementById(responseNew[0].resStatik[2].name_tage).innerText = responseNew[0].resStatik[2].value_tage;
                        for (const infoCat of responseNew[1].resDinamik) {
                            section.children[infoCat.id_value_tage-1].innerText = infoCat.name_button;
                            article.children[infoCat.id_value_tage-1].querySelectorAll("p")[0].innerText = infoCat.value_tage;        
                        }
                
            };
        })
}

function createСontent() {
    xhr.onload = ()=>{
        if (xhr.readyState === 4 && xhr.status === 200) {
            let respon = JSON.parse(xhr.response);
            console.log(respon);

            for (const resStatik of respon[0].resStatik) {
                //Создаем элементы <h1>, <h3>
                const titleSait = document.createElement('h1');
                const infoSate = document.createElement('h3');
                switch (resStatik.name_tage) {
                case "title":
                    //Title
                    document.title = resStatik.value_tage;
                    break;
                case "title_page":
                    //Текст
                    titleSait.id = resStatik.name_tage;
                    titleSait.innerText = resStatik.value_tage;
                    document.querySelector("header").appendChild(titleSait);
                    break;
                case "info_site":
                    //Текст
                    infoSate.id = resStatik.name_tage;
                    infoSate.innerText = resStatik.value_tage;
                    document.querySelector("header").appendChild(infoSate);
                    break;    
                }
            }

            let resDinamikText = respon[1].resDinamik;
            for (let i = 0; i < resDinamikText.length; i++) {
                //Создаем элементы <button>,<div>,<img>,<p>
                const button = document.createElement('button');
                const infoBloc = document.createElement('div');
                const image = document.createElement('img');
                const text = document.createElement('p');

                //кнопка
                button.className = "links";
                button.id = "img"+resDinamikText[i].id_value_tage;
                button.name = "picter"+resDinamikText[i].id_value_tage;
                button.innerText = resDinamikText[i].name_button;  
                //Картинки с информацией
                if (resDinamikText[i].id_value_tage !== 1) {
                    infoBloc.style = "display:none"; 
                } 
                infoBloc.className ="content";
                infoBloc.id ="picter"+resDinamikText[i].id_value_tage;
                image.id = resDinamikText[i].name_tage_dinamic;
                image.src = "./img"+resDinamikText[i].url_page.replace('.', '');
                text.id = "infoTextPicture"+resDinamikText[i].id_value_tage;
                text.innerText = resDinamikText[i].value_tage;

                //Растовляем єлементы по местам <button>,<div>,<img>,<p>
                section.appendChild(button);
                article.appendChild(infoBloc);
                infoBloc.appendChild(image);
                infoBloc.appendChild(text); 
                load()
            }

        }
    }
}    

//Отображение картинок
function load() {
    let links = document.getElementsByClassName("links");
    let content = document.getElementsByClassName("content");
    
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", (e)=>{
        for(let picturBloc of content){picturBloc.style = "display: none;";}
        document.getElementById(e.currentTarget.name).style = "display: flex;";
        })
    }
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