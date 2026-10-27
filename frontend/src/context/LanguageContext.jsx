import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('agritech_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agritech_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const switchLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
    }
  };

  // Helper function to resolve dot-notation strings like 'nav.dashboard'
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang] || translations.en;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fbKey of keys) {
          fallback = fallback?.[fbKey];
        }
        return fallback || path;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
