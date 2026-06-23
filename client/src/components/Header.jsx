import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '../contexts/ThemeContext';
import { useNetwork } from '../contexts/NetworkContext';
import './Header.css';

const navItems = [
  { path: '/', label: 'Home', icon: 'house' },
  { path: '/nfts', label: 'NFTs', icon: 'palette' },
  { path: '/tokens', label: 'Tokens', icon: 'coins' },
  { path: '/islands', label: 'Islands', icon: 'globe' },
  { path: '/hypernodes', label: 'Nodes', icon: 'server' },
  { path: '/ai', label: 'AI', icon: 'brain' },
  { path: '/peers', label: 'Peers', icon: 'users' },
];

export default function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const { networks, currentNetwork, switchNetwork, loading } = useNetwork();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [menuOpen]);

  return (
    <header className={`main-header${menuOpen ? ' menu-open' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-icon">
            <img src="/logo.png" alt="NFXScan" className="logo-image" />
          </div>
          <div className="logo-text-group">
            <span className="logo-text">NFXScan</span>
            <span className="logo-sub">Blockchain Explorer</span>
          </div>
          <span className="logo-badge">{currentNetwork.toUpperCase()}</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <nav className={`nav-menu ${menuOpen ? 'nav-menu-open' : ''}`} aria-label="Main navigation">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              <FontAwesomeIcon icon={item.icon} className="nav-icon" fixedWidth />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {!loading && networks.length > 1 && (
            <div className="network-select-wrapper">
              <FontAwesomeIcon icon="globe" className="network-icon" />
              <select
                className="network-select"
                value={currentNetwork}
                onChange={(e) => switchNetwork(e.target.value)}
                aria-label="Select network"
              >
                {networks.map(net => (
                  <option key={net} value={net}>{net.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}
          {loading && (
            <div className="network-indicator">
              <span className="network-dot" />
              {currentNetwork.toUpperCase()}
            </div>
          )}
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <FontAwesomeIcon icon={darkMode ? 'sun' : 'moon'} className="theme-icon" />
          </button>
        </div>
      </div>
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
