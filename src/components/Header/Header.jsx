import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

export default function Header() {
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
        <ThemeToggle />
      </div>
    </header>
  );
}
