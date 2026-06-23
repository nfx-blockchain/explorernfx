import { useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetwork } from '../contexts/NetworkContext';
import { blocksApi, transactionsApi } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import { shortenHash } from '../utils/demoData';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  usePageTitle(query ? `Search: ${query}` : 'Search');
  const { currentNetwork } = useNetwork();

  const isAddress = query.match(/^[a-zA-Z0-9]{20,}$/);

  const { data, loading, error } = useApi(
    async () => {
      const blocks = await blocksApi.getList(currentNetwork, 100).catch(() => []);
      const txs = [];
      for (const block of blocks.slice(0, 20)) {
        if (block.tx && block.tx.length > 0) {
          const tx = await transactionsApi.get(currentNetwork, block.tx[0]).catch(() => null);
          if (tx) txs.push(tx);
        }
      }
      return { blocks, txs, isAddress };
    },
    [query, currentNetwork]
  );

  if (!query) {
    return (
      <div className="search-results-page page-enter">
        <div className="page-header"><h1>Search</h1></div>
        <EmptyState icon="magnifying-glass" text="Enter a search term to find blocks, transactions, or addresses." />
      </div>
    );
  }

  if (loading) return <LoadingState text="Searching..." />;
  if (error) return <ErrorState message={error} />;

  const { blocks, txs } = data || {};
  const totalResults = (blocks?.length || 0) + (txs?.length || 0) + (isAddress ? 1 : 0);

  return (
    <div className="search-results-page page-enter">
      <div className="page-header">
        <div>
          <h1>Search Results</h1>
          <p className="page-header-sub">"{query}" — {totalResults} result{totalResults !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {totalResults === 0 && (
        <EmptyState icon="search-minus" text={`No results found for "${query}". Try a different search term.`} />
      )}

      {isAddress && (
        <div className="sr-section">
          <div className="sr-section-header">
            <FontAwesomeIcon icon="wallet" />
            Address
          </div>
          <Link to={`/address/${query}`} className="sr-result-row">
            <span className="sr-result-label">Address</span>
            <span className="sr-result-value mono">{query}</span>
            <FontAwesomeIcon icon="chevron-right" className="sr-result-arrow" />
          </Link>
        </div>
      )}

      {blocks != null && blocks.length > 0 && (
        <div className="sr-section">
          <div className="sr-section-header">
            <FontAwesomeIcon icon="cube" />
            Blocks ({blocks.length})
          </div>
          {blocks.map(b => (
            <Link key={b.hash} to={`/block/${b.hash}`} className="sr-result-row">
              <span className="sr-result-label">Block #{b.height}</span>
              <span className="sr-result-value mono">{shortenHash(b.hash, 8)}</span>
              <FontAwesomeIcon icon="chevron-right" className="sr-result-arrow" />
            </Link>
          ))}
        </div>
      )}

      {txs != null && txs.length > 0 && (
        <div className="sr-section">
          <div className="sr-section-header">
            <FontAwesomeIcon icon="right-left" />
            Transactions ({txs.length})
          </div>
          {txs.map(t => (
            <Link key={t.txid} to={`/tx/${t.txid}`} className="sr-result-row">
              <span className="sr-result-label">TX</span>
              <span className="sr-result-value mono">{shortenHash(t.txid, 10)}</span>
              <span className="sr-result-extra">{t.vout?.[0]?.value || 0} NFX</span>
              <FontAwesomeIcon icon="chevron-right" className="sr-result-arrow" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}