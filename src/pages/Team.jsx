import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useLanguage } from '../context/LanguageContext';
import { usePageTransition } from '../hooks/usePageTransition';
import { getTypeMatchups } from '../utils/typeMatchups';
import TypeBadge from '../components/TypeBadge/TypeBadge';
import './Team.css';

const TRANSLATIONS = {
  en: {
    title: 'Your Pokémon Team',
    subtitle: 'Build and analyze your perfect 6-Pokémon team.',
    emptyTitle: 'Your team is empty!',
    emptyDesc: 'Go to the Pokédex, click on any Pokémon, and select "Add to Team" to build your roster.',
    backBtn: '← Back to Pokédex',
    slotsTitle: 'Active Roster',
    emptySlot: 'Empty Slot',
    analysisTitle: 'Team Analysis',
    statsAvg: 'Average Base Stats',
    typeCoverage: 'Defensive Coverage',
    weakTypes: 'Team Vulnerabilities',
    weakTypesDesc: 'Types that deal 2x or 4x damage to more team members than they resist.',
    resistTypes: 'Team Resistances',
    resistTypesDesc: 'Types that your team members resist (0.5x, 0.25x, or immune) more than they are weak to.',
    neutralCoverage: 'Your team has balanced defenses.',
    removeBtn: 'Remove',
    totalStats: 'Base Stat Total (Avg)',
  },
  es: {
    title: 'Tu Equipo Pokémon',
    subtitle: 'Arma y analiza tu equipo perfecto de 6 Pokémon.',
    emptyTitle: '¡Tu equipo está vacío!',
    emptyDesc: 'Ve a la Pokédex, haz clic en cualquier Pokémon y selecciona "Añadir al Equipo" para comenzar.',
    backBtn: '← Volver a la Pokédex',
    slotsTitle: 'Equipo Activo',
    emptySlot: 'Espacio Vacío',
    analysisTitle: 'Análisis del Equipo',
    statsAvg: 'Estadísticas Base Promedio',
    typeCoverage: 'Cobertura Defensiva',
    weakTypes: 'Vulnerabilidades del Equipo',
    weakTypesDesc: 'Tipos de ataque que hacen daño súper efectivo (2x/4x) a más miembros de los que resisten.',
    resistTypes: 'Resistencias del Equipo',
    resistTypesDesc: 'Tipos de ataque que tus miembros resisten (0.5x/0.25x/inmune) más de lo que son débiles.',
    neutralCoverage: 'Tu equipo tiene una defensa equilibrada.',
    removeBtn: 'Quitar',
    totalStats: 'Total de Stats Base (Prom.)',
  }
};

const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPD',
};

const STAT_COLORS = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2',
};

