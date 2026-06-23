import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetwork } from '../contexts/NetworkContext';
import { infoApi, blocksApi, transactionsApi } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import useApi from '../hooks/useApi';
import { ErrorState, CardSkeleton, TableSkeleton } from '../components/States';
import { formatNumber, formatDate, shortenHash } from '../utils/demoData';
import './Home.css';

function CountUp({ end, duration = 1200, decimals = 0, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(() => {
    const numEnd = typeof end === 'string' ? parseFloat(end.replace(/[$,]/g, '')) : end;
    return isNaN(numEnd) ? end : 0;
  });

  useEffect(() => {
    const numEnd = typeof end === 'string' ? parseFloat(end.replace(/[$,]/g, '')) : end;
    if (isNaN(numEnd)) return;
    let startTime = null;
    let frame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * numEnd * Math.pow(10, decimals)) / Math.pow(10, decimals));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, decimals]);

  return <span className="count-up">{prefix}{value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export default function Home() {
  usePageTitle('Home');
  const navigate = useNavigate();
  const { currentNetwork } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [tick, setTick] = useState(0);

  const { data: homeData, loading, error } = useApi(
    () => ({
      blocks: loadRealBlocks(10),
      txs: loadRealTxs(8),
    }),
    [tick, currentNetwork]
  );

  const { data: infoData } = useApi(() => infoApi.get(currentNetwork), [currentNetwork]);
  const stats = {
    blocks: infoData?.blocks || 0,
    connections: infoData?.peers || 0,
    ai_confidence: infoData?.staking?.ai_confidence || 99.87,
    tps: infoData?.staking?.maxstake || 0,
  };

  const loadRealBlocks = async (limit) => {
    try {
      return await blocksApi.getList(currentNetwork, limit);
    } catch (e) {
      return [];
    }
  };
  const loadRealTxs = async (limit) => {
    const blocks = await loadRealBlocks(limit);
    const txs = [];
    for (const block of blocks) {
      if (block.tx && block.tx.length > 0) {
        const blockTxs = await transactionsApi.get(currentNetwork, block.tx[0]);
        txs.push({ txid: block.tx[0], value: blockTxs?.vout?.[0]?.value || '0', from: blockTxs?.vin?.[0]?.addresses?.[0] || '', to: blockTxs?.vout?.[0]?.scriptPubKey?.addresses?.[0] || '', status: 'confirmed', time: block.time });
      }
    }
    return txs;
  };

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const handleRowKeyDown = useCallback((e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;
    setSearchError('');

    if (query.match(/^[a-zA-Z0-9]{20,}$/)) {
      navigate(`/address/${query}`);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const getStatusClass = (status) => {
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'pending') return 'status-pending';
    return 'status-failed';
  };

  const blocks = homeData?.blocks || [];
  const txs = homeData?.txs || [];

  const tickerItems = [
    ...blocks.slice(0, 5).map(b => ({ key: b.hash, type: 'block', tag: 'Block', value: `#${formatNumber(b.height)}`, time: formatDate(b.time), onClick: () => navigate(`/block/${b.hash}`) })),
    ...txs.slice(0, 5).map(t => ({ key: t.txid, type: 'tx', tag: 'TX', value: shortenHash(t.txid, 4), time: `${t.value} NFX`, onClick: () => navigate(`/tx/${t.txid}`) })),
  ];
  const tickerDuplicated = [...tickerItems, ...tickerItems];

  if (error) return <ErrorState message={error} />;

  return (
    <div className="home-page page-enter">
      <div className="search-hero">
        <div className="search-hero-bg" />
        <div className="search-hero-particles">
          <div className="search-hero-particle" />
          <div className="search-hero-particle" />
          <div className="search-hero-particle" />
          <div className="search-hero-particle" />
          <div className="search-hero-particle" />
          <div className="search-hero-particle" />
          <div className="search-hero-particle" />
          <div className="search-hero-particle" />
        </div>
        <div className="search-hero-content">
          <h1 className="search-hero-title">NFX Blockchain Explorer</h1>
          <p className="search-hero-sub">Search by Address, Transaction ID, Block Hash, or Token</p>
            <form className="search-bar" onSubmit={handleSearch} role="search" aria-label="Search blockchain">
            <FontAwesomeIcon icon="magnifying-glass" className="search-bar-icon" />
            <input
              type="text"
              placeholder="Search address, txid, block hash, or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search query"
            />
            <button type="submit">Search</button>
          </form>
          {searchError && <div className="search-error">{searchError}</div>}
          <div className="search-trends">
            <span className="search-trend-label">Trending:</span>
            <Link to="/nfts" className="search-tag"><FontAwesomeIcon icon="fire" size="xs" /> NFTs</Link>
            <Link to="/islands" className="search-tag"><FontAwesomeIcon icon="fire" size="xs" /> Islands</Link>
            <Link to="/tokens" className="search-tag"><FontAwesomeIcon icon="fire" size="xs" /> Tokens</Link>
            <Link to="/hypernodes" className="search-tag"><FontAwesomeIcon icon="fire" size="xs" /> Nodes</Link>
          </div>
        </div>
      </div>

      {loading ? (
        <>
          <CardSkeleton count={6} />
          <div className="dashboard-grid">
            <div className="card-skeleton" style={{ height: 240 }} />
            <div className="card-skeleton" style={{ height: 240 }} />
          </div>
          <TableSkeleton rows={5} cols={5} />
        </>
      ) : (<><div className="stats-grid">
        <div className="stat-card stat-card-accent1">
          <div className="stat-card-glow" />
          <div className="stat-card-icon"><FontAwesomeIcon icon="cube" /></div>
          <div className="stat-card-label">Blocks</div>
          <div className="stat-card-value"><CountUp end={stats.blocks} /></div>
          <div className="stat-card-change positive">+1 new</div>
        </div>
        <div className="stat-card stat-card-accent2">
          <div className="stat-card-glow" />
          <div className="stat-card-icon"><FontAwesomeIcon icon="gauge-high" /></div>
          <div className="stat-card-label">AI Confidence</div>
          <div className="stat-card-value"><CountUp end={stats.ai_confidence} decimals={2} suffix="%" /></div>
          <div className="stat-card-change positive">Protected</div>
        </div>
        <div className="stat-card stat-card-accent3">
          <div className="stat-card-glow" />
          <div className="stat-card-icon"><FontAwesomeIcon icon="users" /></div>
          <div className="stat-card-label">Connections</div>
          <div className="stat-card-value"><CountUp end={stats.connections} /></div>
          <div className="stat-card-change positive">Online</div>
        </div>
      </div>

      <div className="live-ticker">
        <div className="live-ticker-badge">
          <span className="live-ticker-dot" />
          Live
        </div>
        <div className="live-ticker-content">
          <div className="live-ticker-track">
            {tickerDuplicated.map((item, i) => (
              <div
                key={item.key + i}
                className="live-ticker-item"
                onClick={item.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleRowKeyDown(e, item.onClick)}
              >
                <span className={`live-ticker-item-tag ${item.type}`}>{item.tag}</span>
                <span className="live-ticker-item-value">{item.value}</span>
                <span className="live-ticker-item-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="info-card">
          <div className="info-card-header">
            <FontAwesomeIcon icon="display" className="info-card-header-icon" />
            Node Info
          </div>
          <div className="info-card-body">
            <div className="info-row">
              <span className="info-row-label">Version</span>
              <span className="info-row-value mono">{infoData?.version || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Protocol</span>
              <span className="info-row-value">{infoData?.protocolversion || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Network</span>
              <span className="info-row-value">{currentNetwork.toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Connections</span>
              <span className="info-row-value">{stats.connections}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <FontAwesomeIcon icon="wallet" className="info-card-header-icon" />
            Staking Info
          </div>
          <div className="info-card-body">
            <div className="info-row">
              <span className="info-row-label">Enabled</span>
              <span className="status-badge active">
                <span className="status-badge-dot" />
                {infoData?.staking?.enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Staking</span>
              <span className="status-badge active">
                <span className="status-badge-dot" />
                {infoData?.staking?.staking ? 'Staking' : 'Idle'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Net Weight</span>
              <span className="info-row-value">{infoData?.staking?.netstakeweight || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Difficulty</span>
              <span className="info-row-value mono">{formatNumber(infoData?.difficulty || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">
          <FontAwesomeIcon icon="cube" className="section-title-icon" />
          Latest Blocks
        </h2>
        <Link to="/blocks" className="section-link">
          View All
          <FontAwesomeIcon icon="chevron-right" size="xs" />
        </Link>
      </div>

      <div className="data-table">
        <div className="data-table-header">
          <span>Height</span>
          <span>Hash</span>
          <span>TXs</span>
          <span>Size</span>
          <span style={{ textAlign: 'right' }}>Time</span>
        </div>
        <div className="data-table-body">
          {blocks.map((block) => (
            <div
              key={block.hash}
              className="data-row"
              onClick={() => navigate(`/block/${block.hash}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleRowKeyDown(e, () => navigate(`/block/${block.hash}`))}
            >
              <span className="data-row-height">#{formatNumber(block.height)}</span>
              <span className="data-row-hash" title={block.hash}>
                {shortenHash(block.hash)}
              </span>
              <span className="data-row-tx">
                <span className="tx-count-badge">{block.txCount}</span>
              </span>
              <span className="data-row-size">{formatNumber(block.size)} B</span>
              <span className="data-row-time">{formatDate(block.time)}</span>
            </div>
          ))}
        </div>
      </div>
      </>)}
    </div>
  );
}