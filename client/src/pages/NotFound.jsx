import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePageTitle } from '../hooks/usePageTitle';
import './NotFound.css';

export default function NotFound() {
  usePageTitle('Page Not Found');
  return (
    <div className="not-found-page page-enter">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="not-found-link">
          <FontAwesomeIcon icon="chevron-left" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
