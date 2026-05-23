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
  const [activeTypes, setActiveTypes] = useState([]);
  const [weightRange, setWeightRange] = useState({ min: 0, max: 500 });
  const [heightRange, setHeightRange] = useState({ min: 0, max: 10 });
  const [minHp, setMinHp] = useState(0);
  const [minAttack, setMinAttack] = useState(0);
  const [minSpeed, setMinSpeed] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favorites'

  const sourceList = activeTab === 'favorites' ? favorites : pokemon;

  const handleResetFilters = () => {
    setActiveTypes([]);
    setWeightRange({ min: 0, max: 500 });
    setHeightRange({ min: 0, max: 10 });
    setMinHp(0);
    setMinAttack(0);
    setMinSpeed(0);
  };

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
    if (activeTypes.length > 0) {
      result = result.filter((p) =>
        activeTypes.every((type) => p.types.includes(type))
      );
    }
    if (weightRange.min > 0 || weightRange.max < 500) {
      result = result.filter((p) => {
        const kg = p.weight / 10;
        return kg >= weightRange.min && (weightRange.max === 500 || kg <= weightRange.max);
      });
    }
    if (heightRange.min > 0 || heightRange.max < 10) {
      result = result.filter((p) => {
        const m = p.height / 10;
        return m >= heightRange.min && (heightRange.max === 10 || m <= heightRange.max);
      });
    }
    if (minHp > 0) {
      result = result.filter((p) => {
        const hpStat = p.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0;
        return hpStat >= minHp;
      });
    }
    if (minAttack > 0) {
      result = result.filter((p) => {
        const atkStat = p.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
        return atkStat >= minAttack;
      });
    }
    if (minSpeed > 0) {
      result = result.filter((p) => {
        const spdStat = p.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0;
        return spdStat >= minSpeed;
      });
    }
    return result;
  }, [sourceList, search, activeTypes, weightRange, heightRange, minHp, minAttack, minSpeed]);

  const isAnyFilterActive =
    search ||
    activeTypes.length > 0 ||
    weightRange.min > 0 ||
    weightRange.max < 500 ||
    heightRange.min > 0 ||
    heightRange.max < 10 ||
    minHp > 0 ||
    minAttack > 0 ||
    minSpeed > 0;

  const showLoadMore =
    activeTab === 'all' && hasMore && !isAnyFilterActive;

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
            onTypeFilter={setActiveTypes}
            types={ALL_TYPES}
            activeTypes={activeTypes}
            weightRange={weightRange}
            onWeightRangeChange={setWeightRange}
            heightRange={heightRange}
            onHeightRangeChange={setHeightRange}
            minHp={minHp}
            onMinHpChange={setMinHp}
            minAttack={minAttack}
            onMinAttackChange={setMinAttack}
            minSpeed={minSpeed}
            onMinSpeedChange={setMinSpeed}
            onResetFilters={handleResetFilters}
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
              aria-label={`${filtered.length} Pokémon${activeTypes.length > 0 ? ` of type ${activeTypes.join(' and ')}` : ''}`}
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
