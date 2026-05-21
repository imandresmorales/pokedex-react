import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import './CompareBar.css';

/**
 * Fixed bottom bar that appears when one or two Pokémon are selected for comparison.
 * Shows avatars of selected Pokémon, a "Compare" button (active when 2 selected),
 * and a clear button.
 */
export default function CompareBar() {
  const { compareList, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  const canCompare = compareList.length === 2;

  return (
    <div
      className="compare-bar"
      role="region"
      aria-label="Pokémon comparison tray"
      id="compare-bar"
    >
      <div className="compare-bar__slots">
        {/* Slot A */}
        <CompareSlot pokemon={compareList[0]} />
        {/* VS separator */}
        <span className="compare-bar__vs" aria-hidden="true">VS</span>
        {/* Slot B */}
        <CompareSlot pokemon={compareList[1] || null} empty />
      </div>

      <div className="compare-bar__actions">
        <button
          className="compare-bar__go-btn"
          onClick={() => navigate('/compare')}
          disabled={!canCompare}
          aria-label={canCompare ? 'Compare the two selected Pokémon' : 'Select one more Pokémon to compare'}
          type="button"
          id="compare-go-btn"
        >
          Compare
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <button
          className="compare-bar__clear-btn"
          onClick={clearCompare}
          aria-label="Clear comparison selection"
          type="button"
          id="compare-clear-btn"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function CompareSlot({ pokemon }) {
  if (!pokemon) {
    return (
      <div className="compare-slot compare-slot--empty" aria-label="Empty comparison slot">
        <span className="compare-slot__placeholder">?</span>
      </div>
    );
  }
  return (
    <div className="compare-slot" aria-label={pokemon.localizedName || pokemon.name}>
      <img
        src={pokemon.sprite}
        alt={pokemon.localizedName || pokemon.name}
        className="compare-slot__img"
        loading="lazy"
      />
      <span className="compare-slot__name">
        {pokemon.localizedName || pokemon.name}
      </span>
    </div>
  );
}
