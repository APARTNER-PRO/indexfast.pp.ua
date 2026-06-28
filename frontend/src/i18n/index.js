import i18n from "i18next";
import { initReactI18next } from "react-i18next";

console.log("[I18N] index.js loaded - initializing with test translations");

i18n.use(initReactI18next).init({
  lng: "uk",
  fallbackLng: "uk",
  interpolation: { escapeValue: false },
  resources: {
    uk: {
      test: "Це тест",
      auth: { login: "Увійти" },
      overview: { goPro: "Перейдіть на PRO" },
    },
  },
});

console.log("[I18N] initialization complete");

export default i18n;
