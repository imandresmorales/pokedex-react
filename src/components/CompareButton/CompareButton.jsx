import { useCompare } from '../../context/CompareContext';
import './CompareButton.css';

/**
 * Small button rendered on each PokemonCard to add/remove a Pokémon
 * from the comparison selection (max 2 at a time).
 *
 * @param {{ pokemon: object }} props
 */
export default function CompareButton({ pokemon }) {
  const { isInCompare, toggleCompare, compareList } = useCompare();
  const selected = isInCompare(pokemon.id);
  const full = compareList.length >= 2 && !selected;

  const handleClick = (e) => {
    // Prevent the parent card anchor from navigating
    e.preventDefault();
    e.stopPropagation();
    if (full) return;
    toggleCompare(pokemon);
  };

  return (
    <button
      className={`compare-btn ${selected ? 'compare-btn--active' : ''} ${full ? 'compare-btn--disabled' : ''}`}
      onClick={handleClick}
      aria-label={selected ? `Remove ${pokemon.localizedName || pokemon.name} from comparison` : `Add ${pokemon.localizedName || pokemon.name} to comparison`}
      aria-pressed={selected}
      title={full ? 'Comparison full — deselect one to add another' : (selected ? 'Remove from comparison' : 'Add to comparison')}
      type="button"
      id={`compare-btn-${pokemon.id}`}
      disabled={full}
    >
      {/* Balance / scales icon */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="14" height="14">
        <line x1="12" y1="3" x2="12" y2="21" />
        <polyline points="3 6 12 3 21 6" />
        <line x1="4" y1="9" x2="8" y2="17" />
        <line x1="8" y1="17" x2="4" y2="17" />
        <line x1="20" y1="9" x2="16" y2="17" />
        <line x1="16" y1="17" x2="20" y2="17" />
      </svg>
    </button>
  );
}
