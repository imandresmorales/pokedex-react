import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pokedex-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('pokedex-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((pokemon) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === pokemon.id);
      return exists
        ? prev.filter((p) => p.id !== pokemon.id)
        : [...prev, pokemon];
    });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((p) => p.id === id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  return useContext(FavoritesContext);
}
