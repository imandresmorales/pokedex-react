import { usePokemonCry } from '../../hooks/usePokemonCry';
import './CryButton.css';

/**
 * Button to play the Pokémon's cry.
 * Hidden from screen readers as a decorative/supplemental feature.
 *
 * @param {{ pokemonId: number, pokemonName: string }} props
 */
export default function CryButton({ pokemonId, pokemonName }) {
  const { play, isPlaying, isSupported } = usePokemonCry(pokemonId);

  if (!isSupported) return null;

  return (
    <button
      className={`cry-btn ${isPlaying ? 'cry-btn--playing' : ''}`}
      onClick={play}
      disabled={isPlaying}
      aria-label={`Play ${pokemonName}'s cry sound`}
      title={`Play ${pokemonName}'s cry`}
      type="button"
      id={`cry-btn-${pokemonId}`}
    >
      {/* Speaker wave SVG */}
      {isPlaying ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
      <span className="cry-btn-label">{isPlaying ? 'Playing…' : 'Play cry'}</span>
    </button>
  );
}
