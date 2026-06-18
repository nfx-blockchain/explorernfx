# explorernfx

NFXBlockChain Block Explorer - Mainnet/Testnet RPC Support

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Configure NFX daemons:

```env
# Mainnet
MAINNET_RPC_HOST=127.0.0.1
MAINNET_RPC_PORT=8332
MAINNET_RPC_USER=username
MAINNET_RPC_PASS=password

# Testnet
TESTNET_RPC_HOST=127.0.0.1
TESTNET_RPC_PORT=18332
TESTNET_RPC_USER=username
TESTNET_RPC_PASS=password
```

## Running

```bash
npm start
# Or with PM2 for persistent background:
pm2 start server.js --name nfx-explorer
```

Access `http://localhost:3000`

## Features

- **Multi-network**: Switch between mainnet/testnet
- **Dark/Light mode**: Toggle with moon/sun button
- **English UI**: Ready for internationalization (i18n.js)
- **Real-time stats**: Connection count in footer

## API Endpoints

| Endpoint | RPC Method | Description |
|----------|-----------|-----------|
| `GET /api/networks` | - | List configured networks |
| `GET /api/info/:network` | `getinfo` | Node info (includes staking) |
| `GET /api/blocks/:network/:limit?` | `getblockcount`, `getblockhash`, `getblock` | Block list |
| `GET /api/block/:network/:hash` | `getblock` | Block details |
| `GET /api/tx/:network/:txid` | `getrawtransaction` | Transaction details |
| `GET /api/address/:network/:address` | `validateaddress`, `getreceivedbyaddress` | Address info |
| `GET /api/staking/:network` | `getstakinginfo` | Staking statistics |
| `GET /api/peers/:network` | `getpeerinfo` | Peers list |
| `GET /api/nft/collection/:network/:id` | `nft_collection_get`, `nft_token_list` | Collection info |
| `GET /api/nft/:network/list/:address?` | `nft_collection_list` | Collections list |
| `GET /api/nft/:network/:collection/:tokenId` | `nft_owner_of` | Token owner |
| `GET /api/token/:network/info/:contract` | `token_get_info` | Token info |
| `GET /api/token/:network/balance/:contract/:address` | `token_balance_of`, `token_balance_available` | Token balance |
| `GET /api/island/:network/list/:owner?` | `island_list` | Islands list |
| `GET /api/island/:network/:id` | `island_get_info`, `island_analyze_health` | Island info |
| `GET /api/island/:network/stats` | `island_stats` | Islands statistics |
| `GET /api/hypernodes/:network` | `hypernode_list` | Hypernodes list |
| `GET /api/hypernodes/:network/stats` | `hypernode_stats` | Hypernodes statistics |
| `GET /api/ai/:network/agents` | `getaiagents` | AI agents status |
| `GET /api/ai/:network/protection` | `getaiprotection`, `getaineuralstatus` | AI protection status |

## Pages

- `/` - Dashboard with stats and quick links
- `/nft-collections.html` - NFT Collections browser
- `/nft-collection.html` - Collection details
- `/nft-token.html` - Token details
- `/tokens.html` - Tokens browser
- `/islands.html` - Islands browser
- `/island.html` - Island details
- `/hypernodes.html` - Hypernodes list
- `/ai.html` - AI Protection status
- `/peers.html` - Peers list
- `/block.html` - Block details
- `/tx.html` - Transaction details
- `/address.html` - Address details