import { useState } from 'react';

const Header = () =>{
    
  const [isOpen, setIsOpen] = useState(false);

    return(
        <>

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