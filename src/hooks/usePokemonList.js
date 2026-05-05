import { useState, useEffect, useCallback } from 'react';
import { fetchPokemonList, fetchPokemon, getIdFromUrl } from '../services/pokeapi';

const POKEMON_PER_PAGE = 20;
const MAX_POKEMON = 151; // Gen 1

export function usePokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPokemon = useCallback(async (currentOffset) => {
    try {
      const remaining = MAX_POKEMON - currentOffset;
      const limit = Math.min(POKEMON_PER_PAGE, remaining);

      if (limit <= 0) {
        setHasMore(false);
        return;
      }

      const listData = await fetchPokemonList(limit, currentOffset);
      
      // Fetch details for each Pokémon in parallel
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

      setHasMore(currentOffset + limit < MAX_POKEMON);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    setLoading(true);
    loadPokemon(0).finally(() => setLoading(false));
  }, [loadPokemon]);

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
