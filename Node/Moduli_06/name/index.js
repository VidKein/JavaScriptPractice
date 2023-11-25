/*Первый вариант запроса
const text = require("./modulFunction"); 
//Выводим случайное число
//если запускаем функцию ставим кроглые скобки
console.log(text.rendome());*/
/*Второй вариант++++*/
//Указываем присвоенно имя модели !!!!!!!!
const {rendome} = require("./modulFunction");
console.log(rendome());