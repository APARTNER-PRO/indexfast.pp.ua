import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const testTranslations = {
  uk: {
    test: "Це тест",
    auth: { login: "Увійти" },
    overview: { goPro: "Перейдіть на PRO" },
  },
};

i18n.use(initReactI18next).init({
  lng: "uk",
  fallbackLng: "uk",
  interpolation: { escapeValue: false },
  resources: testTranslations,
});

console.log("[i18n] initialized with test translations:", testTranslations);

export default i18n;
