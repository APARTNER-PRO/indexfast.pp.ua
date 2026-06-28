import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations.js";

i18n.use(initReactI18next).init({
  lng: localStorage.getItem("lang") || "uk",
  fallbackLng: "uk",
  interpolation: { escapeValue: false },
  resources: translations,
});

export default i18n;
