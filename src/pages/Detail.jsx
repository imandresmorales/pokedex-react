import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { fetchPokemonEncounters } from '../services/pokeapi';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { usePageTransition } from '../hooks/usePageTransition';
import { useEvolutionChain } from '../hooks/useEvolutionChain';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { useLanguage } from '../context/LanguageContext';
import { useTeam } from '../context/TeamContext';
import TypeBadge from '../components/TypeBadge/TypeBadge';
import StatsChart from '../components/StatsChart/StatsChart';
import EvolutionChain from '../components/EvolutionChain/EvolutionChain';
import CryButton from '../components/CryButton/CryButton';
import MovesList from '../components/MovesList/MovesList';
import { DetailSeo } from '../components/Seo/Seo';
import { typeColors } from '../utils/typeColors';
import { formatMeasurement, formatNumber } from '../utils/formatters';
import { getTypeMatchups } from '../utils/typeMatchups';
import './Detail.css';

const TRANSLATIONS = {
  en: {
    about: 'About',
    abilities: 'Abilities',
    stats: 'Base Stats',
    total: 'Total',
    evolution: 'Evolution Chain',
    effectiveness: 'Type Effectiveness',
    weak4x: 'Weakness (4x)',
    weak2x: 'Weakness (2x)',
    resistHalf: 'Resistance (0.5x)',
    resistQuarter: 'Resistance (0.25x)',
    immune: 'Immune (0x)',
    height: 'Height',
    weight: 'Weight',
    baseExp: 'Base Exp',
    hidden: 'Hidden',
    addToTeam: 'Add to Team',
    removeFromTeam: 'Remove from Team',
    teamFull: 'Your team is full! (Max 6)',
    genderRatio: 'Gender Ratio',
    catchRate: 'Catch Rate',
    male: 'Male',
    female: 'Female',
    genderless: 'Genderless',
    wildLocations: 'Wild Encounters',
    noLocations: 'Only via evolution, trade or special event',
  },
  es: {
    about: 'Acerca de',
    abilities: 'Habilidades',
    stats: 'Estadísticas Base',
    total: 'Total',
    evolution: 'Cadena Evolutiva',
    effectiveness: 'Efectividad de Tipos',
    weak4x: 'Debilidad (4x)',
    weak2x: 'Debilidad (2x)',
    resistHalf: 'Resistencia (0.5x)',
    resistQuarter: 'Resistencia (0.25x)',
    immune: 'Inmune (0x)',
    height: 'Altura',
    weight: 'Peso',
    baseExp: 'Exp. Base',
    hidden: 'Oculta',
    addToTeam: 'Añadir al Equipo',
    removeFromTeam: 'Quitar del Equipo',
    teamFull: '¡Tu equipo está lleno! (Máximo 6)',
    genderRatio: 'Ratio de Género',
    catchRate: 'Tasa de Captura',
    male: 'Macho',
    female: 'Hembra',
    genderless: 'Sin género',
    wildLocations: 'Encuentros Salvajes',
    noLocations: 'Solo mediante evolución, intercambio o evento especial',
  }
};

