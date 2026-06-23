import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './States.css';

export function LoadingState({ text = 'Loading...' }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span className="loading-text">{text}</span>
    </div>
  );
}

export function ErrorState({ message = 'An error occurred.', onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <FontAwesomeIcon icon="circle-exclamation" />
      </div>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button className="error-state-retry" onClick={onRetry}>
          <FontAwesomeIcon icon="rotate" /> Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = 'box-open', text = 'No data available.' }) {
  return (
    <div className="empty-state">
      <FontAwesomeIcon icon={icon} className="empty-state-icon" />
      <p className="empty-state-text">{text}</p>
    </div>
  );
}

export function Skeleton({ width = '100%', height = 16, radius = 6, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="table-skeleton-row">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} width={`${60 + Math.random() * 30}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="card-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-skeleton">
          <Skeleton width={32} height={32} radius={10} />
          <Skeleton width="50%" height={10} />
          <Skeleton width="80%" height={24} />
          <Skeleton width="35%" height={10} />
        </div>
      ))}
    </div>
  );
}