export default function Team() {
  const { team, removeFromTeam, maxTeamSize } = useTeam();
  const { language } = useLanguage();
  const navigateTo = usePageTransition();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Calculate Average Stats
  const hasTeam = team.length > 0;
  const avgStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 0,
    speed: 0,
  };

  if (hasTeam) {
    team.forEach((p) => {
      p.stats.forEach((s) => {
        const statName = s.stat.name;
        if (avgStats[statName] !== undefined) {
          avgStats[statName] += s.base_stat;
        }
      });
    });
    // Divide by team length
    Object.keys(avgStats).forEach((key) => {
      avgStats[key] = Math.round(avgStats[key] / team.length);
    });
  }

  // Calculate Type Coverage Analysis
  const typeAnalysis = {
    weak: {},
    resist: {},
  };

  if (hasTeam) {
    team.forEach((p) => {
      const matchups = getTypeMatchups(p.types);
      
      // All 2x and 4x counts as weakness
      [...matchups.weak2x, ...matchups.weak4x].forEach((type) => {
        typeAnalysis.weak[type] = (typeAnalysis.weak[type] || 0) + 1;
      });

      // All 0.5x, 0.25x and 0x counts as resistance
      [...matchups.resistHalf, ...matchups.resistQuarter, ...matchups.immune0x].forEach((type) => {
        typeAnalysis.resist[type] = (typeAnalysis.resist[type] || 0) + 1;
      });
    });
  }

  // Determine net vulnerabilities & resistances
  const netWeaknesses = [];
  const netResistances = [];

  if (hasTeam) {
    // 18 types
    const allTypes = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    allTypes.forEach((type) => {
      const weakCount = typeAnalysis.weak[type] || 0;
      const resistCount = typeAnalysis.resist[type] || 0;

      if (weakCount > resistCount) {
        netWeaknesses.push({ type, net: weakCount - resistCount, weakCount, resistCount });
      } else if (resistCount > weakCount) {
        netResistances.push({ type, net: resistCount - weakCount, weakCount, resistCount });
      }
    });

    // Sort by net strength
    netWeaknesses.sort((a, b) => b.net - a.net);
    netResistances.sort((a, b) => b.net - a.net);
  }

  const statTotalAvg = Object.values(avgStats).reduce((sum, val) => sum + val, 0);

  return (
    <main className="team-page" id="team-page">
      <div className="team-header-section">
        <h1 className="team-title">{t.title}</h1>
        <p className="team-subtitle">{t.subtitle}</p>
        <Link to="/" className="team-back-link">
          {t.backBtn}
        </Link>
      </div>

      {!hasTeam ? (
        <div className="team-empty-state" role="alert">
          <div className="pokeball-placeholder" aria-hidden="true">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="50" cy="50" r="45" opacity="0.3" />
              <line x1="5" y1="50" x2="95" y2="50" opacity="0.3" />
              <circle cx="50" cy="50" r="12" opacity="0.3" />
            </svg>
          </div>
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyDesc}</p>
          <Link to="/" className="add-pokemon-btn">
            + {language === 'en' ? 'Add Pokémon' : 'Añadir Pokémon'}
          </Link>
        </div>
      ) : (
        <div className="team-layout">
          {/* Slots roster */}
          <section className="team-section" aria-label={t.slotsTitle}>
            <h2 className="team-section-title">{t.slotsTitle}</h2>
            <div className="team-grid">
              {Array.from({ length: maxTeamSize }).map((_, index) => {
                const member = team[index];
                if (member) {
                  return (
                    <div className="team-slot team-slot--filled" key={member.id}>
                      <button
                        className="remove-slot-btn"
                        onClick={() => removeFromTeam(member.id)}
                        aria-label={`Remove ${member.localizedName || member.name} from team`}
                        type="button"
                      >
                        ×
                      </button>
                      <div 
                        className="slot-card-content" 
                        onClick={() => navigateTo(`/pokemon/${member.id}`)}
                        role="button"
                        tabIndex="0"
                        onKeyDown={(e) => { if (e.key === 'Enter') navigateTo(`/pokemon/${member.id}`); }}
                      >
                        <span className="slot-number">#{String(member.id).padStart(3, '0')}</span>
                        <img src={member.sprite} alt={member.localizedName || member.name} className="slot-sprite" />
                        <h3 className="slot-name">{member.localizedName || member.name}</h3>
                        <div className="slot-types">
                          {member.types.map((type) => (
                            <TypeBadge key={type} type={type} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="team-slot team-slot--empty" key={`empty-${index}`}>
                      <div className="empty-slot-content">
                        <span className="empty-plus">+</span>
                        <span className="empty-label">{t.emptySlot}</span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </section>

          {/* Analysis Dashboard */}
          <section className="team-section team-analysis-section" aria-label={t.analysisTitle}>
            <h2 className="team-section-title">{t.analysisTitle}</h2>
            <div className="analysis-dashboard">
              
              {/* Avg Stats */}
              <div className="analysis-card">
                <h3>{t.statsAvg}</h3>
                <div className="analysis-stats-chart">
                  {Object.entries(avgStats).map(([key, val]) => {
                    const label = STAT_LABELS[key] || key;
                    const color = STAT_COLORS[key] || '#777';
                    const percentage = (val / 255) * 100;

                    return (
                      <div className="stat-row" key={key}>
                        <span className="stat-label">{label}</span>
                        <div className="stat-bar-bg">
                          <div
                            className="stat-bar-fill"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          >
                            <span className="stat-value">{val}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="analysis-stats-total">
                    <span>{t.totalStats}:</span>
                    <strong>{statTotalAvg}</strong>
                  </div>
                </div>
              </div>

              {/* Type Defenses */}
              <div className="analysis-card">
                <h3>{t.typeCoverage}</h3>
                
                {/* Vulnerabilities */}
                <div className="coverage-section">
                  <span className="coverage-section-title weak-title">⚠️ {t.weakTypes}</span>
                  <p className="coverage-desc">{t.weakTypesDesc}</p>
                  <div className="coverage-badges-grid">
                    {netWeaknesses.length === 0 ? (
                      <p className="coverage-neutral">{t.neutralCoverage}</p>
                    ) : (
                      netWeaknesses.map(({ type, weakCount, resistCount }) => (
                        <div className="coverage-badge-item" key={type}>
                          <TypeBadge type={type} />
                          <span className="coverage-counts">
                            -{weakCount} / +{resistCount}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Resistances */}
                <div className="coverage-section">
                  <span className="coverage-section-title resist-title">🛡️ {t.resistTypes}</span>
                  <p className="coverage-desc">{t.resistTypesDesc}</p>
                  <div className="coverage-badges-grid">
                    {netResistances.length === 0 ? (
                      <p className="coverage-neutral">{t.neutralCoverage}</p>
                    ) : (
                      netResistances.map(({ type, weakCount, resistCount }) => (
                        <div className="coverage-badge-item" key={type}>
                          <TypeBadge type={type} />
                          <span className="coverage-counts">
                            +{resistCount} / -{weakCount}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </section>
        </div>
      )}
    </main>
  );
}
