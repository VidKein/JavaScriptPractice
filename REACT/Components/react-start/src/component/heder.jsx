import { useState } from 'react';

const Header = (img) =>{{/*PROOPS*/}
    console.log(img);
    
  const [isOpen, setIsOpen] = useState(false);

    return(
        <>
        <h1 className="header">Header</h1>
        <img src={img.img} alt="" />



         <div className="dropdown">

            <button onClick={() => setIsOpen(!isOpen)}>
                Меню
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    <li>Главная</li>
                    <li>Проекты</li>
                    <li>Настройки</li>
                    <li>О программе</li>
                </ul>
            )}

        </div>
        </>

    )
}
export default Header 