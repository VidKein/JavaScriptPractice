//Отображение картинок
let links = document.getElementsByClassName("links");
let content = document.getElementsByClassName("content");
console.log(document.querySelector(".links"));

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", (e)=>{
    content[0].style = "display: none;";
    content[1].style = "display: none;";
    content[2].style = "display: none;";
    document.getElementById(e.currentTarget.name).style = "display: flex;";    
    })
}