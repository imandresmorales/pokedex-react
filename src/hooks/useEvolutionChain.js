import { useState, useEffect } from 'react';
import {
  fetchPokemonSpecies,
  fetchEvolutionChain,
  parseEvolutionChain,
} from '../services/pokeapi';

/**
 * Returns the flat evolution chain for a given Pokémon ID.
 * Each stage: { id, name, trigger, minLevel }
 */
export function useEvolutionChain(pokemonId) {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemonId) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchPokemonSpecies(pokemonId)
      .then((species) => fetchEvolutionChain(species.evolution_chain.url))
      .then((data) => {
        if (!cancelled) {
          setChain(parseEvolutionChain(data.chain));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Cleanup: ignore stale responses on id change
    return () => { cancelled = true; };
  }, [pokemonId]);

  return { chain, loading, error };
}
