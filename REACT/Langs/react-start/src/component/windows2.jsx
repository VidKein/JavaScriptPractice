import stylesWindows from '../styles/window2.module.css'
import {useState} from 'react'
{/*ОКНА c использовагием Условный рендеринг React */}
import { useLanguage } from "../LanguageContext";

const Window2 = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    return(
    <>
               <button title={t("title.open 2")} onClick={() =>(setIsOpen(true))} >{t("open 2")} <span>{isOpen ? '▲' : '▼'}</span></button>
               {
                isOpen && (
                <div className={stylesWindows.settingBlock}>
                   <div className={stylesWindows.settingWrapper}>
                        <button title={t("title.exet")} onClick={() =>(setIsOpen(false))} className={stylesWindows.closeSetting}>X</button>
                       <p className={stylesWindows.text}>{t("text")}</p>
                   </div>
               </div>
                )
               }
    </>       
    )
}
export default Window2