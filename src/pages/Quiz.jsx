import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPokemon, fetchPokemonSpecies, getLocalizedName } from '../services/pokeapi';
import { useLanguage } from '../context/LanguageContext';
import { fireConfetti } from '../utils/confetti';
import './Quiz.css';

/** Total Pokémon available for quiz (all 9 gens) */
const TOTAL_POKEMON = 1025;
/** Number of answer options shown per question */
const OPTIONS_COUNT = 4;
/** localStorage key for best streak */
const BEST_STREAK_KEY = 'pokedex-quiz-best-streak';

/**
 * Get a deterministic random integer in [min, max)
 * Cryptographically safe is not needed here — Math.random is fine for a quiz game.
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/** Pick `count` unique random Pokémon IDs from [1, TOTAL_POKEMON] */
function pickRandomIds(count, exclude = []) {
  const excludeSet = new Set(exclude);
  const ids = new Set();
  while (ids.size < count) {
    const id = randInt(1, TOTAL_POKEMON + 1);
    if (!excludeSet.has(id)) ids.add(id);
  }
  return Array.from(ids);
}

/** Shuffle an array in-place using Fisher-Yates */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Quiz() {
  const { language } = useLanguage();

  // ── Quiz state ─────────────────────────────────────────
  const [phase, setPhase] = useState('loading'); // 'loading' | 'question' | 'revealed'
  const [correct, setCorrect] = useState(null);       // { id, name, localizedName, sprite }
  const [options, setOptions] = useState([]);          // [{ id, name, localizedName }]
  const [selected, setSelected] = useState(null);      // id chosen by user
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    try { return parseInt(localStorage.getItem(BEST_STREAK_KEY) || '0', 10); }
    catch { return 0; }
  });
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  // Ref to the answer region for focus management
  const answerRef = useRef(null);
  const nextBtnRef = useRef(null);

  // ── Load a new question ─────────────────────────────────
  const loadQuestionRef = useRef(null);

  const loadQuestion = useCallback(async () => {
    setPhase('loading');
    setSelected(null);

    try {
      // Pick 4 unique random Pokémon ids
      const ids = pickRandomIds(OPTIONS_COUNT);
      // First id is the answer
      const [correctId, ...distractorIds] = ids;

      // Fetch correct Pokémon data + species for localized name
      const [correctData, correctSpecies] = await Promise.all([
        fetchPokemon(correctId),
        fetchPokemonSpecies(correctId),
      ]);

      // Fetch distractor names only (no full detail needed)
      const distractors = await Promise.all(
        distractorIds.map(async (id) => {
          const speciesData = await fetchPokemonSpecies(id);
          return {
            id,
            name: speciesData.name,
            localizedName: getLocalizedName(speciesData, language),
          };
        })
      );

      const correctOption = {
        id: correctData.id,
        name: correctData.name,
        localizedName: getLocalizedName(correctSpecies, language),
      };

      const correctPokemon = {
        ...correctOption,
        sprite: correctData.sprites.other['official-artwork'].front_default,
      };

      const allOptions = shuffle([correctOption, ...distractors]);

      setCorrect(correctPokemon);
      setOptions(allOptions);
      setPhase('question');
    } catch {
      // Retry silently on error (network blip, rare id gap).
      // Use the ref to avoid a circular dependency in the useCallback dep array.
      if (loadQuestionRef.current) loadQuestionRef.current();
    }
  // language included so options re-fetch with correct language on toggle
  }, [language]);

  // Keep the ref pointing to the latest version of loadQuestion
  useEffect(() => {
    loadQuestionRef.current = loadQuestion;
  }, [loadQuestion]);

  // Load first question on mount and when language changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQuestion();
  }, [loadQuestion]);

  // Move focus to answer section when question is ready
  useEffect(() => {
    if (phase === 'question' && answerRef.current) {
      answerRef.current.focus({ preventScroll: true });
    }
  }, [phase]);

  // Move focus to Next button after reveal
  useEffect(() => {
    if (phase === 'revealed' && nextBtnRef.current) {
      nextBtnRef.current.focus({ preventScroll: true });
    }
  }, [phase]);

  // ── Answer selection ─────────────────────────────────────
  const handleAnswer = useCallback((id) => {
    if (phase !== 'question') return;
    setSelected(id);
    setPhase('revealed');
    setTotalAnswered((n) => n + 1);

    if (id === correct.id) {
      setTotalCorrect((n) => n + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((best) => {
          const newBest = Math.max(best, newStreak);
          try { localStorage.setItem(BEST_STREAK_KEY, String(newBest)); } catch { /* ignore */ }
          return newBest;
        });
        return newStreak;
      });
      fireConfetti();
    } else {
      setStreak(0);
    }
  }, [phase, correct]);

  // ── Keyboard shortcut: 1-4 to answer ───────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (phase !== 'question') return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= OPTIONS_COUNT && options[num - 1]) {
        handleAnswer(options[num - 1].id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, options, handleAnswer]);

  const accuracy = totalAnswered > 0
    ? Math.round((totalCorrect / totalAnswered) * 100)
    : 0;

  const isCorrect = phase === 'revealed' && selected === correct?.id;

  return (
    <>
      <Helmet>
        <title>Who's that Pokémon? — Pokédex React</title>
        <meta name="description" content="Guess the Pokémon from its silhouette! Test your knowledge with this fun quiz." />
      </Helmet>

      <main className="quiz-page" id="quiz-page">
        {/* ── Header ── */}
        <div className="quiz-header">
          <Link to="/" className="quiz-back-btn" id="quiz-back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Pokédex
          </Link>

          <h1 className="quiz-title">Who's that Pokémon?</h1>

          {/* Score row */}
          <div className="quiz-scores" aria-label="Quiz scores">
            <div className="quiz-score-pill" title="Current streak">
              🔥 <span>{streak}</span>
            </div>
            <div className="quiz-score-pill quiz-score-pill--best" title="Best streak">
              🏆 <span>{bestStreak}</span>
            </div>
            {totalAnswered > 0 && (
              <div className="quiz-score-pill quiz-score-pill--accuracy" title={`${totalCorrect}/${totalAnswered} correct`}>
                🎯 <span>{accuracy}%</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Silhouette ── */}
        <div className="quiz-stage" aria-live="polite">
          {phase === 'loading' ? (
            <div className="quiz-pokeball-spin" role="status" aria-label="Loading">
              <div className="qpb-top" />
              <div className="qpb-divider"><div className="qpb-btn" /></div>
              <div className="qpb-bottom" />
            </div>
          ) : (
            <div className={`quiz-silhouette-wrapper ${phase === 'revealed' ? 'quiz-silhouette-wrapper--revealed' : ''}`}>
              <img
                src={correct.sprite}
                alt={phase === 'revealed' ? (correct.localizedName || correct.name) : 'Mystery Pokémon silhouette'}
                className={`quiz-silhouette ${phase === 'revealed' ? 'quiz-silhouette--reveal' : ''}`}
                draggable="false"
              />
              {phase === 'revealed' && (
                <p className={`quiz-reveal-name ${isCorrect ? 'quiz-reveal-name--correct' : 'quiz-reveal-name--wrong'}`}>
                  {correct.localizedName || correct.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Answer options ── */}
        {phase !== 'loading' && (
          <div
            className="quiz-options"
            ref={answerRef}
            tabIndex="-1"
            role="group"
            aria-label="Answer options"
          >
            {options.map((opt, i) => {
              let state = 'idle';
              if (phase === 'revealed') {
                if (opt.id === correct.id) state = 'correct';
                else if (opt.id === selected) state = 'wrong';
                else state = 'faded';
              }

              return (
                <button
                  key={opt.id}
                  className={`quiz-option quiz-option--${state}`}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={phase === 'revealed'}
                  type="button"
                  id={`quiz-option-${opt.id}`}
                  aria-label={`Option ${i + 1}: ${opt.localizedName || opt.name}`}
                  aria-pressed={phase === 'revealed' ? opt.id === selected : undefined}
                >
                  <span className="quiz-option__key" aria-hidden="true">{i + 1}</span>
                  <span className="quiz-option__name">{opt.localizedName || opt.name}</span>
                  {phase === 'revealed' && opt.id === correct.id && (
                    <span className="quiz-option__tick" aria-hidden="true">✓</span>
                  )}
                  {phase === 'revealed' && opt.id === selected && opt.id !== correct.id && (
                    <span className="quiz-option__cross" aria-hidden="true">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Result feedback + Next button ── */}
        {phase === 'revealed' && (
          <div className="quiz-result" aria-live="assertive">
            <p className={`quiz-result__msg ${isCorrect ? 'quiz-result__msg--correct' : 'quiz-result__msg--wrong'}`}>
              {isCorrect
                ? streak > 1 ? `🔥 ${streak} in a row!` : '✅ Correct!'
                : `❌ It was ${correct.localizedName || correct.name}!`
              }
            </p>
            <button
              ref={nextBtnRef}
              className="quiz-next-btn"
              onClick={loadQuestion}
              type="button"
              id="quiz-next-btn"
            >
              Next Pokémon →
            </button>
          </div>
        )}
      </main>
    </>
  );
}
