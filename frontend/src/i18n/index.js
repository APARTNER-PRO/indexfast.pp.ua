import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations.js";

const resources = {};
Object.keys(translations).forEach(lng => {
  resources[lng] = { translation: translations[lng] };
});

i18n.use(initReactI18next).init({
  lng: localStorage.getItem("lang") || "uk",
  fallbackLng: "uk",
  interpolation: { escapeValue: false, prefix: "{", suffix: "}" },
  ns: ["translation"],
  defaultNS: "translation",
  resources,
});

export default i18n;
