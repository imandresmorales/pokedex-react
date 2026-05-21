import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPokemonList, fetchPokemon, fetchPokemonSpecies, getIdFromUrl, getLocalizedName } from '../services/pokeapi';
import { useLanguage } from '../context/LanguageContext';

const POKEMON_PER_PAGE = 20;

export function usePokemonList(generation) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { language } = useLanguage();

  // Store raw species data keyed by id so we can re-localise without re-fetching.
  // useRef avoids triggering re-renders when we write to it.
  const speciesCacheRef = useRef({});

  // Reset list when generation changes — setState calls are batched by React.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPokemon([]);
    setOffset(0);
    setHasMore(true);
  }, [generation.id]);

  /**
   * Re-compute localizedName for every cached Pokémon whenever the language
   * changes. This is a pure in-memory operation — no network requests.
   */
  useEffect(() => {
    setPokemon((prev) =>
      prev.map((p) => {
        const speciesData = speciesCacheRef.current[p.id];
        if (!speciesData) return p;
        return { ...p, localizedName: getLocalizedName(speciesData, language) };
      })
    );
  }, [language]);

  const loadPokemon = useCallback(async (currentOffset) => {
    try {
      const remainingInGen = generation.limit - currentOffset;
      const limit = Math.min(POKEMON_PER_PAGE, remainingInGen);

      if (limit <= 0) {
        setHasMore(false);
        return;
      }

      // We add the generation's global offset to the local offset
      const globalOffset = generation.offset + currentOffset;
      const listData = await fetchPokemonList(limit, globalOffset);

      const details = await Promise.all(
        listData.results.map(async (p) => {
          const id = getIdFromUrl(p.url);

          // Fetch pokemon data and species data in parallel for efficiency.
          // Both calls are wrapped by the in-memory cache in pokeapi.js, so
          // subsequent calls for the same id are instantaneous.
          const [data, speciesData] = await Promise.all([
            fetchPokemon(id),
            fetchPokemonSpecies(id),
          ]);

          // Store species data for later language re-mapping (no re-fetch needed)
          speciesCacheRef.current[id] = speciesData;

          return {
            id: data.id,
            name: data.name,
            localizedName: getLocalizedName(speciesData, language),
            types: data.types.map((t) => t.type.name),
            sprite: data.sprites.other['official-artwork'].front_default,
            stats: data.stats,
          };
        })
      );

      setPokemon((prev) => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPokemon = details.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPokemon];
      });

      setHasMore(currentOffset + limit < generation.limit);
    } catch (err) {
      setError(err.message);
    }
  // language is intentionally excluded: language changes are handled by the
  // separate useEffect above to avoid re-fetching the full list.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation]);

  // Initial load for the generation
  useEffect(() => {
    if (offset === 0 && pokemon.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      loadPokemon(0).finally(() => setLoading(false));
    }
  }, [offset, pokemon.length, loadPokemon]);

  // Load more function
  const loadMore = useCallback(async () => {
    const newOffset = offset + POKEMON_PER_PAGE;
    setOffset(newOffset);
    setLoadingMore(true);
    await loadPokemon(newOffset);
    setLoadingMore(false);
  }, [offset, loadPokemon]);

  return { pokemon, loading, loadingMore, error, hasMore, loadMore };
}
