import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nftApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import './NFTToken.css';

export default function NFTToken() {
  const { collection, tokenId } = useParams();
  usePageTitle(`${collection || ''} #${tokenId || ''}`);
  const { currentNetwork } = useNetwork();
  const { data, loading, error } = useApi(() => nftApi.getTokenOwner(currentNetwork, collection, tokenId), [collection, tokenId, currentNetwork]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="Token not found" />;

  return (
    <div className="detail-page page-enter">
      <div className="page-header">
        <Link to={`/nfts/${collection}`} className="back-link">
          <FontAwesomeIcon icon="chevron-left" />
          Collection
        </Link>
        <div className="page-header-info">
          <h1>Token #{tokenId}</h1>
          <span className="page-header-sub">{collection}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="circle-info" />
            Token Info
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item-label">Collection</span>
              <span className="detail-item-value mono">{collection}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Token ID</span>
              <span className="detail-item-value mono">#{tokenId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Owner</span>
              <span className="detail-item-value mono">
                <Link to={`/address/${data.owner}`} className="hash-link">{data.owner || 'N/A'}</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}