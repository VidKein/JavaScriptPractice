//Шаблон
class Header{
//Вызываем img, h1,h2
    constructor(img, h1,h2){
        this.src = img;
        this.h1 = h1;
        this.h2 = h2;
    }
    //Рисуем
    render(id){
        //id куда
        let out = '';
        out += `<img src="${this.src}" style="width: 50px;">`;
        out += `<h1>${this.h1}</h1>`;
        out += `<h2>${this.h2}</h2>`;
        console.log(out);
        
        document.getElementById(id).innerHTML = out

    }
}
//Информация
let img = './geodet.png';
let h1 = 'GEO';
let h2 = 'assistent';
//Заполняем класс информацией
let header = new Header(img,h1,h2); 
console.log(header);
//Рендерим
header.render("header");
//Класс => обьект
//Метод => рисует

