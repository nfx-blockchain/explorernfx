import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nftApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import { shortenHash, formatNumber } from '../utils/demoData';
import './NFTCollection.css';

export default function NFTCollection() {
  const { id } = useParams();
  usePageTitle(id ? id : 'NFT Collection');
  const { currentNetwork } = useNetwork();
  const { data, loading, error } = useApi(() => nftApi.getCollection(currentNetwork, id), [id, currentNetwork]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="Collection not found" />;

  const { info, tokens } = data;

  return (
    <div className="detail-page page-enter">
      <div className="page-header">
        <Link to="/nfts" className="back-link">
          <FontAwesomeIcon icon="chevron-left" />
          Collections
        </Link>
        <div className="page-header-info">
          <h1>{info?.name || id}</h1>
          <span className="page-header-sub">{info?.symbol} &middot; {formatNumber(info?.tokenCount || 0)} items</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="circle-info" />
            Collection Info
          </div>
          <div className="detail-item">
            <span className="detail-item-label">ID</span>
            <span className="detail-item-value mono">{info?.id || id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-item-label">Name</span>
            <span className="detail-item-value">{info?.name || id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-item-label">Symbol</span>
            <span className="detail-item-value mono">{info?.symbol}</span>
          </div>
          <div className="detail-item">
            <span className="detail-item-label">Owner</span>
            <span className="detail-item-value mono hash-link">
              <Link to={`/address/${info?.owner}`}>{shortenHash(info?.owner, 8)}</Link>
            </span>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="image" />
            Tokens ({tokens?.length || 0})
          </div>
          <div className="nft-tokens-grid">
            {tokens?.map((token) => (
              <Link key={token.id} to={`/nfts/${id}/${token.id}`} className="nft-token-card">
                <div className="nft-token-placeholder">
                  <FontAwesomeIcon icon="image" size="2x" />
                </div>
                <div className="nft-token-info">
                  <span className="nft-token-id">#{token.id?.split('-')[1]}</span>
                  <span className="nft-token-owner"><FontAwesomeIcon icon="user" size="xs" /> {shortenHash(token.owner, 6)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}