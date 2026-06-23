import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { networksApi } from '../services/api';

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [networks, setNetworks] = useState([]);
  const [currentNetwork, setCurrentNetwork] = useState(() => {
    return localStorage.getItem('nfxNetwork') || 'mainnet';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNetworks = useCallback(async () => {
    try {
      const data = await networksApi.getAll();
      setNetworks(data);
      if (!data.includes(currentNetwork) && data.length > 0) {
        setCurrentNetwork(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentNetwork]);

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  useEffect(() => {
    localStorage.setItem('nfxNetwork', currentNetwork);
  }, [currentNetwork]);

  const switchNetwork = useCallback((network) => {
    if (networks.includes(network)) {
      setCurrentNetwork(network);
    }
  }, [networks]);

  return (
    <NetworkContext.Provider value={{
      networks,
      currentNetwork,
      switchNetwork,
      loading,
      error,
      refetch: fetchNetworks,
    }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}