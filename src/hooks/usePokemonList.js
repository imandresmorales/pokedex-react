import { useState, useEffect, useCallback } from 'react';
import { fetchPokemonList, fetchPokemon, getIdFromUrl } from '../services/pokeapi';

const POKEMON_PER_PAGE = 20;

export function usePokemonList(generation) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Reset list when generation changes
  useEffect(() => {
    setPokemon([]);
    setOffset(0);
    setHasMore(true);
  }, [generation.id]);

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
          const data = await fetchPokemon(id);
          return {
            id: data.id,
            name: data.name,
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
  }, [generation]);

  // Initial load for the generation
  useEffect(() => {
    if (offset === 0 && pokemon.length === 0) {
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