const formatLocationName = (name) => {
  if (!name) return '';
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Detail() {
  const { id } = useParams();
  const { pokemon, species, loading, error } = usePokemonDetail(id);
  const { chain } = useEvolutionChain(id);
  const { language } = useLanguage();
  const { addToTeam, removeFromTeam, isInTeam } = useTeam();
  const headingRef = useRef(null);
  const location = useLocation();
  const navigateTo = usePageTransition();
  const [encounters, setEncounters] = useState([]);
  const [encountersLoading, setEncountersLoading] = useState(true);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const inTeam = pokemon ? isInTeam(pokemon.id) : false;

  /**
   * Move keyboard focus to the Pokémon name heading whenever the route changes.
   */
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: false });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEncountersLoading(true);
    fetchPokemonEncounters(id)
      .then((data) => {
        setEncounters(data || []);
      })
      .catch((err) => {
        console.error('Error fetching encounters:', err);
        setEncounters([]);
      })
      .finally(() => {
        setEncountersLoading(false);
      });
  }, [id]);

  const prevId = pokemon && pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon && pokemon.id < 1025 ? pokemon.id + 1 : null;

  const { handlers: swipeHandlers } = useSwipeNavigation({
    onSwipeLeft:  nextId ? () => navigateTo(`/pokemon/${nextId}`) : undefined,
    onSwipeRight: prevId ? () => navigateTo(`/pokemon/${prevId}`) : undefined,
  });

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

  const primaryType = pokemon.types[0].type.name;
  const typeColor = typeColors[primaryType]?.bg || '#777';

  // Calculate type effectiveness matchups
  const { weak4x, weak2x, resistHalf, resistQuarter, immune0x } = getTypeMatchups(
    pokemon.types.map((t) => t.type.name)
  );

  const hasEffectiveness =
    weak4x.length > 0 ||
    weak2x.length > 0 ||
    resistHalf.length > 0 ||
    resistQuarter.length > 0 ||
    immune0x.length > 0;

  return (
    <main
      className="detail-page"
      id="detail-page"
      {...swipeHandlers}
      aria-label={`${pokemon.name} detail. Swipe left or right to navigate.`}
    >
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
              {species?.localizedName || pokemon.name}
            </h1>
            {species?.genus && (
              <span className="detail-genus">{species.genus}</span>
            )}
            <div className="detail-actions-row">
              <CryButton pokemonId={pokemon.id} pokemonName={pokemon.name} />
              <button
                className={`detail-team-btn ${inTeam ? 'detail-team-btn--active' : ''}`}
                onClick={() => {
                  if (inTeam) {
                    removeFromTeam(pokemon.id);
                  } else {
                    const res = addToTeam(pokemon);
                    if (res && !res.success) {
                      if (res.error === 'full') {
                        alert(t.teamFull);
                      }
                    }
                  }
                }}
                type="button"
              >
                {inTeam ? t.removeFromTeam : t.addToTeam}
              </button>
            </div>
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
          <h2 className="section-title">{t.about}</h2>
          <p className="detail-description">{species?.description}</p>
          <div className="detail-physical">
            <div className="physical-item">
              <span className="physical-value">{formatMeasurement(pokemon.height, 'meter')}</span>
              <span className="physical-label">{t.height}</span>
            </div>
            <div className="physical-divider"></div>
            <div className="physical-item">
              <span className="physical-value">{formatMeasurement(pokemon.weight, 'kilogram')}</span>
              <span className="physical-label">{t.weight}</span>
            </div>
            <div className="physical-divider"></div>
            <div className="physical-item">
              <span className="physical-value">{formatNumber(pokemon.base_experience)}</span>
              <span className="physical-label">{t.baseExp}</span>
            </div>
          </div>

          {species && (
            <div className="detail-breeding-capture">
              <div className="breeding-capture-item">
                <span className="info-label">{t.genderRatio}</span>
                {species.gender_rate === -1 ? (
                  <span className="gender-genderless">{t.genderless}</span>
                ) : (
                  <div className="gender-ratio-container">
                    <div className="gender-bar">
                      <div 
                        className="gender-bar-male" 
                        style={{ width: `${100 - (species.gender_rate / 8) * 100}%` }}
                        title={`${t.male}: ${100 - (species.gender_rate / 8) * 100}%`}
                      >
                        <span>{100 - (species.gender_rate / 8) * 100}% ♂</span>
                      </div>
                      <div 
                        className="gender-bar-female" 
                        style={{ width: `${(species.gender_rate / 8) * 100}%` }}
                        title={`${t.female}: ${(species.gender_rate / 8) * 100}%`}
                      >
                        <span>{(species.gender_rate / 8) * 100}% ♀</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="breeding-capture-item">
                <span className="info-label">{t.catchRate}</span>
                <div className="catch-rate-display">
                  <span className="catch-rate-value">{species.capture_rate}</span>
                  <span className="catch-rate-percent">
                    ({((species.capture_rate / 765) * 100).toFixed(1)}%)
                  </span>
                  <div className="catch-rate-bar-container">
                    <div className="catch-rate-bar" style={{ width: `${(species.capture_rate / 255) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Abilities */}
        <section className="detail-section" id="abilities-section">
          <h2 className="section-title">{t.abilities}</h2>
          <div className="abilities-list">
            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} className={`ability-chip ${a.is_hidden ? 'hidden-ability' : ''}`}>
                {a.ability.name.replace('-', ' ')}
                {a.is_hidden && <span className="hidden-tag">{t.hidden}</span>}
              </span>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="detail-section" id="stats-section">
          <h2 className="section-title">{t.stats}</h2>
          <StatsChart stats={pokemon.stats} />
          <div className="stats-total">
            <span className="total-label">{t.total}</span>
            <span className="total-value">
              {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
            </span>
          </div>
        </section>

        {/* Type Effectiveness */}
        {hasEffectiveness && (
          <section className="detail-section" id="effectiveness-section">
            <h2 className="section-title">{t.effectiveness}</h2>
            <div className="effectiveness-groups">
              {weak4x.length > 0 && (
                <div className="eff-group">
                  <span className="eff-label eff-label--weak4x">{t.weak4x}</span>
                  <div className="eff-badges">
                    {weak4x.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}
              {weak2x.length > 0 && (
                <div className="eff-group">
                  <span className="eff-label eff-label--weak2x">{t.weak2x}</span>
                  <div className="eff-badges">
                    {weak2x.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}
              {resistHalf.length > 0 && (
                <div className="eff-group">
                  <span className="eff-label eff-label--resistHalf">{t.resistHalf}</span>
                  <div className="eff-badges">
                    {resistHalf.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}
              {resistQuarter.length > 0 && (
                <div className="eff-group">
                  <span className="eff-label eff-label--resistQuarter">{t.resistQuarter}</span>
                  <div className="eff-badges">
                    {resistQuarter.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}
              {immune0x.length > 0 && (
                <div className="eff-group">
                  <span className="eff-label eff-label--immune">{t.immune}</span>
                  <div className="eff-badges">
                    {immune0x.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Moves List */}
        <section className="detail-section" id="moves-section">
          <MovesList moves={pokemon.moves} />
        </section>

        {/* Wild Encounters */}
        <section className="detail-section" id="encounters-section">
          <h2 className="section-title">{t.wildLocations}</h2>
          {encountersLoading ? (
            <div className="encounters-loading-spinner" aria-label="Loading encounters"></div>
          ) : encounters.length > 0 ? (
            <ul className="encounters-list">
              {encounters.slice(0, 5).map((enc) => (
                <li key={enc.location_area.name} className="encounter-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" className="encounter-icon" aria-hidden="true">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{formatLocationName(enc.location_area.name)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-encounters">{t.noLocations}</p>
          )}
        </section>

        {/* Evolution Chain */}
        <section className="detail-section" id="evolution-section">
          <h2 className="section-title">{t.evolution}</h2>
          <EvolutionChain chain={chain} currentId={pokemon.id} />
        </section>
      </div>
    </main>
  );
}
