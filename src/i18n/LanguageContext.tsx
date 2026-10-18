import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, LanguageMeta, getTranslation, TRANSLATIONS } from './translations';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
  languageMeta: LanguageMeta;
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('vylo_preferred_lang');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved as SupportedLanguage;
      }
    } catch {
      // localStorage may not be accessible in some iframe sandbox modes
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('vylo_preferred_lang', currentLanguage);
    } catch {
      // ignore
    }
    const meta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);
    if (meta?.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const languageMeta = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  }, [currentLanguage]);

  const isRtl = Boolean(languageMeta.rtl);

  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      const val = getTranslation(currentLanguage, key);
      if (val && val !== key) return val;
      return fallback || getTranslation('en', key) || key;
    };
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    isRtl,
    languageMeta,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      currentLanguage: 'en',
      setLanguage: () => {},
      t: (key: string, fallback?: string) => getTranslation('en', key) || fallback || key,
      isRtl: false,
      languageMeta: SUPPORTED_LANGUAGES[0],
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
