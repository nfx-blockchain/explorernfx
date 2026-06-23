import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetwork } from '../contexts/NetworkContext';
import { islandsApi } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import Pagination from '../components/Pagination';
import { formatNumber, shortenHash } from '../utils/demoData';
import './Islands.css';

const PAGE_SIZE = 4;

export default function Islands() {
  usePageTitle('Islands');
  const { currentNetwork } = useNetwork();
  const [page, setPage] = useState(1);
  const { data: islandData, loading, error } = useApi(() => islandsApi.list(currentNetwork), [currentNetwork]);
  const islands = islandData?.islands || [];
  const stats = islandData?.stats || { total: 0, active: 0, totalStake: 0 };
  const totalPages = Math.ceil(islands.length / PAGE_SIZE);
  const paginated = islands.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="islands-page page-enter">
      <div className="page-header">
        <div>
          <h1>Islands</h1>
          <p className="page-header-sub">{stats.total} islands in the NFX metaverse</p>
        </div>
      </div>

      <div className="island-stats-row">
        <div className="island-stat">
          <div className="island-stat-icon"><FontAwesomeIcon icon="globe" /></div>
          <span className="island-stat-value">{formatNumber(stats.total)}</span>
          <span className="island-stat-label">Total Islands</span>
        </div>
        <div className="island-stat">
          <div className="island-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
            <FontAwesomeIcon icon="check" />
          </div>
          <span className="island-stat-value">{stats.active}</span>
          <span className="island-stat-label">Active</span>
        </div>
        <div className="island-stat">
          <div className="island-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <FontAwesomeIcon icon="coins" />
          </div>
          <span className="island-stat-value">{formatNumber(stats.totalStake)} NFX</span>
          <span className="island-stat-label">Total Staked</span>
        </div>
      </div>

      <div className="islands-grid">
        {paginated.map((island) => (
          <Link key={island.id} to={`/islands/${island.id}`} className="island-card" aria-label={`View ${island.id} island`}>
            <div className="island-card-header">
              <div className="island-card-icon"><FontAwesomeIcon icon="globe" /></div>
              <div className="island-card-title-group">
                <h3 className="island-card-title">{island.id}</h3>
                <span className="island-card-id">ID: {island.id}</span>
              </div>
              <span className={`island-status ${island.active ? 'active' : 'inactive'}`}>
                <span className="island-status-dot" />
                {island.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="island-card-body">
              <div className="island-card-stat">
                <span className="ics-label"><FontAwesomeIcon icon="user" size="xs" /> Owner</span>
                <span className="ics-value">{shortenHash(island.owner, 6)}</span>
              </div>
              <div className="island-card-stat">
                <span className="ics-label"><FontAwesomeIcon icon="coins" size="xs" /> Stake</span>
                <span className="ics-value">{formatNumber(island.stake)} NFX</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}