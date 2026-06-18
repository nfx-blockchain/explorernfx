# explorernfx

NFXBlockChain Block Explorer - Suporte a Mainnet/Testnet via RPC

## Instalação

```bash
npm install
```

## Configuração

1. Copie `.env.example` para `.env`
2. Configure os daemons NFX:

```env
# Mainnet
MAINNET_RPC_HOST=127.0.0.1
MAINNET_RPC_PORT=8332
MAINNET_RPC_USER=usuario
MAINNET_RPC_PASS=senha

# Testnet
TESTNET_RPC_HOST=127.0.0.1
TESTNET_RPC_PORT=18332
TESTNET_RPC_USER=usuario
TESTNET_RPC_PASS=senha
```

## Execução

```bash
npm start
```

Acesse `http://localhost:3000`

## APIs NFXBlockChain

| Endpoint | Método RPC | Descrição |
|----------|-----------|-----------|
| `GET /api/networks` | - | Lista redes configuradas |
| `GET /api/info/:network` | `getinfo` | Info do node (inclui staking) |
| `GET /api/blocks/:network/:limit?` | `getblockcount`, `getblockhash`, `getblock` | Lista de blocos |
| `GET /api/block/:network/:hash` | `getblock` | Detalhes do bloco |
| `GET /api/tx/:network/:txid` | `getrawtransaction` | Detalhes da transação |
| `GET /api/address/:network/:address` | `validateaddress`, `getreceivedbyaddress` | Info do endereço |
| `GET /api/staking/:network` | `getstakinginfo` | Staking statistics |
| `GET /api/peers/:network` | `getpeerinfo` | Lista de peers |
| `GET /api/nft/collection/:network/:id` | `nft_collection_get`, `nft_token_list` | Info da collection |
| `GET /api/nft/:network/list/:address?` | `nft_collection_list` | Lista de collections |
| `GET /api/nft/:network/:collection/:tokenId` | `nft_owner_of` | Proprietário do token |
| `GET /api/token/:network/info/:contract` | `token_get_info` | Info do token |
| `GET /api/token/:network/balance/:contract/:address` | `token_balance_of`, `token_balance_available` | Saldo de tokens |
| `GET /api/island/:network/list/:owner?` | `island_list` | Lista de ilhas |
| `GET /api/island/:network/:id` | `island_get_info`, `island_analyze_health` | Info da ilha |
| `GET /api/island/:network/stats` | `island_stats` | Estatísticas de ilhas |
| `GET /api/hypernodes/:network` | `hypernode_list` | Lista de hypernodes |
| `GET /api/hypernodes/:network/stats` | `hypernode_stats` | Estatísticas hypernodes |
| `GET /api/ai/:network/agents` | `getaiagents` | Agentes de IA |
| `GET /api/ai/:network/protection` | `getaiprotection`, `getaineuralstatus` | Proteção IA |

## Páginas

- `/` - Dashboard principal
- `/nft-collections.html` - Browser de NFT Collections
- `/tokens.html` - Browser de Tokens
- `/islands.html` - Browser de Ilhas Digitais
- `/hypernodes.html` - Lista de Hypernodes
- `/ai.html` - Status de Proteção IA
- `/peers.html` - Lista de Peers
- `/block.html`, `/tx.html`, `/address.html` - Detalhes individuais