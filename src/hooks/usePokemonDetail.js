import { useState, useEffect } from 'react';
import { fetchPokemon, fetchPokemonSpecies, getLocalizedFlavorText, getLocalizedGenus, getLocalizedName } from '../services/pokeapi';
import { useLanguage } from '../context/LanguageContext';

export function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (!id) return;

    // Reset loading/error state before fetching — React batches these setState calls.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          // Localized name from the species `names` array (e.g. 'Bulbasaur' → 'Bulbasaur' in ES)
          localizedName: getLocalizedName(speciesData, language),
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
