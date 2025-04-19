import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import ptBR from './locales/pt-BR';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      'pt-BR': ptBR,
    },
    fallbackLng: 'en',
    lng: 'pt-BR', // Set default language to Portuguese
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;