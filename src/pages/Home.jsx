import { useState, useMemo } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import SearchBar from '../components/SearchBar/SearchBar';
import './Home.css';

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

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

  if (loading) {
    return (
      <div className="loading-container" role="status" aria-live="polite" aria-label="Loading Pokémon">
        <div className="loading-pokeball" aria-hidden="true">
          <div className="pokeball-spin">
            <div className="spin-top"></div>
            <div className="spin-divider"><div className="spin-button"></div></div>
            <div className="spin-bottom"></div>
          </div>
        </div>
        <p className="loading-text">Loading Pokémon...</p>
      </div>
    );
  }

  return (
    <>
      {/* Skip to main content — accessibility for keyboard users */}
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
          {filtered.length} Pokémon found
        </p>

        {filtered.length === 0 ? (
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
                  {loadingMore ? (
                    <span aria-hidden="true">Loading...</span>
                  ) : (
                    'Load More Pokémon'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
