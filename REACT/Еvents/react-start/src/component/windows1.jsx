import {useState} from 'react'
{/*ОКНА c использовагием DISPLAY */}

const Window1 = () =>{
    const [isOpen, setIsOpen] = useState(false);
    console.log(isOpen);
    
    return(
    <>
               <button onClick={() =>(setIsOpen(!isOpen))} >Открой меня 1 v <span>{isOpen ? '▲' : '▼'}</span></button>
               
                <div className={ isOpen ? 'settingBlock open' : 'settingBlock'}>
                   <div className="settingWrapper">
                        <button onClick={() =>(setIsOpen(false))} className="closeSetting" title="Exit">X</button>
                       <p className='text'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias ullam perspiciatis voluptatum ipsam quam optio id sunt beatae quod ea, aliquid totam necessitatibus assumenda aperiam, dolorum repellendus similique officia. Deserunt.</p>
                   </div>
               </div>
    </>       
    )
}
export default Window1