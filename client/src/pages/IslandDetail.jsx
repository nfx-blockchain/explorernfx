import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { islandsApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import { shortenHash, formatNumber } from '../utils/demoData';
import './IslandDetail.css';

export default function IslandDetail() {
  const { id } = useParams();
  usePageTitle('Island ' + (id || ''));
  const { currentNetwork } = useNetwork();
  const { data, loading, error } = useApi(() => islandsApi.get(currentNetwork, id), [id, currentNetwork]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="Island not found" />;

  const { info, health } = data;

  return (
    <div className="detail-page page-enter">
      <div className="page-header">
        <Link to="/islands" className="back-link">
          <FontAwesomeIcon icon="chevron-left" />
          Islands
        </Link>
        <div className="page-header-info">
          <h1>{info?.name || id}</h1>
          <span className="page-header-sub">ID: {id}</span>
        </div>
        <span className={`island-status-badge ${info?.active ? 'active' : 'inactive'}`}>
          <span className="island-status-dot" />
          {info?.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="island-detail-grid">
        <div className="detail-card">
          <div className="detail-section">
            <div className="detail-section-header">
              <FontAwesomeIcon icon="globe" />
              Island Info
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Width</span>
              <span className="detail-item-value mono">{info?.width || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Height</span>
              <span className="detail-item-value mono">{info?.height || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Score</span>
              <span className="detail-item-value mono">{info?.score || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Buildings</span>
              <span className="detail-item-value mono">{info?.total_buildings || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Rentals</span>
              <span className="detail-item-value mono">{info?.total_rentals || 0}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-section">
            <div className="detail-section-header">
              <FontAwesomeIcon icon="heart-pulse" />
              Health Analysis
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Health Score</span>
              <span className="detail-item-value mono">{health?.health_score || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Status</span>
              <span className="detail-item-value mono">{health?.status || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Recommendations</span>
              <span className="detail-item-value mono">{health?.recommendations || 'none'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}