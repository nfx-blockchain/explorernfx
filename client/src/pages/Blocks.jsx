import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetwork } from '../contexts/NetworkContext';
import { blocksApi } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import Pagination from '../components/Pagination';
import { formatNumber, formatDate, shortenHash } from '../utils/demoData';
import './Blocks.css';

const PAGE_SIZE = 10;

export default function Blocks() {
  usePageTitle('Blocks');
  const { currentNetwork } = useNetwork();
  const [page, setPage] = useState(1);
  const { data: blocks, loading, error } = useApi(() => blocksApi.getList(currentNetwork, 50), [currentNetwork]);
  const totalPages = Math.ceil((blocks || []).length / PAGE_SIZE);
  const paginated = (blocks || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRowKeyDown = (e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="blocks-page page-enter">
      <div className="page-header">
        <div>
          <h1>Blocks</h1>
          <p className="page-header-sub">{formatNumber(blocks.length)} blocks</p>
        </div>
      </div>

      {blocks.length === 0 ? <EmptyState text="No blocks found" /> : (
      <div className="data-table">
        <div className="data-table-header">
          <span>Height</span>
          <span>Hash</span>
          <span>TXs</span>
          <span>Size</span>
          <span style={{ textAlign: 'right' }}>Time</span>
        </div>
        <div className="data-table-body">
          {paginated.map((block) => (
            <div
              key={block.hash}
              className="data-row"
              onClick={() => navigate(`/block/${block.hash}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleRowKeyDown(e, () => navigate(`/block/${block.hash}`))}
            >
              <span className="data-row-height">#{formatNumber(block.height)}</span>
              <span className="data-row-hash" title={block.hash}>
                {shortenHash(block.hash)}
              </span>
              <span className="data-row-tx">
                <span className="tx-count-badge">{block.txCount}</span>
              </span>
              <span className="data-row-size">{formatNumber(block.size)} B</span>
              <span className="data-row-time">{formatDate(block.time)}</span>
            </div>
          ))}
        </div>
      </div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}