import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found" id="not-found-page">
      <div className="not-found-inner">
        {/* Animated Pokéball */}
        <div className="nf-pokeball" aria-hidden="true">
          <div className="nf-pokeball-top"></div>
          <div className="nf-pokeball-divider">
            <div className="nf-pokeball-button"></div>
          </div>
          <div className="nf-pokeball-bottom"></div>
          <div className="nf-crack nf-crack--1"></div>
          <div className="nf-crack nf-crack--2"></div>
        </div>

        <div className="nf-code" aria-hidden="true">404</div>

        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-description">
          Looks like this Pokémon fled into the tall grass…<br />
          The page you're looking for doesn't exist.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn--primary" id="nf-home-btn">
            ← Back to Pokédex
          </Link>
          <button
            className="nf-btn nf-btn--secondary"
            onClick={() => navigate(-1)}
            id="nf-back-btn"
            type="button"
          >
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}
