import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { typeColors } from '../utils/typeColors';
import { formatMeasurement, formatNumber } from '../utils/formatters';
import TypeBadge from '../components/TypeBadge/TypeBadge';
import { Helmet } from 'react-helmet-async';
import './Compare.css';

/** Ordered list of base stats with human-readable labels */
const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

/** Maximum possible base stat value (for bar scaling) */
const STAT_MAX = 255;

export default function Compare() {
  const { compareList, clearCompare } = useCompare();

  // If fewer than 2 Pokémon are selected, show an informational placeholder
  if (compareList.length < 2) {
    return (
      <>
        <Helmet>
          <title>Pokémon Comparator — Pokédex React</title>
          <meta name="description" content="Compare two Pokémon side-by-side to see their base stats, types, and physical attributes." />
        </Helmet>
        <main className="compare-page compare-page--empty" id="compare-page">
          <h1 className="compare-empty-title">Pokémon Comparator</h1>
          <p className="compare-empty-text">
            Select <strong>two Pokémon</strong> from the Pokédex using the ⚖️ button on each card.
          </p>
          <Link to="/" className="compare-back-btn" id="compare-back-btn">
            ← Go to Pokédex
          </Link>
        </main>
      </>
    );
  }

  const [pA, pB] = compareList;

  const primaryTypeA = pA.types[0];
  const primaryTypeB = pB.types[0];
  const colorA = typeColors[primaryTypeA]?.bg || '#6366f1';
  const colorB = typeColors[primaryTypeB]?.bg || '#ec4899';

  // Build a unified stats map for easier comparison
  const statsA = Object.fromEntries(pA.stats.map((s) => [s.stat.name, s.base_stat]));
  const statsB = Object.fromEntries(pB.stats.map((s) => [s.stat.name, s.base_stat]));

  const totalA = pA.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const totalB = pB.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <>
      <Helmet>
        <title>
          {`${pA.localizedName || pA.name} vs ${pB.localizedName || pB.name} — Pokédex React`}
        </title>
        <meta
          name="description"
          content={`Compare ${pA.localizedName || pA.name} and ${pB.localizedName || pB.name} base stats, types, height and weight.`}
        />
      </Helmet>

      <main className="compare-page" id="compare-page">
        {/* Header */}
        <div className="compare-header">
          <Link to="/" className="compare-back-btn" id="compare-back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Pokédex
          </Link>

          <h1 className="compare-title">
            <span style={{ color: colorA }}>{pA.localizedName || pA.name}</span>
            <span className="compare-vs">vs</span>
            <span style={{ color: colorB }}>{pB.localizedName || pB.name}</span>
          </h1>

          <button
            className="compare-reset-btn"
            onClick={clearCompare}
            type="button"
            id="compare-reset-btn"
            aria-label="Clear comparison and go back to selection"
          >
            Reset
          </button>
        </div>

        {/* Side-by-side hero cards */}
        <div className="compare-heroes">
          <PokemonHero pokemon={pA} color={colorA} side="left" />
          <div className="compare-heroes__divider" aria-hidden="true">⚡</div>
          <PokemonHero pokemon={pB} color={colorB} side="right" />
        </div>

        {/* Physical attributes */}
        <section className="compare-section" id="compare-physical">
          <h2 className="compare-section-title">Physical</h2>
          <div className="compare-attrs">
            <AttrRow
              label="Height"
              valA={formatMeasurement(pA.height * 10, 'centimeter')}
              valB={formatMeasurement(pB.height * 10, 'centimeter')}
              numA={pA.height}
              numB={pB.height}
              colorA={colorA}
              colorB={colorB}
            />
            <AttrRow
              label="Weight"
              valA={formatMeasurement(pA.weight * 100, 'gram')}
              valB={formatMeasurement(pB.weight * 100, 'gram')}
              numA={pA.weight}
              numB={pB.weight}
              colorA={colorA}
              colorB={colorB}
            />
            <AttrRow
              label="Base Exp"
              valA={formatNumber(pA.base_experience)}
              valB={formatNumber(pB.base_experience)}
              numA={pA.base_experience}
              numB={pB.base_experience}
              colorA={colorA}
              colorB={colorB}
            />
          </div>
        </section>

        {/* Base stats comparison */}
        <section className="compare-section" id="compare-stats">
          <h2 className="compare-section-title">Base Stats</h2>

          {/* Total */}
          <div className="compare-total">
            <span className="compare-total__val" style={{ color: totalA >= totalB ? colorA : 'var(--text-muted)' }}>
              {totalA}
            </span>
            <span className="compare-total__label">Total</span>
            <span className="compare-total__val" style={{ color: totalB > totalA ? colorB : 'var(--text-muted)' }}>
              {totalB}
            </span>
          </div>

          <div className="compare-stats-grid">
            {Object.entries(STAT_LABELS).map(([key, label]) => {
              const valA = statsA[key] ?? 0;
              const valB = statsB[key] ?? 0;
              return (
                <StatRow
                  key={key}
                  label={label}
                  valA={valA}
                  valB={valB}
                  colorA={colorA}
                  colorB={colorB}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function PokemonHero({ pokemon, color, side }) {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={`compare-hero compare-hero--${side}`}
      style={{ '--hero-color': color }}
      id={`compare-hero-${pokemon.id}`}
      aria-label={`View ${pokemon.localizedName || pokemon.name} details`}
    >
      <div className="compare-hero__bg" style={{ background: `radial-gradient(circle, ${color}30, transparent 70%)` }} />
      <span className="compare-hero__num">#{String(pokemon.id).padStart(3, '0')}</span>
      <img
        src={pokemon.sprite}
        alt={`${pokemon.localizedName || pokemon.name} official artwork`}
        className="compare-hero__img"
        loading="eager"
      />
      <h2 className="compare-hero__name" style={{ color }}>
        {pokemon.localizedName || pokemon.name}
      </h2>
      <div className="compare-hero__types">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </Link>
  );
}

function AttrRow({ label, valA, valB, numA, numB, colorA, colorB }) {
  const aWins = numA > numB;
  const bWins = numB > numA;
  return (
    <div className="attr-row">
      <span className={`attr-val ${aWins ? 'attr-val--winner' : ''}`} style={aWins ? { color: colorA } : {}}>
        {valA}
      </span>
      <span className="attr-label">{label}</span>
      <span className={`attr-val ${bWins ? 'attr-val--winner' : ''}`} style={bWins ? { color: colorB } : {}}>
        {valB}
      </span>
    </div>
  );
}

function StatRow({ label, valA, valB, colorA, colorB }) {
  const widthA = `${(valA / STAT_MAX) * 100}%`;
  const widthB = `${(valB / STAT_MAX) * 100}%`;
  const aWins = valA > valB;
  const bWins = valB > valA;

  return (
    <div className="stat-row">
      {/* Left bar (A) — grows right-to-left */}
      <div className="stat-row__side stat-row__side--a">
        <span className={`stat-row__val ${aWins ? 'stat-val--winner' : ''}`} style={aWins ? { color: colorA } : {}}>
          {valA}
        </span>
        <div className="stat-bar stat-bar--a">
          <div
            className="stat-bar__fill"
            style={{ width: widthA, background: colorA, opacity: aWins ? 1 : 0.5 }}
            role="meter"
            aria-valuenow={valA}
            aria-valuemin={0}
            aria-valuemax={STAT_MAX}
            aria-label={`${label} A`}
          />
        </div>
      </div>

      <span className="stat-row__label">{label}</span>

      {/* Right bar (B) — grows left-to-right */}
      <div className="stat-row__side stat-row__side--b">
        <div className="stat-bar stat-bar--b">
          <div
            className="stat-bar__fill"
            style={{ width: widthB, background: colorB, opacity: bWins ? 1 : 0.5 }}
            role="meter"
            aria-valuenow={valB}
            aria-valuemin={0}
            aria-valuemax={STAT_MAX}
            aria-label={`${label} B`}
          />
        </div>
        <span className={`stat-row__val ${bWins ? 'stat-val--winner' : ''}`} style={bWins ? { color: colorB } : {}}>
          {valB}
        </span>
      </div>
    </div>
  );
}
