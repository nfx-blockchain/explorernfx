import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { transactionsApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import { copyToClipboard } from '../utils/helpers';
import { formatValue, formatNumber, formatDate, shortenHash } from '../utils/demoData';
import './Transaction.css';

export default function Transaction() {
  const { txid } = useParams();
  usePageTitle('Transaction' + (txid ? ' ' + txid.slice(0, 14) : ''));
  const [copied, setCopied] = useState(false);
  const { currentNetwork } = useNetwork();
  const { data: tx, loading, error } = useApi(
    () => transactionsApi.get(currentNetwork, txid),
    [txid, currentNetwork]
  );

  const handleCopy = async (text, id) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(id);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!tx) return <ErrorState message={`Transaction "${txid}" not found`} />;

  const getStatusClass = (status) => {
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'pending') return 'status-pending';
    return 'status-failed';
  };

  return (
    <div className="detail-page page-enter">
      <div className="page-header">
        <Link to="/" className="back-link">
          <FontAwesomeIcon icon="chevron-left" />
          Back
        </Link>
        <div className="page-header-info">
          <h1>Transaction</h1>
          <span className="page-header-sub">{shortenHash(tx.txid, 16)}</span>
        </div>
        <span className={`tx-status-badge ${tx.confirmations > 0 ? 'confirmed' : 'pending'}`}>
          <span className="tx-status-dot" />
          {tx.confirmations > 0 ? 'Confirmed' : 'Pending'}
        </span>
      </div>

      <div className="detail-card">
        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="fingerprint" />
            Transaction ID
          </div>
          <div className="detail-item">
            <span className="detail-item-label">TXID</span>
            <span className="detail-item-value mono hash-copy"
              onClick={() => handleCopy(tx.txid, 'txid')}
              role="button"
              tabIndex={0}
              onKeyDown={async (e) => { if (e.key === 'Enter') { await handleCopy(tx.txid, 'txid'); } }}
              aria-label="Copy transaction ID"
            >
              {tx.txid}
              <FontAwesomeIcon icon={copied === 'txid' ? 'check' : 'copy'} className="copy-icon" />
            </span>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="circle-info" />
            Overview
          </div>
          <div className="tx-value-display">
            <span className="tx-value-amount">{tx.vout?.reduce((sum, v) => sum + (v.value || 0), 0) || 0}</span>
            <span className="tx-value-currency">NFX</span>
          </div>
          <div className="detail-grid details-grid-4">
            <div className="detail-item">
              <span className="detail-item-label">Block Hash</span>
              <span className="detail-item-value mono">
                <Link to={`/block/${tx.blockhash}`} className="hash-link">
                  {shortenHash(tx.blockhash, 10)}
                </Link>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Block Height</span>
              <span className="detail-item-value mono">{formatNumber(tx.blockheight)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Confirmations</span>
              <span className="detail-item-value mono">{formatNumber(tx.confirmations)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Timestamp</span>
              <span className="detail-item-value">{formatDate(tx.time)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Size</span>
              <span className="detail-item-value mono">{tx.size} bytes</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Fee</span>
              <span className="detail-item-value mono">{tx.fee || 0} NFX</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="right-to-bracket" />
            Inputs ({tx.vin?.length || 0})
          </div>
          {tx.vin?.map((input, i) => (
            <div key={i} className="io-item">
              {input.coinbase ? (
                <span className="coinbase-label">Coinbase (New Coins)</span>
              ) : (
                <>
                  <div className="io-item-header">
                    <span className="io-item-label">Input #{i}</span>
                    {input.value && <span className="io-item-value">{formatValue(input.value)}</span>}
                  </div>
                  <div className="io-item-details">
                    <Link to={`/tx/${input.txid}`} className="hash-link">{shortenHash(input.txid, 12)}</Link>
                    <span className="io-item-vout">:Vout #{input.vout}</span>
                  </div>
                  {input.addresses?.map((addr, j) => (
                    <Link key={j} to={`/address/${addr}`} className="io-item-addr">{shortenHash(addr, 8)}</Link>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="left-from-bracket" />
            Outputs ({tx.vout?.length || 0})
          </div>
          {tx.vout?.map((output, i) => (
            <div key={i} className="io-item">
              <div className="io-item-header">
                <span className="io-item-label">Output #{i}</span>
                <span className="io-item-value">{formatValue(output.value)}</span>
              </div>
              <div className="io-item-details">
                <span className="io-item-type">{output.scriptPubKey?.type || 'Unknown'}</span>
              </div>
              {output.scriptPubKey?.addresses?.map((addr, j) => (
                <Link key={j} to={`/address/${addr}`} className="io-item-addr">{shortenHash(addr, 8)}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}