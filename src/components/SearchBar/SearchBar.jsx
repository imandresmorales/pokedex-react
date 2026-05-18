import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { typeTranslationsES } from '../../utils/typeColors';
import './SearchBar.css';

export default function SearchBar({ value, onChange, onTypeFilter, types, activeType }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { language } = useLanguage();
  
  const getTypeName = (typeStr) => {
    return language === 'es' && typeTranslationsES[typeStr]
      ? typeTranslationsES[typeStr]
      : typeStr;
  };

  return (
    <div className="search-bar" id="search-bar">
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

      {/* Mobile: toggle button for filters */}
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
        {activeType 
          ? (language === 'es' ? `Filtro: ${getTypeName(activeType)}` : `Filter: ${getTypeName(activeType)}`) 
          : (language === 'es' ? 'Filtrar por tipo' : 'Filter by type')}
        {activeType && (
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
          className={`type-filter-btn ${!activeType ? 'active' : ''}`}
          onClick={() => { onTypeFilter(null); setFiltersOpen(false); }}
          type="button"
          aria-pressed={!activeType}
        >
          {language === 'es' ? 'Todos' : 'All'}
        </button>
        {types.map((type) => (
          <button
            key={type}
            className={`type-filter-btn ${activeType === type ? 'active' : ''}`}
            onClick={() => {
              onTypeFilter(type === activeType ? null : type);
              setFiltersOpen(false);
            }}
            data-type={type}
            type="button"
            aria-pressed={activeType === type}
          >
            {getTypeName(type)}
          </button>
        ))}
      </div>
    </div>
  );
}
