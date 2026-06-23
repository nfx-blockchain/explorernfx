import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetwork } from '../contexts/NetworkContext';
import { blocksApi } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import { copyToClipboard } from '../utils/helpers';
import { formatNumber, formatDate, shortenHash } from '../utils/demoData';
import './Block.css';

export default function Block() {
  const { hash } = useParams();
  usePageTitle('Block' + (hash ? ' #' + hash.slice(0, 10) : ''));
  const [copied, setCopied] = useState(null);
  const { currentNetwork } = useNetwork();
  const { data: block, loading, error } = useApi(
    () => blocksApi.get(currentNetwork, hash),
    [hash, currentNetwork]
  );

  const handleCopy = useCallback(async (text, id) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    }
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!block) return <ErrorState message={`Block "${hash}" not found`} />;

  return (
    <div className="detail-page page-enter">
      <div className="page-header">
        <Link to="/" className="back-link" aria-label="Back to home">
          <FontAwesomeIcon icon="chevron-left" />
          Back
        </Link>
        <div className="page-header-info">
          <h1>Block #{formatNumber(block.height)}</h1>
          <span className="page-header-sub">{shortenHash(block.hash, 16)}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="cube" />
            Block Hash
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item-label">Hash</span>
              <span
                className="detail-item-value mono hash-copy"
                onClick={() => handleCopy(block.hash, 'hash')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCopy(block.hash, 'hash')}
                aria-label="Copy block hash"
              >
                {block.hash}
                <FontAwesomeIcon icon={copied === 'hash' ? 'check' : 'copy'} className="copy-icon" />
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Previous Block</span>
              <span className="detail-item-value mono">
                {block.previousblockhash ? (
                  <Link to={`/block/${block.previousblockhash}`} className="hash-link">
                    {shortenHash(block.previousblockhash, 10)}
                  </Link>
                ) : 'Genesis Block'}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="circle-info" />
            Details
          </div>
          <div className="detail-grid details-grid-4">
            <div className="detail-item">
              <span className="detail-item-label">Timestamp</span>
              <span className="detail-item-value">{formatDate(block.time)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Transactions</span>
              <span className="detail-item-value mono">{block.tx?.length || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Size</span>
              <span className="detail-item-value mono">{formatNumber(block.size)} bytes</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Difficulty</span>
              <span className="detail-item-value mono">{formatNumber(block.difficulty)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Version</span>
              <span className="detail-item-value mono">{block.version}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Nonce</span>
              <span className="detail-item-value mono">{block.nonce}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Bits</span>
              <span className="detail-item-value mono">{block.bits}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Merkle Root</span>
              <span className="detail-item-value mono hash-copy"
                onClick={() => handleCopy(block.merkleroot, 'merkle')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCopy(block.merkleroot, 'merkle')}
                aria-label="Copy merkle root"
              >
                {shortenHash(block.merkleroot, 12)}
                <FontAwesomeIcon icon={copied === 'merkle' ? 'check' : 'copy'} className="copy-icon" />
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="right-left" />
            Transactions ({block.tx?.length || 0})
          </div>
          <div className="tx-list">
            {block.tx?.map((txid, i) => (
              <Link key={i} to={`/tx/${txid}`} className="tx-item" aria-label={`View transaction ${shortenHash(txid, 4)}`}>
                <span className="tx-item-hash">{txid}</span>
                <FontAwesomeIcon icon="chevron-right" className="tx-item-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}