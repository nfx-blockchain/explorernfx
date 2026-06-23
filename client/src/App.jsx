import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { NetworkProvider } from './contexts/NetworkContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Block = lazy(() => import('./pages/Block'));
const Transaction = lazy(() => import('./pages/Transaction'));
const Address = lazy(() => import('./pages/Address'));
const NFTs = lazy(() => import('./pages/NFTs'));
const NFTCollection = lazy(() => import('./pages/NFTCollection'));
const NFTToken = lazy(() => import('./pages/NFTToken'));
const Tokens = lazy(() => import('./pages/Tokens'));
const Islands = lazy(() => import('./pages/Islands'));
const IslandDetail = lazy(() => import('./pages/IslandDetail'));
const Hypernodes = lazy(() => import('./pages/Hypernodes'));
const AI = lazy(() => import('./pages/AI'));
const Peers = lazy(() => import('./pages/Peers'));
const Blocks = lazy(() => import('./pages/Blocks'));
const Txs = lazy(() => import('./pages/Txs'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LazyPage({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="loading-state"><div className="spinner" /><span className="loading-text">Loading...</span></div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LazyPage><Home /></LazyPage>} />
              <Route path="blocks" element={<LazyPage><Blocks /></LazyPage>} />
              <Route path="txs" element={<LazyPage><Txs /></LazyPage>} />
              <Route path="block/:hash" element={<LazyPage><Block /></LazyPage>} />
              <Route path="tx/:txid" element={<LazyPage><Transaction /></LazyPage>} />
              <Route path="address/:address" element={<LazyPage><Address /></LazyPage>} />
              <Route path="nfts" element={<LazyPage><NFTs /></LazyPage>} />
              <Route path="nfts/:id" element={<LazyPage><NFTCollection /></LazyPage>} />
              <Route path="nfts/:collection/:tokenId" element={<LazyPage><NFTToken /></LazyPage>} />
              <Route path="tokens" element={<LazyPage><Tokens /></LazyPage>} />
              <Route path="islands" element={<LazyPage><Islands /></LazyPage>} />
              <Route path="islands/:id" element={<LazyPage><IslandDetail /></LazyPage>} />
              <Route path="hypernodes" element={<LazyPage><Hypernodes /></LazyPage>} />
              <Route path="ai" element={<LazyPage><AI /></LazyPage>} />
              <Route path="peers" element={<LazyPage><Peers /></LazyPage>} />
              <Route path="search" element={<LazyPage><SearchResults /></LazyPage>} />
              <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;