import { useState, useMemo } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import { useFavorites } from '../context/FavoritesContext';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import SkeletonCard from '../components/SkeletonCard/SkeletonCard';
import SearchBar from '../components/SearchBar/SearchBar';
import { HomeSeo } from '../components/Seo/Seo';
import { GENERATIONS } from '../utils/generations';
import './Home.css';

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const SKELETON_COUNT = 20;

export default function Home() {
  const [activeGenIndex, setActiveGenIndex] = useState(0);
  const { pokemon, loading, loadingMore, hasMore, loadMore } = usePokemonList(GENERATIONS[activeGenIndex]);
  const { favorites } = useFavorites();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favorites'

  const sourceList = activeTab === 'favorites' ? favorites : pokemon;

  const filtered = useMemo(() => {
    let result = sourceList;
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
  }, [sourceList, search, activeType]);

  const showLoadMore =
    activeTab === 'all' && hasMore && !search && !activeType;

  return (
    <>
      <HomeSeo />
      <a href="#pokemon-grid" className="skip-link">Skip to Pokémon list</a>

      <main className="home-page" id="home-page">
        {/* Tabs */}
        <div className="home-tabs" role="tablist" aria-label="Pokémon list view">
          <button
            className={`home-tab ${activeTab === 'all' ? 'home-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
            role="tab"
            aria-selected={activeTab === 'all'}
            id="tab-all"
            type="button"
          >
            All Pokémon
          </button>
          <button
            className={`home-tab ${activeTab === 'favorites' ? 'home-tab--active' : ''}`}
            onClick={() => setActiveTab('favorites')}
            role="tab"
            aria-selected={activeTab === 'favorites'}
            id="tab-favorites"
            type="button"
          >
            ❤️ Favorites
            {favorites.length > 0 && (
              <span className="tab-badge">{favorites.length}</span>
            )}
          </button>
        </div>

        {activeTab === 'all' && (
          <div className="generation-selector-wrapper">
            <label htmlFor="gen-select" className="sr-only">Select Generation</label>
            <select 
              id="gen-select" 
              className="gen-select"
              value={activeGenIndex}
              onChange={(e) => setActiveGenIndex(Number(e.target.value))}
              aria-label="Filter by Generation"
            >
              {GENERATIONS.map((gen, idx) => (
                <option key={gen.id} value={idx}>{gen.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="search-sticky-wrapper">
          <SearchBar
            value={search}
            onChange={setSearch}
            onTypeFilter={setActiveType}
            types={ALL_TYPES}
            activeType={activeType}
          />
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {loading ? 'Loading Pokémon…' : `${filtered.length} Pokémon found`}
        </p>

        {loading && activeTab === 'all' ? (
          <div className="pokemon-grid" id="pokemon-grid" aria-label="Loading Pokémon">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-results" role="alert">
            {activeTab === 'favorites' ? (
              <p>You haven't saved any favorites yet.<br />Click the ❤️ on a Pokémon card to add it.</p>
            ) : (
              <p>No Pokémon found matching your search.</p>
            )}
          </div>
        ) : (
          <>
            <div
              className="pokemon-grid"
              id="pokemon-grid"
              role="list"
              aria-label={`${filtered.length} Pokémon${activeType ? ` of type ${activeType}` : ''}`}
            >
              {filtered.map((p, i) => (
                <div key={p.id} role="listitem">
                  <PokemonCard pokemon={p} index={i} />
                </div>
              ))}
              {loadingMore &&
                Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={`more-${i}`} />
                ))}
            </div>

            {showLoadMore && (
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
