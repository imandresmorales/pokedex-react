import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();
const STORAGE_KEY = 'pokedex-language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Fallback to browser language if not set
      if (!saved && typeof window !== 'undefined' && window.navigator && window.navigator.language) {
        return window.navigator.language.startsWith('es') ? 'es' : 'en';
      }
      return saved === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  return useContext(LanguageContext);
}
