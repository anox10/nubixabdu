import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import ml from '../locales/ml.json';
import hi from '../locales/hi.json';

const LanguageContext = createContext();

const translations = {
  en,
  ml,
  hi
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('clinora_language') || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('clinora_language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
