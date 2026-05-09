import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-number shimmer"></div>
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-name shimmer"></div>
      <div className="skeleton-types">
        <div className="skeleton-badge shimmer"></div>
        <div className="skeleton-badge shimmer"></div>
      </div>
    </div>
  );
}
