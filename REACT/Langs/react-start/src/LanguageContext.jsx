
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

    const [siteLanguage, setSiteLanguage] = useState(
        localStorage.getItem("siteLanguage") || "eng"
    );

    const [translations, setTranslations] = useState({});

    // Загрузка JSON при изменении языка
    useEffect(() => {

        fetch(`/language/${siteLanguage}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Language file not found");
                }
                return response.json();
            })
            .then(data => setTranslations(data))
            .catch(error => console.error(error));

        localStorage.setItem("siteLanguage", siteLanguage);

    }, [siteLanguage]);

    // Функция получения перевода
function t(key) {

    const value = key.split(".").reduce(
        (object, part) => object?.[part],
        translations
    );

    return value ?? key;
}

    return (
        <LanguageContext.Provider
            value={{ siteLanguage, setSiteLanguage, t }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

// Хук для использования переводов
export function useLanguage() {
    return useContext(LanguageContext);
}