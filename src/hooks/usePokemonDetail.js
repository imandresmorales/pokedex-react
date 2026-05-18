import { useState, useEffect } from 'react';
import { fetchPokemon, fetchPokemonSpecies, getLocalizedFlavorText, getLocalizedGenus } from '../services/pokeapi';
import { useLanguage } from '../context/LanguageContext';

export function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

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
          description: getLocalizedFlavorText(speciesData, language),
          genus: getLocalizedGenus(speciesData, language),
        });
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, language]);

  return { pokemon, species, loading, error };
}
