import { createContext, useContext, useState, useEffect } from 'react';

const ContrastContext = createContext();

export function ContrastProvider({ children }) {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    try {
      return localStorage.getItem('pokedex-contrast') === 'high';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-contrast',
      isHighContrast ? 'high' : 'normal'
    );
    try {
      localStorage.setItem('pokedex-contrast', isHighContrast ? 'high' : 'normal');
    } catch {
      // localStorage unavailable — graceful degradation
    }
  }, [isHighContrast]);

  const toggleContrast = () => setIsHighContrast((prev) => !prev);

  return (
    <ContrastContext.Provider value={{ isHighContrast, toggleContrast }}>
      {children}
    </ContrastContext.Provider>
  );
}

export function useContrast() {
  return useContext(ContrastContext);
}
