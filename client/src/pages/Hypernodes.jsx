import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { hypernodesApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import Pagination from '../components/Pagination';
import { formatNumber, shortenHash } from '../utils/demoData';
import './Hypernodes.css';

const PAGE_SIZE = 5;

export default function Hypernodes() {
  usePageTitle('Hypernodes');
  const { currentNetwork } = useNetwork();
  const [page, setPage] = useState(1);
  const { data: hnData, loading, error } = useApi(() => hypernodesApi.list(currentNetwork), [currentNetwork]);
  const nodes = hnData || [];
  const stats = { total: nodes.length, active: nodes.filter(n => n.active).length, totalStake: nodes.reduce((s, n) => s + (n.stake || 0), 0) };
  const totalPages = Math.ceil(nodes.length / PAGE_SIZE);
  const paginated = nodes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="hypernodes-page page-enter">
      <div className="page-header">
        <div>
          <h1>Hypernodes</h1>
          <p className="page-header-sub">{stats.total} nodes securing the network</p>
        </div>
      </div>

      <div className="hn-stats-row">
        <div className="hn-stat">
          <div className="hn-stat-icon"><FontAwesomeIcon icon="server" /></div>
          <span className="hn-stat-value">{formatNumber(stats.total)}</span>
          <span className="hn-stat-label">Total Nodes</span>
        </div>
        <div className="hn-stat">
          <div className="hn-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
            <FontAwesomeIcon icon="check-circle" />
          </div>
          <span className="hn-stat-value">{stats.active}</span>
          <span className="hn-stat-label">Active</span>
        </div>
        <div className="hn-stat">
          <div className="hn-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <FontAwesomeIcon icon="coins" />
          </div>
          <span className="hn-stat-value">{formatNumber(stats.totalStake)} NFX</span>
          <span className="hn-stat-label">Total Staked</span>
        </div>
      </div>

      <div className="hn-table">
        <div className="hn-table-header">
          <span>Node</span>
          <span>Status</span>
          <span>Stake</span>
          <span>Version</span>
          <span>Location</span>
          <span style={{ textAlign: 'right' }}>Last Seen</span>
        </div>
        <div className="hn-table-body">
          {paginated.map((node) => (
            <div key={node.id || node.address} className="hn-row">
              <span className="hn-row-addr">{shortenHash(node.address, 8)}</span>
              <span className={`hn-row-status ${node.active ? 'active' : 'inactive'}`}>
                <span className="hn-status-dot" />
                {node.active ? 'Active' : 'Offline'}
              </span>
              <span className="hn-row-value">{formatNumber(node.stake)}</span>
              <span className="hn-row-text">{node.version || 'N/A'}</span>
              <span className="hn-row-text">{node.location || 'N/A'}</span>
              <span className="hn-row-time">{node.lastseen ? Math.floor(Date.now() / 1000 - node.lastseen) + 's ago' : 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}