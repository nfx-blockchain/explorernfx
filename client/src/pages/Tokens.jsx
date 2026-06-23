import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetwork } from '../contexts/NetworkContext';
import { tokenApi } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import { shortenHash, formatNumber } from '../utils/demoData';
import Pagination from '../components/Pagination';
import './Tokens.css';

const PAGE_SIZE = 5;

export default function Tokens() {
  usePageTitle('Tokens');
  const { currentNetwork } = useNetwork();
  const [page, setPage] = useState(1);
  const { data: tokens, loading, error } = useApi(() => tokenApi.getList?.(currentNetwork) || Promise.resolve([]), [currentNetwork]);
  const totalPages = Math.ceil((tokens || []).length / PAGE_SIZE);
  const paginated = (tokens || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="tokens-page page-enter">
      <div className="page-header">
        <div>
          <h1>Tokens</h1>
          <p className="page-header-sub">{tokens.length} token contracts</p>
        </div>
      </div>

      <div className="tokens-table">
        <div className="tokens-table-header">
          <span>Token</span>
          <span>Symbol</span>
          <span>Price</span>
          <span>Total Supply</span>
          <span>Decimals</span>
        </div>
        <div className="tokens-table-body">
          {paginated.map((token) => (
            <div key={token.contract} className="token-row">
              <div className="token-row-name">
                <div className="token-icon">{token.symbol?.[0] || '?'}</div>
                <div className="token-info">
                  <span className="token-name">{token.info?.name || token.contract}</span>
                  <span className="token-contract"><FontAwesomeIcon icon="file-contract" size="xs" /> {shortenHash(token.contract, 8)}</span>
                </div>
              </div>
              <span className="token-symbol">{token.symbol || ''}</span>
              <span className="token-price">${token.info?.price?.toFixed(2) || '0.00'}</span>
              <span className="token-supply">{token.info?.totalSupply || '0'}</span>
              <span className="token-decimals">{token.info?.decimals || 0}</span>
            </div>
          ))}
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}