import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useContrast } from '../../context/ContrastContext';
import { useFontSize } from '../../context/FontSizeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

export default function Header() {
  const { isHighContrast, toggleContrast } = useContrast();
  const { canIncrease, canDecrease, increase, decrease, reset, sizeIndex } = useFontSize();
  const { language, toggleLanguage } = useLanguage();

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

        <div className="header-controls">
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
