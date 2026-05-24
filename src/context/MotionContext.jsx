import { createContext, useContext, useState, useEffect } from 'react';

const MotionContext = createContext();
const STORAGE_KEY = 'pokedex-motion';

export function MotionProvider({ children }) {
  const [motion, setMotion] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'reduced' || saved === 'normal') {
        return saved;
      }
      // Detect system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'reduced'
          : 'normal';
      }
      return 'normal';
    } catch {
      return 'normal';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, motion);
    } catch {
      // Ignore
    }

    if (motion === 'reduced') {
      document.documentElement.setAttribute('data-motion', 'reduced');
    } else {
      document.documentElement.removeAttribute('data-motion');
    }
  }, [motion]);

  const toggleMotion = () => {
    setMotion((prev) => (prev === 'normal' ? 'reduced' : 'normal'));
  };

  const isReduced = motion === 'reduced';

  return (
    <MotionContext.Provider value={{ motion, isReduced, toggleMotion }}>
      {children}
    </MotionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
}
