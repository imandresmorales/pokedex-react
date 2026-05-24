import { useState } from 'react';
import './StatsChart.css';

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

export default function StatsChart({ stats }) {
  const [viewMode, setViewMode] = useState('bars'); // 'bars' | 'radar'
  const maxStat = 255; // theoretical max for base stats

  const cx = 120;
  const cy = 120;
  const r = 75;

  // Concentric rings for reference grid (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index, valueFactor) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 3;
    const x = cx + r * valueFactor * Math.cos(angle);
    const y = cy + r * valueFactor * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate points string for the stats polygon
  const statsPoints = stats
    .map((stat, i) => {
      const factor = Math.min(stat.base_stat / maxStat, 1);
      const { x, y } = getCoordinates(i, factor);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="stats-chart-container">
      <div className="chart-mode-toggle" role="group" aria-label="Chart view mode">
        <button
          className={`toggle-btn ${viewMode === 'bars' ? 'active' : ''}`}
          onClick={() => setViewMode('bars')}
          type="button"
          aria-pressed={viewMode === 'bars'}
        >
          📊 Bars
        </button>
        <button
          className={`toggle-btn ${viewMode === 'radar' ? 'active' : ''}`}
          onClick={() => setViewMode('radar')}
          type="button"
          aria-pressed={viewMode === 'radar'}
        >
          🕸️ Radar
        </button>
      </div>

      {viewMode === 'bars' ? (
        <div className="stats-chart" id="stats-chart">
          {stats.map((stat) => {
            const percentage = (stat.base_stat / maxStat) * 100;
            const label = STAT_LABELS[stat.stat.name] || stat.stat.name;
            const color = STAT_COLORS[stat.stat.name] || '#777';

            return (
              <div className="stat-row" key={stat.stat.name}>
                <span className="stat-label">{label}</span>
                <div className="stat-bar-bg">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  >
                    <span className="stat-value">{stat.base_stat}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="stats-radar-wrapper">
          <svg viewBox="0 0 240 240" className="stats-radar-svg" aria-label="Radar chart showing Pokémon base stats">
            {/* Concentric grid lines */}
            {gridLevels.map((level, idx) => {
              const points = Array.from({ length: 6 })
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, level);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={idx}
                  points={points}
                  className="radar-grid-line"
                />
              );
            })}

            {/* Axis lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const { x, y } = getCoordinates(i, 1.0);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  className="radar-axis-line"
                />
              );
            })}

            {/* Stats Polygon */}
            <polygon points={statsPoints} className="radar-stats-poly" />

            {/* Labels and values */}
            {stats.map((stat, i) => {
              const label = STAT_LABELS[stat.stat.name] || stat.stat.name;
              const { angle } = getCoordinates(i, 1.0);
              
              // Place text slightly outside the outer ring
              const textX = cx + (r + 16) * Math.cos(angle);
              const textY = cy + (r + 10) * Math.sin(angle) + 4; // slight vertical offset

              let textAnchor = 'middle';
              if (Math.cos(angle) > 0.15) {
                textAnchor = 'start';
              } else if (Math.cos(angle) < -0.15) {
                textAnchor = 'end';
              }

              return (
                <text
                  key={stat.stat.name}
                  x={textX}
                  y={textY}
                  textAnchor={textAnchor}
                  className="radar-label"
                >
                  <tspan className="label-name">{label}</tspan>{' '}
                  <tspan className="label-val">({stat.base_stat})</tspan>
                </text>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
