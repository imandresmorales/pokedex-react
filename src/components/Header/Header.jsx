import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useContrast } from '../../context/ContrastContext';
import './Header.css';

export default function Header() {
  const { isHighContrast, toggleContrast } = useContrast();

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
            {/* Eye / contrast icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" />
            </svg>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
