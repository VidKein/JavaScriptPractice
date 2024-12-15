export const planing = {baseTrig: [], baseNiv: [], niv: [], trig: []};


//Загрузка файлов
const json = './data/koordinats.json'; // json файл Работы
const jsonPlaning = './data/planing.json'; // json файл Плана
try {
    // Загружаем JSON файл Плана
    const jsonResponsePlaning = await fetch(jsonPlaning);
    if (!jsonResponsePlaning.ok) {throw new Error('Не удалось загрузить JSON файл');}
    const jsonDataPlaning = await jsonResponsePlaning.json();
    //Для контроля
    console.log('JSON данные Базовые:', jsonDataPlaning.Base, 'JSON данные Рабочие:', jsonDataPlaning.poligons);
    // Загружаем JSON файл Базы
    const jsonResponseData = await fetch(json);
    if (!jsonResponseData.ok) {throw new Error('Не удалось загрузить JSON файл');}
    const jsonData = await jsonResponseData.json();
    //Для контроля
    console.log('JSON данные Data:', jsonData.Base, 'JSON данные Data:', jsonData.poligons);

    //Подготовливаем план работы
    //Базовые тригонометрия
    jsonDataPlaning.Base.trig.map(point=>{
        if (jsonData.Base.trig[point] !== undefined) {
        planing.baseTrig.push(`namber: ${point} , position: ${jsonData.Base.trig[point].position[0]} , ${jsonData.Base.trig[point].position[1]}, vycka: ${jsonData.Base.trig[point].vycka}, date: ${jsonData.Base.trig[point].date}, JTSK: ${jsonData.Base.trig[point].systemCoordinates}, positionType: ${jsonData.Base.trig[point].positionType}`);
        }else{
        planing.baseTrig.push(`namber: ${point} : Data not found in database`);
        }
    })
    //Базовые нивелирование
     jsonDataPlaning.Base.niv.map(point=>{
        if (jsonData.Base.niv[point] !== undefined) {
        planing.baseNiv.push(`namber: ${point} , position: ${jsonData.Base.niv[point].position[0]} , ${jsonData.Base.niv[point].position[1]}, vycka: ${jsonData.Base.niv[point].vycka}, date: ${jsonData.Base.niv[point].date}, JTSK: ${jsonData.Base.niv[point].systemCoordinates}, positionType: ${jsonData.Base.niv[point].positionType}`);
        }else{
        planing.baseNiv.push(`namber: ${point} : Data not found in database`);
        }
    })
    //План работы тригонометрия
    jsonDataPlaning.poligons.trig.map(point=>{
        if (jsonData.poligons.trig[point] !== undefined) {
            planing.trig.push(`namber: ${point} , position: ${jsonData.poligons.trig[point].position[0]} , ${jsonData.poligons.trig[point].position[1]}, vycka: ${jsonData.poligons.trig[point].vycka}, date: ${jsonData.poligons.trig[point].date}, JTSK: ${jsonData.poligons.trig[point].systemCoordinates}, positionType: ${jsonData.poligons.trig[point].positionType}`);
        }else{
            planing.trig.push(`namber: ${point} : Data not found in database`);
        }
    })
    //План работы нивелирование
     jsonDataPlaning.poligons.niv.map(point=>{
        if (jsonData.poligons.niv[point]!== undefined) {
            planing.niv.push(`namber: ${point} , position: ${jsonData.poligons.niv[point].position[0]} , ${jsonData.poligons.niv[point].position[1]}, vycka: ${jsonData.poligons.niv[point].vycka}, date: ${jsonData.poligons.niv[point].date}, JTSK: ${jsonData.poligons.niv[point].systemCoordinates}, positionType: ${jsonData.poligons.niv[point].positionType}`);    
        } else {
            planing.niv.push(`namber: ${point}  Data not found in database`);
        }
    })

} catch (error) {
    console.error('Ошибка при обработке файла:', error);
    alert('Ошибка при обработке файла. Проверьте файл и повторите попытку.');
}