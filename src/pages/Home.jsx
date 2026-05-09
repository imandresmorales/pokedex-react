import { useState, useMemo } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import SkeletonCard from '../components/SkeletonCard/SkeletonCard';
import SearchBar from '../components/SearchBar/SearchBar';
import './Home.css';

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

// Number of skeleton cards to show while loading
const SKELETON_COUNT = 20;

export default function Home() {
  const { pokemon, loading, loadingMore, hasMore, loadMore } = usePokemonList();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState(null);

  const filtered = useMemo(() => {
    let result = pokemon;
    if (search) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          String(p.id).includes(term) ||
          String(p.id).padStart(3, '0').includes(term)
      );
    }
    if (activeType) {
      result = result.filter((p) => p.types.includes(activeType));
    }
    return result;
  }, [pokemon, search, activeType]);

  return (
    <>
      {/* Skip to main content — keyboard accessibility */}
      <a href="#pokemon-grid" className="skip-link">Skip to Pokémon list</a>

      <main className="home-page" id="home-page">
        <SearchBar
          value={search}
          onChange={setSearch}
          onTypeFilter={setActiveType}
          types={ALL_TYPES}
          activeType={activeType}
        />

        {/* Live region announces result count to screen readers */}
        <p className="sr-only" role="status" aria-live="polite">
          {loading ? 'Loading Pokémon…' : `${filtered.length} Pokémon found`}
        </p>

        {/* Skeleton grid while loading */}
        {loading ? (
          <div
            className="pokemon-grid"
            id="pokemon-grid"
            aria-label="Loading Pokémon"
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-results" role="alert">
            <p>No Pokémon found matching your search.</p>
          </div>
        ) : (
          <>
            <div
              className="pokemon-grid"
              id="pokemon-grid"
              role="list"
              aria-label={`${filtered.length} Pokémon${activeType ? ` of type ${activeType}` : ''}`}
            >
              {filtered.map((p) => (
                <div key={p.id} role="listitem">
                  <PokemonCard pokemon={p} />
                </div>
              ))}

              {/* Inline skeleton rows while loading more */}
              {loadingMore &&
                Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={`more-${i}`} />
                ))}
            </div>

            {hasMore && !search && !activeType && (
              <div className="load-more-wrapper">
                <button
                  className="load-more-btn"
                  onClick={loadMore}
                  disabled={loadingMore}
                  id="load-more-btn"
                  aria-label={loadingMore ? 'Loading more Pokémon' : 'Load more Pokémon'}
                >
                  {loadingMore ? 'Loading…' : 'Load More Pokémon'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
