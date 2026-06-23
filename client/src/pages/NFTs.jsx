import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nftApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import Pagination from '../components/Pagination';
import { shortenHash, formatNumber } from '../utils/demoData';
import './NFTs.css';

const PAGE_SIZE = 6;

export default function NFTs() {
  usePageTitle('NFTs');
  const { currentNetwork } = useNetwork();
  const [page, setPage] = useState(1);
  const { data: collections, loading, error } = useApi(() => nftApi.listCollections(currentNetwork), [currentNetwork]);
  const totalPages = Math.ceil((collections || []).length / PAGE_SIZE);
  const paginated = (collections || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (collections.length === 0) return <EmptyState text="No collections found" />;

  return (
    <div className="nfts-page page-enter">
      <div className="page-header">
        <div>
          <h1>NFT Collections</h1>
          <p className="page-header-sub">{collections.length} collections on {currentNetwork.toUpperCase()}</p>
        </div>
      </div>

      <div className="collections-grid">
        {paginated.map((collection) => (
          <Link key={collection.id} to={`/nfts/${collection.id}`} className="nft-collection-card" aria-label={`View ${collection.id} collection`}>
            <div className="nft-card-media">
              <div className="nft-card-placeholder">
                <FontAwesomeIcon icon="image" size="3x" />
              </div>
              <span className="nft-card-items">{formatNumber(collection.tokenCount || 0)} items</span>
            </div>
            <div className="nft-card-body">
              <h3 className="nft-card-title">{collection.id}</h3>
              <span className="nft-card-symbol">{collection.symbol || ''}</span>
              <div className="nft-card-info">
                <span className="nft-card-owner"><FontAwesomeIcon icon="user" size="xs" /> {shortenHash(collection.owner, 6)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}