import { createContext, useContext, useState, useEffect } from 'react';

/** Available font size steps in rem */
const SIZES = [0.875, 1, 1.125, 1.25];
const DEFAULT_INDEX = 1; // index 1 = 1rem (browser default)
const STORAGE_KEY = 'pokedex-font-size-index';

const FontSizeContext = createContext();

export function FontSizeProvider({ children }) {
  const [sizeIndex, setSizeIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = parseInt(saved, 10);
      // Validate saved value is a valid index
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < SIZES.length) {
        return parsed;
      }
    } catch {
      // localStorage unavailable
    }
    return DEFAULT_INDEX;
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--base-font-size',
      `${SIZES[sizeIndex]}rem`
    );
    // Also set the actual font-size on :root so relative em/rem scales cascade
    document.documentElement.style.fontSize = `${SIZES[sizeIndex] * 16}px`;

    try {
      localStorage.setItem(STORAGE_KEY, String(sizeIndex));
    } catch {
      // Silently ignore
    }
  }, [sizeIndex]);

  const increase = () => setSizeIndex((i) => Math.min(i + 1, SIZES.length - 1));
  const decrease = () => setSizeIndex((i) => Math.max(i - 1, 0));
  const reset    = () => setSizeIndex(DEFAULT_INDEX);

  return (
    <FontSizeContext.Provider
      value={{
        sizeIndex,
        sizeRem: SIZES[sizeIndex],
        canIncrease: sizeIndex < SIZES.length - 1,
        canDecrease: sizeIndex > 0,
        increase,
        decrease,
        reset,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFontSize() {
  return useContext(FontSizeContext);
}
