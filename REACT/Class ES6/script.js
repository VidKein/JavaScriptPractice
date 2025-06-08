//Шаблон
class Header{
//Вызываем img, h1,h2
    constructor(img, h1,h2){
        this.h1 = h1;
        this.h2 = h2;
        this.src = img;
    }
    //Рисуем
    render(id){
        //id куда
        let out = '';
        out += `<img src="${this.src}" style="width: 50px;">`;
        out += `<h1>${this.h1}</h1>`;
        out += `<h2>${this.h2}</h2>`;
        
        document.getElementById(id).innerHTML = out
    }
}
//Информация
let h1 = 'GEO';
let h2 = 'assistent';
let img = './geodet.png';
//Заполняем класс информацией
let header = new Header(img,h1,h2); 
console.log(header);
//Рендерим
header.render("header");
//Класс => обьект
//Метод => рисует

//Наследование////////////
class Header2 extends Header {
    constructor(img, h1, h2, newImg){
        //Добовляем свойства с Header
        super(img,h1, h2);
        //Новое свойство
        this._nemImg = newImg;
    }
        //Рисуем
    render(id){
        //id куда
        let out = '';
        out += `<img src="${this._nemImg}" style="width: 15px;">`;
        out += `<h1>${this.h1}</h1>`;
        out += `<h2>${this.h2}</h2>`;
        
        document.getElementById(id).innerHTML = out;
    }
    //Считываем
    get newH1(){
        return this.h1;
    };
    //Записываем
    set newH1(x){
        this.h1=x;
    };
}
//Информация
const header2 = new Header2(img,'GEO','menu', './newImg.jpg');
console.log(header2);
//Рендерим
header2.render("header2");
//Вносим изменения
header2.newH1 = `Geo111`;
//Считываем geter
console.log(header2.newH1);


