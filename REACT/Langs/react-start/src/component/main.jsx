import { useState } from 'react';
import { useLanguage } from "../LanguageContext";

const Main = () =>{
    
  const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    return(
        <>

         <div className="dropdown">

            <button title={t("title.menu")} onClick={() => setIsOpen(!isOpen)}>
                {t("menu")}
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    <li>{t("menu_home")}</li>
                    <li>{t("menu_about")}</li>
                    <li>{t("menu_contact")}</li>
                    <li>{t("welcome")}</li>
                    <li>{t("input_name")}</li>
                    <li>{t("button_save")}</li>
                </ul>
            )}

        </div>
        </>

    )
}
export default Main 