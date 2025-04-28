import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./Translations/en.json";
import translationFR from "./Translations/fr.json";

export const languageKey = "osherLanguage";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    fr: { translation: translationFR },
  },
  fallbackLng: "en",
  lng: localStorage.getItem(languageKey) || "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
