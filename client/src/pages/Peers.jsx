import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { peersApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import Pagination from '../components/Pagination';
import { formatNumber, formatDate } from '../utils/demoData';
import './Peers.css';

const PAGE_SIZE = 6;

export default function Peers() {
  usePageTitle('Peers');
  const { currentNetwork } = useNetwork();
  const [page, setPage] = useState(1);
  const { data: peers, loading, error } = useApi(() => peersApi.get(currentNetwork), [currentNetwork]);
  const totalPages = Math.ceil((peers || []).length / PAGE_SIZE);
  const paginated = (peers || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="peers-page page-enter">
      <div className="page-header">
        <div>
          <h1>Peers ({peers.length})</h1>
          <p className="page-header-sub">Network peer connections</p>
        </div>
      </div>

      <div className="peers-table">
        <div className="peers-table-header">
          <span><FontAwesomeIcon icon="network-wired" size="xs" /> Address</span>
          <span>IP</span>
          <span>Port</span>
          <span>Height</span>
          <span>Version</span>
          <span>Services</span>
          <span>Ping</span>
          <span>Connected</span>
          <span style={{ textAlign: 'right' }}>Last Recv</span>
        </div>
        <div className="peers-table-body">
          {paginated.map((peer) => (
            <div key={peer.address} className="peer-row">
              <span className="peer-row-addr"><FontAwesomeIcon icon="plug" size="xs" /> {peer.address}</span>
              <span className="peer-row-ip">{peer.ip}</span>
              <span className="peer-row-port">{peer.port}</span>
              <span className="peer-row-height">{typeof peer.height === 'number' ? formatNumber(peer.height) : peer.height}</span>
              <span className="peer-row-version">{peer.subver}</span>
              <span className="peer-row-services">{peer.services}</span>
              <span className="peer-row-ping" style={{ color: peer.pingtime < 50 ? 'var(--success)' : peer.pingtime < 100 ? 'var(--warning)' : 'var(--danger)' }}>
                {peer.pingtime?.toFixed(1) || 'N/A'}ms
              </span>
              <span className="peer-row-time">{formatDate(peer.conntime)}</span>
              <span className="peer-row-time">{formatDate(peer.lastrecv)}</span>
            </div>
          ))}
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}