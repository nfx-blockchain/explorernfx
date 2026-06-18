require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Client = require('bitcoin-core');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function createRPCClient(config) {
  return new Client({
    network: config.network,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    timeout: config.timeout || 30000
  });
}

const networks = {};
['mainnet', 'testnet'].forEach(net => {
  const host = process.env[`${net.toUpperCase()}_RPC_HOST`];
  const port = process.env[`${net.toUpperCase()}_RPC_PORT`];
  if (host && port) {
    networks[net] = createRPCClient({
      network: net,
      host,
      port: parseInt(port),
      username: process.env[`${net.toUpperCase()}_RPC_USER`] || process.env.RPC_USER,
      password: process.env[`${net.toUpperCase()}_RPC_PASS`] || process.env.RPC_PASS,
      timeout: parseInt(process.env.RPC_TIMEOUT) || 30000
    });
  }
});

if (!Object.keys(networks).length) {
  networks.mainnet = createRPCClient({
    network: 'mainnet',
    host: process.env.RPC_HOST || '127.0.0.1',
    port: parseInt(process.env.RPC_PORT) || 8332,
    username: process.env.RPC_USER,
    password: process.env.RPC_PASS,
    timeout: parseInt(process.env.RPC_TIMEOUT) || 30000
  });
}

app.get('/api/networks', (req, res) => {
  res.json(Object.keys(networks));
});

async function callRPC(network, method, ...args) {
  const client = networks[network] || Object.values(networks)[0];
  if (client[method]) {
    return client[method](...args);
  }
  return client.command(method.toLowerCase().replace(/([A-Z])/g, (m, p1) => '_' + p1.toLowerCase()), ...args);
}

app.get('/api/info/:network?', async (req, res) => {
  try {
    const network = req.params.network || Object.keys(networks)[0];
    const [info, staking, peerinfo] = await Promise.all([
      callRPC(network, 'getInfo'),
      callRPC(network, 'getStakingInfo').catch(() => null),
      callRPC(network, 'getPeerInfo').catch(() => [])
    ]);
    
    res.json({
      ...info,
      staking: staking || {},
      peers: peerinfo.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/blocks/:network/:limit?', async (req, res) => {
  try {
    const network = req.params.network;
    const count = parseInt(req.params.limit) || 50;
    const blockCount = await callRPC(network, 'getBlockCount');
    const blocks = [];
    
    const startHeight = Math.max(0, blockCount - count + 1);
    
    for (let i = startHeight; i <= blockCount; i++) {
      const hash = await callRPC(network, 'getBlockHash', i);
      const block = await callRPC(network, 'getBlock', hash, true);
      blocks.push({
        height: block.height || i,
        hash: typeof hash === 'string' ? hash : hash.result,
        time: block.time,
        txCount: block.tx ? block.tx.length : 0,
        size: block.size,
        difficulty: block.difficulty
      });
    }
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/block/:network/:hash', async (req, res) => {
  try {
    const { network, hash } = req.params;
    const block = await callRPC(network, 'getBlock', hash, true);
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tx/:network/:txid', async (req, res) => {
  try {
    const { network, txid } = req.params;
    const tx = await callRPC(network, 'getRawTransaction', txid, 1);
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/address/:network/:address', async (req, res) => {
  try {
    const { network, address } = req.params;
    const validate = await callRPC(network, 'validateAddress', address);
    const balance = await callRPC(network, 'getReceivedByAddress', address, 1).catch(() => 0);
    
    res.json({ address, validated: validate, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/staking/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const info = await callRPC(network, 'getStakingInfo');
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/peers/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const peers = await callRPC(network, 'getPeerInfo');
    res.json(peers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/nft/collection/:network/:id', async (req, res) => {
  try {
    const { network, id } = req.params;
    const info = await callRPC(network, 'nft_collection_get', id).catch(() => null);
    const tokens = await callRPC(network, 'nft_token_list', id).catch(() => []);
    res.json({ id, info, tokens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/nft/:network/list/:address?', async (req, res) => {
  try {
    const { network, address } = req.params;
    const collections = await callRPC(network, 'nft_collection_list', address || '').catch(() => []);
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/nft/:network/:collection/:tokenId', async (req, res) => {
  try {
    const { network, collection, tokenId } = req.params;
    const owner = await callRPC(network, 'nft_owner_of', collection, tokenId).catch(() => null);
    res.json({ collection, tokenId, ...owner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/token/:network/info/:contract', async (req, res) => {
  try {
    const { network, contract } = req.params;
    const info = await callRPC(network, 'token_get_info', contract).catch(() => null);
    res.json({ contract, info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/token/:network/balance/:contract/:address', async (req, res) => {
  try {
    const { network, contract, address } = req.params;
    const balance = await callRPC(network, 'token_balance_of', contract, address).catch(() => null);
    const available = await callRPC(network, 'token_balance_available', contract, address).catch(() => null);
    res.json({ contract, address, ...balance, available });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/island/:network/list/:owner?', async (req, res) => {
  try {
    const { network, owner } = req.params;
    const islands = await callRPC(network, 'island_list', owner || '').catch(() => []);
    res.json(islands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/island/:network/:id', async (req, res) => {
  try {
    const { network, id } = req.params;
    const [info, health] = await Promise.all([
      callRPC(network, 'island_get_info', id).catch(() => null),
      callRPC(network, 'island_analyze_health', id).catch(() => null)
    ]);
    res.json({ id, info, health });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/island/:network/stats', async (req, res) => {
  try {
    const { network } = req.params;
    const stats = await callRPC(network, 'island_stats').catch(() => null);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ai/:network/agents', async (req, res) => {
  try {
    const { network } = req.params;
    const agents = await callRPC(network, 'getaiagents').catch(() => null);
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ai/:network/protection', async (req, res) => {
  try {
    const { network } = req.params;
    const [protection, status] = await Promise.all([
      callRPC(network, 'getaiprotection').catch(() => null),
      callRPC(network, 'getaineuralstatus').catch(() => null)
    ]);
    res.json({ protection, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hypernodes/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const nodes = await callRPC(network, 'hypernode_list').catch(() => []);
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hypernodes/:network/stats', async (req, res) => {
  try {
    const { network } = req.params;
    const stats = await callRPC(network, 'hypernode_stats').catch(() => null);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NFXBlockChain Explorer running on port ${PORT}`);
  console.log(`Networks available: ${Object.keys(networks).join(', ')}`);
});