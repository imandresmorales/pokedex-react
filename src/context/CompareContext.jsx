import { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

/** Maximum number of Pokémon that can be compared at once */
const MAX_COMPARE = 2;

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  /**
   * Add a Pokémon to the comparison list.
   * If the list is already full (MAX_COMPARE) the oldest entry is replaced.
   * If the Pokémon is already in the list, it is removed (toggle behaviour).
   *
   * @param {object} pokemon - Minimal pokemon object: { id, name, localizedName, sprite, types, stats }
   */
  const toggleCompare = (pokemon) => {
    setCompareList((prev) => {
      const alreadyIn = prev.some((p) => p.id === pokemon.id);
      if (alreadyIn) {
        // Deselect
        return prev.filter((p) => p.id !== pokemon.id);
      }
      if (prev.length >= MAX_COMPARE) {
        // Replace the first (oldest) selection
        return [prev[1], pokemon];
      }
      return [...prev, pokemon];
    });
  };

  const isInCompare = (id) => compareList.some((p) => p.id === id);

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompare() {
  return useContext(CompareContext);
}
