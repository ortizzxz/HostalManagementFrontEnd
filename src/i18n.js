import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language JSON files (ensure paths are correct)
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
    lng: 'en', // Set default language
    fallbackLng: 'en', // If language is not available
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
