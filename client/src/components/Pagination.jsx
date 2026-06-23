import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Pagination.css';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <FontAwesomeIcon icon="chevron-left" />
      </button>
      {start > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onChange(1)} aria-label="Page 1">1</button>
          {start > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          className={`pagination-btn ${p === page ? 'active' : ''}`}
          onClick={() => onChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
          <button className="pagination-btn" onClick={() => onChange(totalPages)} aria-label={`Page ${totalPages}`}>{totalPages}</button>
        </>
      )}
      <button
        className="pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <FontAwesomeIcon icon="chevron-right" />
      </button>
    </div>
  );
}
