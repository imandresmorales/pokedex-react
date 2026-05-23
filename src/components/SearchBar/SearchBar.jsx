import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { typeTranslationsES } from '../../utils/typeColors';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  onTypeFilter,
  types,
  activeTypes = [],
  weightRange,
  onWeightRangeChange,
  heightRange,
  onHeightRangeChange,
  minHp,
  onMinHpChange,
  minAttack,
  onMinAttackChange,
  minSpeed,
  onMinSpeedChange,
  onResetFilters,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const { language } = useLanguage();
  
  const getTypeName = (typeStr) => {
    return language === 'es' && typeTranslationsES[typeStr]
      ? typeTranslationsES[typeStr]
      : typeStr;
  };

  const handleTypeClick = (type) => {
    if (activeTypes.includes(type)) {
      onTypeFilter(activeTypes.filter((t) => t !== type));
    } else {
      if (activeTypes.length < 2) {
        onTypeFilter([...activeTypes, type]);
      }
    }
  };

  const activeTypesLabel = activeTypes.map(t => getTypeName(t)).join(', ');

  return (
    <div className="search-bar" id="search-bar">
      <div className="search-controls-row">
        <div className="search-input-wrapper">
          <label htmlFor="search-input" className="sr-only">
            Search Pokémon
          </label>
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="search-input"
            type="search"
            placeholder={language === 'es' ? 'Buscar Pokémon por nombre o número...' : 'Search Pokémon by name or number...'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="search-input"
            autoComplete="off"
            aria-label={language === 'es' ? 'Buscar Pokémon' : 'Search Pokémon'}
          />
          {value && (
            <button
              className="search-clear"
              onClick={() => onChange('')}
              aria-label="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        <button 
          type="button" 
          className={`adv-filters-toggle-btn ${advOpen ? 'active' : ''}`}
          onClick={() => setAdvOpen(!advOpen)}
          aria-expanded={advOpen}
          aria-controls="adv-filters-panel"
        >
          ⚙️ {language === 'es' ? 'Filtros' : 'Filters'}
        </button>
      </div>

      {/* Mobile: toggle button for type filters */}
      <button
        className="filters-toggle-btn"
        onClick={() => setFiltersOpen((prev) => !prev)}
        aria-expanded={filtersOpen}
        aria-controls="type-filters"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="16" height="16">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        {activeTypes.length > 0 
          ? (language === 'es' ? `Tipos: ${activeTypesLabel}` : `Types: ${activeTypesLabel}`) 
          : (language === 'es' ? 'Filtrar por tipo' : 'Filter by type')}
        {activeTypes.length > 0 && (
          <span
            className="filters-clear-dot"
            aria-label="Filter active"
          />
        )}
      </button>

      <div
        className={`type-filters ${filtersOpen ? 'type-filters--open' : ''}`}
        id="type-filters"
        role="group"
        aria-label="Filter by Pokémon type"
      >
        <button
          className={`type-filter-btn ${activeTypes.length === 0 ? 'active' : ''}`}
          onClick={() => { onTypeFilter([]); setFiltersOpen(false); }}
          type="button"
          aria-pressed={activeTypes.length === 0}
        >
          {language === 'es' ? 'Todos' : 'All'}
        </button>
        {types.map((type) => (
          <button
            key={type}
            className={`type-filter-btn ${activeTypes.includes(type) ? 'active' : ''}`}
            onClick={() => handleTypeClick(type)}
            data-type={type}
            type="button"
            aria-pressed={activeTypes.includes(type)}
          >
            {getTypeName(type)}
          </button>
        ))}
      </div>

      {advOpen && (
        <div className="adv-filters-panel" id="adv-filters-panel">
          <div className="adv-filters-grid">
            {/* Weight range filter */}
            <div className="adv-filter-group">
              <span className="adv-group-title">⚖️ {language === 'es' ? 'Peso (kg)' : 'Weight (kg)'}</span>
              <div className="slider-row">
                <label htmlFor="weight-min">{language === 'es' ? 'Mín:' : 'Min:'} {weightRange.min} kg</label>
                <input 
                  id="weight-min"
                  type="range" 
                  min="0" 
                  max="500" 
                  value={weightRange.min} 
                  onChange={(e) => onWeightRangeChange({ ...weightRange, min: Number(e.target.value) })}
                  className="adv-slider"
                />
              </div>
              <div className="slider-row">
                <label htmlFor="weight-max">{language === 'es' ? 'Máx:' : 'Max:'} {weightRange.max === 500 ? '500+' : weightRange.max} kg</label>
                <input 
                  id="weight-max"
                  type="range" 
                  min="0" 
                  max="500" 
                  value={weightRange.max} 
                  onChange={(e) => onWeightRangeChange({ ...weightRange, max: Number(e.target.value) })}
                  className="adv-slider"
                />
              </div>
            </div>

            {/* Height range filter */}
            <div className="adv-filter-group">
              <span className="adv-group-title">📏 {language === 'es' ? 'Altura (m)' : 'Height (m)'}</span>
              <div className="slider-row">
                <label htmlFor="height-min">{language === 'es' ? 'Mín:' : 'Min:'} {heightRange.min} m</label>
                <input 
                  id="height-min"
                  type="range" 
                  min="0" 
                  max="10" 
                  step="0.5"
                  value={heightRange.min} 
                  onChange={(e) => onHeightRangeChange({ ...heightRange, min: Number(e.target.value) })}
                  className="adv-slider"
                />
              </div>
              <div className="slider-row">
                <label htmlFor="height-max">{language === 'es' ? 'Máx:' : 'Max:'} {heightRange.max === 10 ? '10+' : heightRange.max} m</label>
                <input 
                  id="height-max"
                  type="range" 
                  min="0" 
                  max="10" 
                  step="0.5"
                  value={heightRange.max} 
                  onChange={(e) => onHeightRangeChange({ ...heightRange, max: Number(e.target.value) })}
                  className="adv-slider"
                />
              </div>
            </div>

            {/* Stats filter */}
            <div className="adv-filter-group">
              <span className="adv-group-title">📈 {language === 'es' ? 'Estadísticas Mínimas' : 'Min Stats'}</span>
              <div className="slider-row">
                <label htmlFor="stat-hp">HP: {minHp}</label>
                <input 
                  id="stat-hp"
                  type="range" 
                  min="0" 
                  max="200" 
                  value={minHp} 
                  onChange={(e) => onMinHpChange(Number(e.target.value))}
                  className="adv-slider"
                />
              </div>
              <div className="slider-row">
                <label htmlFor="stat-atk">{language === 'es' ? 'Ataque:' : 'Attack:'} {minAttack}</label>
                <input 
                  id="stat-atk"
                  type="range" 
                  min="0" 
                  max="200" 
                  value={minAttack} 
                  onChange={(e) => onMinAttackChange(Number(e.target.value))}
                  className="adv-slider"
                />
              </div>
              <div className="slider-row">
                <label htmlFor="stat-spd">{language === 'es' ? 'Velocidad:' : 'Speed:'} {minSpeed}</label>
                <input 
                  id="stat-spd"
                  type="range" 
                  min="0" 
                  max="200" 
                  value={minSpeed} 
                  onChange={(e) => onMinSpeedChange(Number(e.target.value))}
                  className="adv-slider"
                />
              </div>
            </div>
          </div>
          
          <div className="adv-filters-footer">
            <button 
              type="button" 
              className="adv-reset-btn" 
              onClick={onResetFilters}
            >
              🧹 {language === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
