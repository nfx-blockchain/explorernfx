import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const networksApi = {
  getAll: () => api.get('/networks').then(res => res.data),
};

export const infoApi = {
  get: (network) => api.get(`/info/${network}`).then(res => res.data),
};

export const blocksApi = {
  getList: (network, limit = 50) => api.get(`/blocks/${network}/${limit}`).then(res => res.data),
  get: (network, hash) => api.get(`/block/${network}/${hash}`).then(res => res.data),
};

export const transactionsApi = {
  get: (network, txid) => api.get(`/tx/${network}/${txid}`).then(res => res.data),
};

export const addressesApi = {
  get: (network, address) => api.get(`/address/${network}/${address}`).then(res => res.data),
};

export const stakingApi = {
  get: (network) => api.get(`/staking/${network}`).then(res => res.data),
};

export const peersApi = {
  get: (network) => api.get(`/peers/${network}`).then(res => res.data),
};

export const nftApi = {
  getCollection: (network, id) => api.get(`/nft/collection/${network}/${id}`).then(res => res.data),
  listCollections: (network, address) => api.get(`/nft/${network}/list/${address || ''}`).then(res => res.data),
  getTokenOwner: (network, collection, tokenId) => api.get(`/nft/${network}/${collection}/${tokenId}`).then(res => res.data),
};

export const tokenApi = {
  getInfo: (network, contract) => api.get(`/token/${network}/info/${contract}`).then(res => res.data),
  getBalance: (network, contract, address) => api.get(`/token/${network}/balance/${contract}/${address}`).then(res => res.data),
};

export const islandsApi = {
  list: (network, owner) => api.get(`/island/${network}/list/${owner || ''}`).then(res => res.data),
  get: (network, id) => api.get(`/island/${network}/${id}`).then(res => res.data),
  getStats: (network) => api.get(`/island/${network}/stats`).then(res => res.data),
};

export const hypernodesApi = {
  list: (network) => api.get(`/hypernodes/${network}`).then(res => res.data),
  getStats: (network) => api.get(`/hypernodes/${network}/stats`).then(res => res.data),
};

export const aiApi = {
  getAgents: (network) => api.get(`/ai/${network}/agents`).then(res => res.data),
  getProtection: (network) => api.get(`/ai/${network}/protection`).then(res => res.data),
};

export default api;