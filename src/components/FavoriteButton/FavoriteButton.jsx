import { useFavorites } from '../../context/FavoritesContext';
import './FavoriteButton.css';

export default function FavoriteButton({ pokemon, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(pokemon.id);

  const handleClick = (e) => {
    // Prevent navigating to detail page when card is a Link
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon);
  };

  return (
    <button
      className={`fav-btn ${fav ? 'fav-btn--active' : ''} ${className}`}
      onClick={handleClick}
      aria-label={fav ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
      aria-pressed={fav}
      type="button"
      id={`fav-btn-${pokemon.id}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={fav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
