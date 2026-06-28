import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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

export default i18n;
