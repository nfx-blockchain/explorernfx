import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { aiApi } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { LoadingState, ErrorState } from '../components/States';
import './AI.css';

export default function AI() {
  usePageTitle('AI Security');
  const { currentNetwork } = useNetwork();
  const { data, loading, error } = useApi(() => aiApi.getProtection(currentNetwork), [currentNetwork]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="No AI data available" />;

  return (
    <div className="ai-page page-enter">
      <div className="page-header">
        <div>
          <h1>AI Protection</h1>
          <p className="page-header-sub">Neural network-powered blockchain security</p>
        </div>
      </div>

      <div className="ai-grid">
        <div className="detail-card">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="shield" />
            Protection Status
          </div>
          <div className="ai-protection-list">
            {data.protection ? Object.entries(data.protection).map(([key, value]) => (
              <div key={key} className="ai-protection-item">
                <span className="ai-protection-label">{formatKey(key)}</span>
                <span className="ai-protection-value enabled">
                  <span className="ai-protection-dot" />
                  {value}
                </span>
              </div>
            )) : <div>No protection data</div>}
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-section-header">
            <FontAwesomeIcon icon="chart-simple" />
            Neural Status
          </div>
          <div className="ai-status-list">
            {data.status ? Object.entries(data.status).map(([key, value]) => (
              <div key={key} className="ai-status-item">
                <span className="ai-status-label">{formatKey(key)}</span>
                <span className="ai-status-value mono">{String(value)}</span>
              </div>
            )) : <div>No status data</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}