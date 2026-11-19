import stylesWindows from '../styles/window2.module.css'
import {useState} from 'react'
{/*ОКНА c использовагием Условный рендеринг React */}

const Window2 = () =>{
    const [isOpen, setIsOpen] = useState(false);
    console.log(isOpen);
    
    return(
    <>
               <button onClick={() =>(setIsOpen(true))} >Открой меня 2 v <span>{isOpen ? '▲' : '▼'}</span></button>
               {
                isOpen && (
                <div className={stylesWindows.settingBlock}>
                   <div className={stylesWindows.settingWrapper}>
                        <button onClick={() =>(setIsOpen(false))} className={stylesWindows.closeSetting} title="Exit">X</button>
                       <p className={stylesWindows.text}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias ullam perspiciatis voluptatum ipsam quam optio id sunt beatae quod ea, aliquid totam necessitatibus assumenda aperiam, dolorum repellendus similique officia. Deserunt.</p>
                   </div>
               </div>
                )
               }
    </>       
    )
}
export default Window2