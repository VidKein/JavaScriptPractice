const fs = require('fs')

fs.readFile("test.txt", function(error,data){
    if(error) {  // если возникла ошибка
        return console.log(error);
    }
    console.log(data.toString());   // выводим считанные данные
});
console.log("Асинхронное чтение файлов");