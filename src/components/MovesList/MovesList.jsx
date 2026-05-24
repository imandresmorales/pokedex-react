import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchMoveDetails } from '../../services/pokeapi';
import TypeBadge from '../TypeBadge/TypeBadge';
import './MovesList.css';

const TRANSLATIONS = {
  en: {
    level: 'Lvl',
    power: 'Power',
    accuracy: 'Accuracy',
    category: 'Category',
    classPhysical: 'Physical',
    classSpecial: 'Special',
    classStatus: 'Status',
    loading: 'Loading details...',
    error: 'Failed to load details.',
    noMoves: 'No moves learned by level-up.',
    title: 'Level-Up Moves',
  },
  es: {
    level: 'Nv',
    power: 'Potencia',
    accuracy: 'Precisión',
    category: 'Categoría',
    classPhysical: 'Físico',
    classSpecial: 'Especial',
    classStatus: 'Estado',
    loading: 'Cargando detalles...',
    error: 'Error al cargar detalles.',
    noMoves: 'No aprende movimientos por nivel.',
    title: 'Movimientos por Nivel',
  }
};

const CLASS_TRANSLATIONS = {
  en: {
    physical: 'Physical',
    special: 'Special',
    status: 'Status',
  },
  es: {
    physical: 'Físico',
    special: 'Especial',
    status: 'Estado',
  }
};

export default function MovesList({ moves }) {
  const { language } = useLanguage();
  const [expandedMove, setExpandedMove] = useState(null);
  const [moveDetails, setMoveDetails] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const cT = CLASS_TRANSLATIONS[language] || CLASS_TRANSLATIONS.en;

  // Filter level-up moves
  const levelUpMoves = moves
    .map((m) => {
      const levelDetails = m.version_group_details.filter(
        (d) => d.move_learn_method.name === 'level-up'
      );
      if (levelDetails.length === 0) return null;
      // Get the latest generation's detail
      const detail = levelDetails[levelDetails.length - 1];
      return {
        name: m.move.name,
        url: m.move.url,
        level: detail.level_learned_at,
      };
    })
    .filter(Boolean);

  // Sort by level learned
  levelUpMoves.sort((a, b) => a.level - b.level);

  const handleToggleMove = async (moveName, url) => {
    if (expandedMove === moveName) {
      setExpandedMove(null);
      return;
    }

    setExpandedMove(moveName);

    // Fetch details dynamically if not already cached in state
    if (!moveDetails[moveName]) {
      setLoadingMap((prev) => ({ ...prev, [moveName]: true }));
      setErrorMap((prev) => ({ ...prev, [moveName]: false }));
      try {
        const data = await fetchMoveDetails(url);
        
        // Extract flavor text
        const getFlavorText = (entries) => {
          const entry = entries.find((e) => e.language.name === language);
          if (!entry && language !== 'en') {
            const enEntry = entries.find((e) => e.language.name === 'en');
            return enEntry?.flavor_text || '';
          }
          return entry?.flavor_text || '';
        };

        const details = {
          power: data.power ?? '—',
          accuracy: data.accuracy ?? '—',
          type: data.type.name,
          damageClass: data.damage_class?.name || 'physical',
          description: getFlavorText(data.flavor_text_entries).replace(/\f|\n/g, ' '),
        };

        setMoveDetails((prev) => ({ ...prev, [moveName]: details }));
      } catch {
        setErrorMap((prev) => ({ ...prev, [moveName]: true }));
      } finally {
        setLoadingMap((prev) => ({ ...prev, [moveName]: false }));
      }
    }
  };

  if (levelUpMoves.length === 0) {
    return (
      <div className="moves-list-empty">
        <p>{t.noMoves}</p>
      </div>
    );
  }

  return (
    <div className="moves-list-container">
      <h3 className="moves-section-title">{t.title}</h3>
      <div className="moves-list">
        {levelUpMoves.map((m) => {
          const isExpanded = expandedMove === m.name;
          const details = moveDetails[m.name];
          const isLoading = loadingMap[m.name];
          const hasError = errorMap[m.name];

          const cleanName = m.name.replace(/-/g, ' ');

          return (
            <div 
              key={m.name} 
              className={`move-item ${isExpanded ? 'move-item--expanded' : ''}`}
            >
              <button
                className="move-header-btn"
                onClick={() => handleToggleMove(m.name, m.url)}
                aria-expanded={isExpanded}
                type="button"
              >
                <span className="move-level">{t.level}. {m.level}</span>
                <span className="move-name">{cleanName}</span>
                <span className="move-chevron">{isExpanded ? '▲' : '▼'}</span>
              </button>

              {isExpanded && (
                <div className="move-details-panel">
                  {isLoading && (
                    <div className="move-loading-state">
                      <div className="move-spinner"></div>
                      <span>{t.loading}</span>
                    </div>
                  )}
                  {hasError && <p className="move-error">{t.error}</p>}
                  {!isLoading && details && (
                    <div className="move-details-content">
                      <div className="move-stats-row">
                        <div className="move-stat-item">
                          <span className="move-stat-label">{t.power}</span>
                          <span className="move-stat-value">{details.power}</span>
                        </div>
                        <div className="move-stat-item">
                          <span className="move-stat-label">{t.accuracy}</span>
                          <span className="move-stat-value">{details.accuracy}</span>
                        </div>
                        <div className="move-stat-item">
                          <span className="move-stat-label">{t.category}</span>
                          <span className="move-stat-value move-stat-value--capitalize">
                            {cT[details.damageClass] || details.damageClass}
                          </span>
                        </div>
                        <div className="move-stat-item">
                          <TypeBadge type={details.type} />
                        </div>
                      </div>
                      <p className="move-description">{details.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
