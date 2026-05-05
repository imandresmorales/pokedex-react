import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="app-header" id="app-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <div className="logo-pokeball">
            <div className="pokeball-top"></div>
            <div className="pokeball-divider">
              <div className="pokeball-button"></div>
            </div>
            <div className="pokeball-bottom"></div>
          </div>
          <div className="logo-text">
            <h1>Pokédex</h1>
            <span className="logo-subtitle">Gen I — Kanto Region</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
