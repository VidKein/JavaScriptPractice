import {name1,name2,name} from './module/module.js';//Экспорт по имени
import add from './module/module.js';//Экспорт по умолчанию ОБЬЕКТА
const container = document.querySelector(".contejner");
const date1 = document.createElement('p');
    date1.textContent = `Модуль1: ${name1 || "Дата отсутствует"}`;
    container.appendChild(date1);
const date2 = document.createElement('p');  
    date2.textContent = `Модуль2: ${name2 || "Дата отсутствует"}`;
    date1.appendChild(date2);
const date3 = document.createElement('p');  
    date3.textContent = `Модуль2: ${name || "Дата отсутствует"}`;
    date2.appendChild(date3);

console.log(add);
const taskList = document.createElement('ul');
if (isCompletelyEmpty(add.add.info)) {
    console.log("Обьект переданный не заполнен");
} else {
    const date4 = document.createElement('p');  
    add.add.info.forEach(name => {
        const li = document.createElement('li'); 
        li.textContent = `Модуль3: Имя - ${name.name || "Имя отсутствует"}, возраст - ${name.age || "Возраст отсутствует"};`;
        taskList.appendChild(li);
    });
    container.appendChild(taskList);
}
// Проверка пустого объекта
function isCompletelyEmpty(obj) {
    if (obj === null || obj === undefined) return true; // null или undefined
    if (typeof obj !== 'object') return true; // Не объект
    if (Array.isArray(obj)) return obj.length === 0; // Пустой массив
    if (Object.keys(obj).length === 0) return true; // Пустой объект

    // Глубокая проверка вложенных объектов
    return Object.values(obj).every(value => isCompletelyEmpty(value));
}
