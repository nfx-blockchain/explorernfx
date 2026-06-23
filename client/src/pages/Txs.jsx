import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetwork } from '../contexts/NetworkContext';
import { transactionsApi } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import Pagination from '../components/Pagination';
import { formatDate, shortenHash } from '../utils/demoData';
import './Txs.css';

const PAGE_SIZE = 10;

export default function Txs() {
  usePageTitle('Transactions');
  const { currentNetwork } = useNetwork();
  const [page, setPage] = useState(1);
  const { data: txs, loading, error } = useApi(
    () => transactionsApi.getList?.(currentNetwork, 50) || Promise.resolve([]),
    [currentNetwork]
  );
  const totalPages = Math.ceil((txs || []).length / PAGE_SIZE);
  const paginated = (txs || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusClass = (status) => {
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'pending') return 'status-pending';
    return 'status-failed';
  };

  const handleRowKeyDown = (e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="txs-page page-enter">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p className="page-header-sub">{txs.length} transactions</p>
        </div>
      </div>

      {txs.length === 0 ? <EmptyState text="No transactions found" /> : (
      <div className="data-table">
        <div className="data-table-header">
          <span>TXID</span>
          <span>From</span>
          <span>To</span>
          <span>Value</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Time</span>
        </div>
        <div className="data-table-body">
          {paginated.map((tx) => (
            <div
              key={tx.txid}
              className="data-row"
              onClick={() => navigate(`/tx/${tx.txid}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleRowKeyDown(e, () => navigate(`/tx/${tx.txid}`))}
            >
              <span className="data-row-txid" title={tx.txid}>{shortenHash(tx.txid)}</span>
              <span className="data-row-addr" title={tx.from}>{shortenHash(tx.from)}</span>
              <span className="data-row-addr" title={tx.to}>{shortenHash(tx.to)}</span>
              <span className="data-row-value">{tx.value}</span>
              <span className={`data-row-status ${getStatusClass(tx.status)}`}>
                <span className="status-dot" />
                {tx.status}
              </span>
              <span className="data-row-time">{formatDate(tx.time)}</span>
            </div>
          ))}
        </div>
      </div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}