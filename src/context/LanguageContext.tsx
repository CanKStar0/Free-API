'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDictionary } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: translations.tr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('api_showcase_lang') as Language;
      if (saved && (saved === 'tr' || saved === 'en')) {
        setLanguageState(saved);
      } else {
        // Check browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('en')) {
          setLanguageState('en');
        }
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('api_showcase_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language] || translations.tr;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
