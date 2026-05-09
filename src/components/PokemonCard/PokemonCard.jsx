import { Link } from 'react-router-dom';
import TypeBadge from '../TypeBadge/TypeBadge';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import { typeColors } from '../../utils/typeColors';
import './PokemonCard.css';

export default function PokemonCard({ pokemon, index = 0 }) {
  const primaryType = pokemon.types[0];
  const typeColor = typeColors[primaryType]?.bg || '#777';
  // Cap the delay at 400ms so cards far down the list don't wait too long
  const delay = Math.min(index * 40, 400);

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="pokemon-card"
      id={`pokemon-card-${pokemon.id}`}
      style={{ '--card-delay': `${delay}ms` }}
    >
      <div
        className="card-bg-accent"
        style={{ background: `linear-gradient(135deg, ${typeColor}20, ${typeColor}08)` }}
      />
      <div className="card-pokeball-watermark" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke={typeColor} strokeWidth="3" opacity="0.1" />
          <line x1="2" y1="50" x2="98" y2="50" stroke={typeColor} strokeWidth="3" opacity="0.1" />
          <circle cx="50" cy="50" r="14" stroke={typeColor} strokeWidth="3" opacity="0.1" />
        </svg>
      </div>

      {/* Top row: number + favorite */}
      <div className="card-top-row">
        <span className="card-number" style={{ color: `${typeColor}99` }}>
          #{String(pokemon.id).padStart(3, '0')}
        </span>
        <FavoriteButton pokemon={pokemon} />
      </div>

      <div className="card-image-wrapper">
        <img
          src={pokemon.sprite}
          alt={`${pokemon.name} — ${pokemon.types.join(' / ')} type Pokémon`}
          className="card-image"
          loading="lazy"
        />
      </div>
      <h3 className="card-name">{pokemon.name}</h3>
      <div className="card-types">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  );
}
