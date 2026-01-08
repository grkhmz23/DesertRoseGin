import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import enCommon from './locales/en/common.json';
import itCommon from './locales/it/common.json';
import deCommon from './locales/de/common.json';
import arCommon from './locales/ar/common.json';
import frCommon from './locales/fr/common.json';
import esCommon from './locales/es/common.json';

const resources = {
  en: { common: enCommon },
  it: { common: itCommon },
  de: { common: deCommon },
  ar: { common: arCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'en',
    lng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;
