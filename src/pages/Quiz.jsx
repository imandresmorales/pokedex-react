import { useState, useEffect, useCallback } from 'react';
import { fetchPokemon } from '../services/pokeapi';
import { Helmet } from 'react-helmet-async';
import './Quiz.css';

// We support up to Generation 9 (1025)
const MAX_POKEMON = 1025;

export default function Quiz() {
  const [options, setOptions] = useState([]);
  const [correctPokemon, setCorrectPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState(null); // The user's chosen option
  const [score, setScore] = useState(0);

  const startNewRound = useCallback(async () => {
    setLoading(true);
    setGuess(null);
    try {
      // Pick 4 random distinct IDs
      const ids = new Set();
      while (ids.size < 4) {
        ids.add(Math.floor(Math.random() * MAX_POKEMON) + 1);
      }
      
      const promises = Array.from(ids).map(id => fetchPokemon(id));
      const results = await Promise.all(promises);
      
      // Shuffle options
      const shuffled = results.sort(() => 0.5 - Math.random());
      const correct = shuffled[Math.floor(Math.random() * shuffled.length)];

      setOptions(shuffled);
      setCorrectPokemon(correct);
    } catch (err) {
      console.error('Failed to load quiz data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleGuess = (pokemon) => {
    if (guess) return; // Prevent multiple guesses
    setGuess(pokemon);
    if (pokemon.id === correctPokemon.id) {
      setScore(s => s + 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>Who's that Pokémon? — Pokédex React</title>
      </Helmet>
      <main className="quiz-page" id="main-content">
        <h1 className="quiz-title">Who's That Pokémon?</h1>
        <div className="quiz-score">Score: {score}</div>

        {loading || !correctPokemon ? (
          <div className="quiz-loading">Loading...</div>
        ) : (
          <div className="quiz-game">
            <div className="quiz-image-container">
              <img 
                src={correctPokemon.sprites.other['official-artwork'].front_default} 
                alt="Mystery Pokémon"
                className={`quiz-image ${guess ? 'revealed' : 'silhouette'}`}
              />
            </div>
            
            <div className="quiz-options">
              {options.map((opt) => {
                let btnClass = 'quiz-option-btn';
                if (guess) {
                  if (opt.id === correctPokemon.id) btnClass += ' correct';
                  else if (opt.id === guess.id) btnClass += ' incorrect';
                }

                return (
                  <button 
                    key={opt.id} 
                    className={btnClass}
                    onClick={() => handleGuess(opt)}
                    disabled={!!guess}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>

            {guess && (
              <div className="quiz-result animate-in">
                <h2>
                  {guess.id === correctPokemon.id 
                    ? "It's super effective! 🎉" 
                    : `It's ${correctPokemon.name}! 😢`}
                </h2>
                <button className="quiz-next-btn" onClick={startNewRound}>
                  Next Round ➔
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
