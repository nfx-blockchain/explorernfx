import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetwork } from '../contexts/NetworkContext';
import './Footer.css';

export default function Footer() {
  const { currentNetwork } = useNetwork();

  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-icon">
            <FontAwesomeIcon icon="mountain" />
          </div>
          <span className="footer-brand-text">NFXScan</span>
          <span className="footer-divider" />
          <span className="footer-tagline">Blockchain Explorer</span>
        </div>
        <div className="footer-links">
          <span className="footer-copy">&copy; 2026 NFX Blockchain</span>
          <span className="footer-divider" />
          <div className="footer-stat">
            <span className="footer-stat-label">Network</span>
            <span className="footer-stat-value">{currentNetwork.toUpperCase()}</span>
          </div>
          <span className="footer-divider" />
          <span className="footer-status">
            <span className="footer-status-dot" />
            Connected
          </span>
        </div>
      </div>
    </footer>
  );
}
