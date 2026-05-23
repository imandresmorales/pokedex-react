import { createContext, useContext, useState, useEffect } from 'react';

const TeamContext = createContext();
const STORAGE_KEY = 'pokedex-team';
const MAX_TEAM_SIZE = 6;

export function TeamProvider({ children }) {
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    } catch {
      // Ignore
    }
  }, [team]);

  const addToTeam = (pokemon) => {
    if (team.length >= MAX_TEAM_SIZE) {
      return { success: false, error: 'full' };
    }
    if (team.some((p) => p.id === pokemon.id)) {
      return { success: false, error: 'exists' };
    }
    // We store name, id, types, sprite, and base stats for analytics
    const pokemonData = {
      id: pokemon.id,
      name: pokemon.name,
      localizedName: pokemon.localizedName || pokemon.name,
      sprite: pokemon.sprite || pokemon.sprites?.other['official-artwork']?.front_default || pokemon.sprites?.front_default,
      types: pokemon.types.map(t => typeof t === 'string' ? t : t.type.name),
      stats: pokemon.stats,
    };
    setTeam((prev) => [...prev, pokemonData]);
    return { success: true };
  };

  const removeFromTeam = (pokemonId) => {
    setTeam((prev) => prev.filter((p) => p.id !== pokemonId));
  };

  const isInTeam = (pokemonId) => {
    return team.some((p) => p.id === pokemonId);
  };

  return (
    <TeamContext.Provider value={{ team, addToTeam, removeFromTeam, isInTeam, maxTeamSize: MAX_TEAM_SIZE }}>
      {children}
    </TeamContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
