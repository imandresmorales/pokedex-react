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
  const maxStat = 255; // theoretical max for base stats

  return (
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
  );
}
