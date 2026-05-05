import { useState, useEffect } from 'react';
import { fetchPokemon, fetchPokemonSpecies, getEnglishFlavorText, getEnglishGenus } from '../services/pokeapi';

export function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetchPokemon(id),
      fetchPokemonSpecies(id),
    ])
      .then(([pokemonData, speciesData]) => {
        setPokemon(pokemonData);
        setSpecies({
          ...speciesData,
          description: getEnglishFlavorText(speciesData),
          genus: getEnglishGenus(speciesData),
        });
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { pokemon, species, loading, error };
}
