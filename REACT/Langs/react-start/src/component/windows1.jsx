import {useState} from 'react'
{/*ОКНА c использовагием DISPLAY */}
import { useLanguage } from "../LanguageContext";
const Window1 = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const { t, translations  } = useLanguage();

    return(
    <>
               <button title={t("title.open 1")} onClick={() =>(setIsOpen(!isOpen))} >{t("open 1")} <span>{isOpen ? '▲' : '▼'}</span></button>
               
                <div className={ isOpen ? 'settingBlock open' : 'settingBlock'}>
                   <div className="settingWrapper">
                        <button title={t("title.exet")} onClick={() =>(setIsOpen(false))} className="closeSetting">X</button>
                       <p className='text'>{t("text")}</p>
                   </div>
               </div>
    </>       
    )
}
export default Window1