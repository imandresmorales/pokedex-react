import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { usePageTransition } from '../hooks/usePageTransition';
import { useEvolutionChain } from '../hooks/useEvolutionChain';
import TypeBadge from '../components/TypeBadge/TypeBadge';
import StatsChart from '../components/StatsChart/StatsChart';
import EvolutionChain from '../components/EvolutionChain/EvolutionChain';
import CryButton from '../components/CryButton/CryButton';
import { DetailSeo } from '../components/Seo/Seo';
import { typeColors } from '../utils/typeColors';
import './Detail.css';

export default function Detail() {
  const { id } = useParams();
  const { pokemon, species, loading, error } = usePokemonDetail(id);
  const { chain } = useEvolutionChain(id);
  const headingRef = useRef(null);
  const location = useLocation();

  /**
   * Move keyboard focus to the Pokémon name heading whenever the route changes.
   * This ensures screen reader users hear the new page title immediately
   * instead of staying on the previously focused element.
   * tabIndex="-1" on the h1 allows programmatic focus without adding it
   * to the natural tab order.
   */
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: false });
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-pokeball">
          <div className="pokeball-spin">
            <div className="spin-top"></div>
            <div className="spin-divider"><div className="spin-button"></div></div>
            <div className="spin-bottom"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="detail-error">
        <p>Failed to load Pokémon data.</p>
        <Link to="/" className="back-link">← Back to Pokédex</Link>
      </div>
    );
  }

  const navigateTo = usePageTransition();
  const primaryType = pokemon.types[0].type.name;
  const typeColor = typeColors[primaryType]?.bg || '#777';
  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 151 ? pokemon.id + 1 : null;

  return (
    <main className="detail-page" id="detail-page">
      <DetailSeo pokemon={pokemon} species={species} />
      <div className="detail-hero" style={{ background: `linear-gradient(180deg, ${typeColor}30, transparent)` }}>
        <div className="detail-nav">
          <Link to="/" className="back-btn" id="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Pokédex
          </Link>
          <div className="detail-arrows">
            {prevId && (
              <button
                className="arrow-btn"
                id="prev-btn"
                aria-label="Previous Pokémon"
                onClick={() => navigateTo(`/pokemon/${prevId}`)}
                type="button"
              >
                ‹
              </button>
            )}
            {nextId && (
              <button
                className="arrow-btn"
                id="next-btn"
                aria-label="Next Pokémon"
                onClick={() => navigateTo(`/pokemon/${nextId}`)}
                type="button"
              >
                ›
              </button>
            )}
          </div>
        </div>

        <div className="detail-header">
          <div className="detail-title-group">
            <span className="detail-number" style={{ color: `${typeColor}` }}>
              #{String(pokemon.id).padStart(3, '0')}
            </span>
            <h1
              ref={headingRef}
              className="detail-name"
              tabIndex="-1"
              id="pokemon-heading"
            >
              {pokemon.name}
            </h1>
            {species?.genus && (
              <span className="detail-genus">{species.genus}</span>
            )}
            <CryButton pokemonId={pokemon.id} pokemonName={pokemon.name} />
            <div className="detail-types">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
          </div>
          <div className="detail-artwork-wrapper">
            <div className="artwork-bg" style={{ background: `radial-gradient(circle, ${typeColor}25, transparent 70%)` }}></div>
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={`${pokemon.name} — #${String(pokemon.id).padStart(3, '0')} ${pokemon.types.map(t => t.type.name).join(' / ')} type Pokémon`}
              className="detail-artwork"
            />
          </div>
        </div>
      </div>

      <div className="detail-content">
        {/* Description */}
        <section className="detail-section" id="description-section">
          <h2 className="section-title">About</h2>
          <p className="detail-description">{species?.description}</p>
          <div className="detail-physical">
            <div className="physical-item">
              <span className="physical-value">{(pokemon.height / 10).toFixed(1)} m</span>
              <span className="physical-label">Height</span>
            </div>
            <div className="physical-divider"></div>
            <div className="physical-item">
              <span className="physical-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
              <span className="physical-label">Weight</span>
            </div>
            <div className="physical-divider"></div>
            <div className="physical-item">
              <span className="physical-value">{pokemon.base_experience}</span>
              <span className="physical-label">Base Exp</span>
            </div>
          </div>
        </section>

        {/* Abilities */}
        <section className="detail-section" id="abilities-section">
          <h2 className="section-title">Abilities</h2>
          <div className="abilities-list">
            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} className={`ability-chip ${a.is_hidden ? 'hidden-ability' : ''}`}>
                {a.ability.name.replace('-', ' ')}
                {a.is_hidden && <span className="hidden-tag">Hidden</span>}
              </span>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="detail-section" id="stats-section">
          <h2 className="section-title">Base Stats</h2>
          <StatsChart stats={pokemon.stats} />
          <div className="stats-total">
            <span className="total-label">Total</span>
            <span className="total-value">
              {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
            </span>
          </div>
        </section>
        {/* Evolution Chain */}
        <section className="detail-section" id="evolution-section">
          <h2 className="section-title">Evolution Chain</h2>
          <EvolutionChain chain={chain} currentId={pokemon.id} />
        </section>
      </div>
    </main>
  );
}
