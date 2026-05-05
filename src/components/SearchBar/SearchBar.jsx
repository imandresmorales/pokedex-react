import './SearchBar.css';

export default function SearchBar({ value, onChange, onTypeFilter, types, activeType }) {
  return (
    <div className="search-bar" id="search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          id="search-input"
          type="text"
          placeholder="Search Pokémon by name or number..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
        />
        {value && (
          <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>
      <div className="type-filters" id="type-filters">
        <button
          className={`type-filter-btn ${!activeType ? 'active' : ''}`}
          onClick={() => onTypeFilter(null)}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            className={`type-filter-btn ${activeType === type ? 'active' : ''}`}
            onClick={() => onTypeFilter(type === activeType ? null : type)}
            style={{
              '--type-color': `var(--color-${type})`,
            }}
            data-type={type}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
