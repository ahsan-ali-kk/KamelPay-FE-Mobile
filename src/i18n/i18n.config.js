import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {LANGUAGES, LANG_CODES} from "./translations";

i18n.use(initReactI18next).init({
    resources: LANGUAGES,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});


export default i18n;
