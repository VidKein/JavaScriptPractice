{/*состояние*/}
import {useState} from 'react'

const Button = () =>{
{/*событие*/}
const klikInfo = ()=>{alert("Кнопка нажата!!!");};
    const [title, setTitle] = useState('Старый текст');
    const [visible, setVisible] = useState(true);


    const [language, setLanguage] = useState('eng');
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { id: 'eng', name: 'English' },
        { id: 'cz', name: 'Čeština' },
        { id: 'ua', name: 'Українська' }
    ];

    function selectLanguage(lang) {
        setLanguage(lang);
        setIsOpen(false);
    }


    return(
        <>
        <button 
        type='button' 
        className ='klick'
        onClick={() => setTitle('Новый текст')}      
        >
        Нажми меня
        </button>
        <p>{title}</p>

        <div>
        <button onClick={() => setVisible(!visible)}>
            Показать / скрыть
        </button>

        {visible && (
            <div>
                Этот блок можно скрыть
            </div>
        )}
        </div>

         <div className="language-menu">

            <button onClick={() => setIsOpen(!isOpen)}>
                {language} ▼
            </button>

            {isOpen && (
                <ul>
                    {languages.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => selectLanguage(item.id)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </>
    )
}

export default Button 