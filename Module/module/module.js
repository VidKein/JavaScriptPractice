export const name1 = "Импорт по имени - Вариант1";//Импорт по имени
const name2 = "Импорт по имени - Вариант2";
export {name2};
const name3 = "Импорт по имени - Вариант3";
export {name3 as name};
//обьект
const add = {
    name: ["Lena", "Kosta"],
    age: [50,49],
    info: []
};
function addTaske(add) {
    for (let i = 0; i < add.name.length; i++) {
        add.info.push({name: add.name[i],age: add.age[i]});
    }
};
addTaske(add);
export default{add};//Иморт по умолчанию