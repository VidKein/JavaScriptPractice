
import { useLanguage } from "../LanguageContext";

function LanguageSelect() {

    const { siteLanguage, setSiteLanguage } = useLanguage();

    return (
        <select style={{position : "fixed", right : "15px"}}
            value={siteLanguage}
            onChange={(e) => setSiteLanguage(e.target.value)}
        >
            <option value="eng">English</option>
            <option value="cz">Čeština</option>
            <option value="ua">Українська</option>
        </select>
    );
}

export default LanguageSelect;