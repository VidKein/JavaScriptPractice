const fs = require('fs');
// Абсолютный путь к файлу
const path = require('path');
const filePath = path.resolve(__dirname, '../../data/koordinats.json');

if (fs.existsSync(filePath)) {
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('Данные из файла:', jsonData.Base.niv);
} else {
  console.error('Файл не найден:', filePath);
}

/*
let add = [];
let systemCoordinates = [];
let positionType= [];
let funktionalAddEdit = document.querySelector("#funktionalAddEdit");
funktionalAddEdit.addEventListener("click",funktionalAdd);
function funktionalAdd() {
    let namePoint = document.querySelector(".namePoint").textContent;
    let positionX = document.getElementById("position X");
    let positionY = document.getElementById("position Y");
    let vyska = document.getElementById("vycka");
    let date = document.getElementById("date");
    add.push(`${namePoint}:{position:[${positionX.value},${positionY.value}], vycka: ${positionY.value}, vycka: ${vyska.value}, date: ${date.value}, systemCoordinates : ${systemCoordinates}, positionType: ${positionType}}`)    
    console.log(add);
    document.querySelector("#import").style.display = "none";
    add =[];
    systemCoordinates = [];
}
// Получаем элементы input и datalist - systemCoordinates
 const coordinateInput = document.getElementById('coordinate');
 const validOptions = Array.from(document.querySelectorAll('#coordinateSystem option')).map(option => option.value);

 // Обработчик изменения ввода
 coordinateInput.addEventListener('input', () => {
   const currentValue = coordinateInput.value;
   // Проверяем, соответствует ли введённое значение одному из доступных вариантов
   if (validOptions.includes(currentValue)) {systemCoordinates.push(currentValue);} 
 });  
 // Получаем элементы input и datalist - systemCoordinates
 const typeInput = document.getElementById('position');
 const validOptionsType = Array.from(document.querySelectorAll('#positionType option')).map(option => option.value);

 // Обработчик изменения ввода
 typeInput.addEventListener('input', () => {
   const currentValue = typeInput.value;
   // Проверяем, соответствует ли введённое значение одному из доступных вариантов
   if (validOptionsType.includes(currentValue)) {positionType.push(currentValue);} 
 });  
 */