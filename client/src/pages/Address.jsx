import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressesApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import { copyToClipboard } from '../utils/helpers';
import { formatNumber, formatDate, shortenHash, formatValue } from '../utils/demoData';
import './Address.css';

export default function Address() {
  const { address } = useParams();
  usePageTitle('Address' + (address ? ' ' + address.slice(0, 14) : ''));
  const [copied, setCopied] = useState(false);
  const { currentNetwork } = useNetwork();
  const { data: addrData, loading, error } = useApi(
    () => addressesApi.get(currentNetwork, address),
    [address, currentNetwork]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="detail-page page-enter">
      <div className="page-header">
        <Link to="/" className="back-link">
          <FontAwesomeIcon icon="chevron-left" />
          Back
        </Link>
        <div className="page-header-info">
          <h1>Address</h1>
          <span className="page-header-sub">{shortenHash(addrData?.address, 16)}</span>
        </div>
        <span className={`addr-status-badge ${addrData?.validated?.isvalid ? 'valid' : 'invalid'}`}>
          <span className="addr-status-dot" />
          {addrData?.validated?.isvalid ? 'Valid' : 'Invalid'}
        </span>
      </div>

      <div className="address-balance-card">
        <div className="address-balance-label">Balance</div>
        <div className="address-balance-value">{formatValue(addrData?.balance || 0)}</div>
        <div className="address-balance-stats">
          <div className="abs-item">
            <span className="abs-label">Total Received</span>
            <span className="abs-value">{formatValue(addrData?.totalReceived || 0)}</span>
          </div>
          <div className="abs-divider" />
          <div className="abs-item">
            <span className="abs-label">Total Sent</span>
            <span className="abs-value">{formatValue(addrData?.totalSent || 0)}</span>
          </div>
          <div className="abs-divider" />
          <div className="abs-item">
            <span className="abs-label">Transactions</span>
            <span className="abs-value">{formatNumber(addrData?.txCount || 0)}</span>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="circle-info" />
            Details
          </div>
          <div className="detail-grid details-grid-4">
            <div className="detail-item">
              <span className="detail-item-label">Address</span>
              <span className="detail-item-value mono hash-copy"
                onClick={async () => { const ok = await copyToClipboard(addrData?.address || ''); if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); } }}
                role="button"
                tabIndex={0}
                onKeyDown={async (e) => { if (e.key === 'Enter') { await copyToClipboard(addrData?.address || ''); } }}
                aria-label="Copy address"
              >
                {shortenHash(addrData?.address, 10)}
                <FontAwesomeIcon icon={copied ? 'check' : 'copy'} className="copy-icon" />
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Script Type</span>
              <span className="detail-item-value">{addrData?.validated?.script || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Is Mine</span>
              <span className="detail-item-value">{addrData?.validated?.ismine ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="right-left" />
            Recent Transactions
          </div>
          <div className="addr-tx-list">
            {/* Note: Real transaction history would require additional RPC call */}
            <div className="addr-tx-item">
              <span className="addr-tx-empty">Transaction history requires mempool index</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}