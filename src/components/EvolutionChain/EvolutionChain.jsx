import { usePageTransition } from '../../hooks/usePageTransition';
import { getOfficialArtwork } from '../../services/pokeapi';
import './EvolutionChain.css';

/**
 * Renders a horizontal evolution chain.
 *
 * @param {{ chain: Array, currentId: number }} props
 */
export default function EvolutionChain({ chain, currentId }) {
  const navigate = usePageTransition();

  if (!chain || chain.length <= 1) {
    return (
      <p className="evo-no-chain">This Pokémon does not evolve.</p>
    );
  }

  return (
    <div className="evo-chain" role="list" aria-label="Evolution chain">
      {chain.map((stage, i) => (
        <div key={stage.id} className="evo-chain-item" role="listitem">
          {/* Arrow + label between stages */}
          {i > 0 && (
            <div className="evo-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              {chain[i].minLevel && (
                <span className="evo-level">Lv. {chain[i].minLevel}</span>
              )}
              {chain[i].trigger && chain[i].trigger !== 'level-up' && (
                <span className="evo-trigger">{chain[i].trigger.replace(/-/g, ' ')}</span>
              )}
            </div>
          )}

          {/* Pokémon stage */}
          <button
            className={`evo-stage ${stage.id === currentId ? 'evo-stage--current' : ''}`}
            onClick={() => stage.id !== currentId && navigate(`/pokemon/${stage.id}`)}
            disabled={stage.id === currentId}
            aria-label={`${stage.name}${stage.id === currentId ? ' (current)' : ''}`}
            aria-current={stage.id === currentId ? 'true' : undefined}
            type="button"
          >
            <img
              src={getOfficialArtwork(stage.id)}
              alt={stage.name}
              className="evo-stage-img"
              loading="lazy"
              width="80"
              height="80"
            />
            <span className="evo-stage-name">{stage.name}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
