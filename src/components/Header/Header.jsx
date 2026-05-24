import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useContrast } from '../../context/ContrastContext';
import { useFontSize } from '../../context/FontSizeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTeam } from '../../context/TeamContext';
import { useMotion } from '../../context/MotionContext';
import './Header.css';

export default function Header() {
  const { isHighContrast, toggleContrast } = useContrast();
  const { canIncrease, canDecrease, increase, decrease, reset, sizeIndex } = useFontSize();
  const { language, toggleLanguage } = useLanguage();
  const { team } = useTeam();
  const { isReduced, toggleMotion } = useMotion();

  return (
    <header className="app-header" id="app-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <div className="logo-pokeball" aria-hidden="true">
            <div className="pokeball-top"></div>
            <div className="pokeball-divider">
              <div className="pokeball-button"></div>
            </div>
            <div className="pokeball-bottom"></div>
          </div>
          <div className="logo-text">
            <span className="logo-title">Pokédex</span>
            <span className="logo-subtitle">Gen I — Kanto Region</span>
          </div>
        </Link>

        {/* Quiz link — subtle nav item between logo and controls */}
        <Link to="/quiz" className="header-quiz-link" id="quiz-nav-link" aria-label="Who's that Pokémon? Quiz">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Quiz</span>
        </Link>

        <div className="header-controls">
          <Link to="/team" className="header-nav-link" title={language === 'en' ? 'Build your team' : 'Arma tu equipo'} id="team-nav-link">
            🛡️ {language === 'en' ? 'Team' : 'Equipo'}{team.length > 0 ? ` (${team.length})` : ''}
          </Link>
          <Link to="/compare" className="header-nav-link" title="Compare Pokémon Stats">
            📊 {language === 'en' ? 'Compare' : 'Comparar'}
          </Link>
          <Link to="/quiz" className="header-nav-link" title="Play Who's That Pokémon?">
            🎮 {language === 'en' ? 'Quiz' : 'Juego'}
          </Link>
          {/* Font size controls */}
          <div className="font-size-controls" role="group" aria-label="Text size controls">
            <button
              className="font-btn"
              onClick={decrease}
              disabled={!canDecrease}
              aria-label="Decrease text size"
              title="Decrease text size"
              type="button"
              id="font-decrease-btn"
            >
              A<sup>−</sup>
            </button>
            <button
              className="font-btn font-btn--reset"
              onClick={reset}
              aria-label="Reset text size to default"
              title="Reset text size"
              type="button"
              id="font-reset-btn"
              disabled={sizeIndex === 1}
            >
              A
            </button>
            <button
              className="font-btn"
              onClick={increase}
              disabled={!canIncrease}
              aria-label="Increase text size"
              title="Increase text size"
              type="button"
              id="font-increase-btn"
            >
              A<sup>+</sup>
            </button>
          </div>

          {/* Motion toggle */}
          <button
            className={`motion-btn ${isReduced ? 'motion-btn--active' : ''}`}
            onClick={toggleMotion}
            aria-pressed={isReduced}
            aria-label={isReduced ? 'Enable normal motion animations' : 'Reduce motion and animations'}
            title={isReduced ? (language === 'en' ? 'Motion: Reduced' : 'Animaciones: Reducidas') : (language === 'en' ? 'Motion: Normal' : 'Animaciones: Normales')}
            type="button"
            id="motion-toggle"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="16" height="16">
              <path d="M5 12h14" />
              <path d="M12 18h7" />
              <path d="M8 6h11" />
            </svg>
          </button>

          {/* High contrast toggle */}
          <button
            className={`contrast-btn ${isHighContrast ? 'contrast-btn--active' : ''}`}
            onClick={toggleContrast}
            aria-pressed={isHighContrast}
            aria-label={isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            title={isHighContrast ? 'High contrast: ON' : 'High contrast: OFF'}
            type="button"
            id="contrast-toggle"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" />
            </svg>
          </button>

          {/* Language toggle */}
          <button
            className="lang-btn"
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
            title={`Language: ${language === 'en' ? 'English' : 'Español'}`}
            type="button"
            id="lang-toggle"
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
