import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('pokedex-theme');
    if (saved) return saved === 'dark';
    // Default: follow OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme attribute and persist preference
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('pokedex-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Listen for OS-level theme changes (only when user hasn't manually set a preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only sync with OS if the user hasn't manually overridden it
      const saved = localStorage.getItem('pokedex-theme');
      if (!saved) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
