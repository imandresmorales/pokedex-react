import { useState } from 'react';
import { fetchPokemon } from '../services/pokeapi';
import { Helmet } from 'react-helmet-async';
import './Compare.css';

export default function Compare() {
  const [query1, setQuery1] = useState('charizard');
  const [query2, setQuery2] = useState('blastoise');
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!query1 || !query2) return;

    setLoading(true);
    setError(null);
    try {
      const [p1, p2] = await Promise.all([
        fetchPokemon(query1.toLowerCase()),
        fetchPokemon(query2.toLowerCase()),
      ]);
      setPokemon1(p1);
      setPokemon2(p2);
    } catch (err) {
      setError('Could not find one or both Pokémon. Check the names or IDs.');
    } finally {
      setLoading(false);
    }
  };

  const statLabels = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];

  return (
    <>
      <Helmet>
        <title>Compare Pokémon — Pokédex React</title>
      </Helmet>
      <main className="compare-page" id="main-content">
        <h1 className="compare-title">Pokémon Comparator</h1>
        
        <form className="compare-form" onSubmit={handleCompare}>
          <div className="compare-inputs">
            <input 
              type="text" 
              value={query1} 
              onChange={(e) => setQuery1(e.target.value)} 
              placeholder="Pokemon 1 (e.g. pikachu)"
              required
            />
            <span className="compare-vs">VS</span>
            <input 
              type="text" 
              value={query2} 
              onChange={(e) => setQuery2(e.target.value)} 
              placeholder="Pokemon 2 (e.g. mewtwo)"
              required
            />
          </div>
          <button type="submit" className="compare-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Compare Stats!'}
          </button>
        </form>

        {error && <div className="compare-error">{error}</div>}

        {pokemon1 && pokemon2 && (
          <div className="compare-results animate-in">
            <div className="compare-headers">
              <div className="compare-header">
                <img src={pokemon1.sprites.other['official-artwork'].front_default} alt={pokemon1.name} />
                <h2>{pokemon1.name}</h2>
              </div>
              <div className="compare-header">
                <img src={pokemon2.sprites.other['official-artwork'].front_default} alt={pokemon2.name} />
                <h2>{pokemon2.name}</h2>
              </div>
            </div>

            <div className="compare-stats">
              {pokemon1.stats.map((stat, i) => {
                const val1 = stat.base_stat;
                const val2 = pokemon2.stats[i].base_stat;
                // Use a max of 255 for the width calculation
                const maxVal = Math.max(val1, val2, 100);
                const width1 = (val1 / maxVal) * 100;
                const width2 = (val2 / maxVal) * 100;

                return (
                  <div key={stat.stat.name} className="compare-stat-row">
                    <div className="stat-bar-container reverse">
                      <span className="stat-val">{val1}</span>
                      <div className="stat-bar bg-p1" style={{ width: `${width1}%` }}></div>
                    </div>
                    <div className="stat-label">{statLabels[i]}</div>
                    <div className="stat-bar-container">
                      <div className="stat-bar bg-p2" style={{ width: `${width2}%` }}></div>
                      <span className="stat-val">{val2}</span>
                    </div>
                  </div>
                );
              })}
              
              {/* Total Stats Row */}
              <div className="compare-stat-row total-row">
                <div className="stat-bar-container reverse">
                  <span className="stat-val total-val">
                    {pokemon1.stats.reduce((acc, s) => acc + s.base_stat, 0)}
                  </span>
                </div>
                <div className="stat-label">Total</div>
                <div className="stat-bar-container">
                  <span className="stat-val total-val">
                    {pokemon2.stats.reduce((acc, s) => acc + s.base_stat, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
