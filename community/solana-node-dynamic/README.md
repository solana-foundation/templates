# Solana Node + Dynamic Server Wallets

A Node.js + Express backend that creates Dynamic MPC server wallets on Solana and signs transactions from the server — the building block for gasless relayers, Telegram bots, AI agent wallets, and any backend that needs programmatic Solana signing.

Powered by:

- [`@dynamic-labs-wallet/node`](https://www.npmjs.com/package/@dynamic-labs-wallet/node) — core Dynamic server SDK
- [`@dynamic-labs-wallet/node-svm`](https://www.npmjs.com/package/@dynamic-labs-wallet/node-svm) — Solana (SVM) extension
- `@solana/web3.js` — transaction building + RPC

## Features

- Create an MPC wallet from a server
- Fetch a wallet's SOL balance
- Sign + submit a SOL transfer via `client.solana.signTransaction`

## Requirements

- Node.js 20+
- A Dynamic Environment ID and API Token (https://app.dynamic.xyz/dashboard/developer)

## Getting Started

### 1. Install

```bash
pnpm install
```

### 2. Configure

```bash
cp .env.example .env
```

Set `DYNAMIC_ENVIRONMENT_ID` and `DYNAMIC_API_TOKEN` in `.env`.

### 3. Run

```bash
pnpm dev
```

## API

### `GET /health`

Health probe. Returns the configured RPC.

### `POST /wallets`

Creates a new Dynamic-managed Solana wallet.

```bash
curl -X POST http://localhost:3000/wallets
# { "address": "..." }
```

### `GET /wallets/:address/balance`

Returns the wallet's SOL balance.

```bash
curl http://localhost:3000/wallets/<address>/balance
# { "lamports": 12345678, "sol": 0.01234 }
```

### `POST /transfer`

Signs and submits a SOL transfer from a server wallet.

```bash
curl -X POST http://localhost:3000/transfer \
  -H 'content-type: application/json' \
  -d '{ "from": "<dynamic-wallet-address>", "to": "<recipient>", "sol": 0.001 }'
# { "signature": "..." }
```

## Code Shape

```ts
import { createDynamicWalletClient } from '@dynamic-labs-wallet/node'
import { solana } from '@dynamic-labs-wallet/node-svm'

const client = createDynamicWalletClient({
  environmentId: process.env.DYNAMIC_ENVIRONMENT_ID!,
  apiToken: process.env.DYNAMIC_API_TOKEN!,
  extensions: [solana()],
})

const wallet = await client.solana.createWallet()
const signed = await client.solana.signTransaction({ address: wallet.address, transaction: tx })
```

## Security

- `DYNAMIC_API_TOKEN` is a server-side credential — never expose it to a browser or mobile app.
- `.env` is gitignored; only `.env.example` (placeholders) is committed.
- Validate all inbound addresses and amounts before signing — the example above does minimal validation for clarity; add authentication + rate limiting before production use.

## Resources

- [Dynamic Node SVM Overview](https://www.dynamic.xyz/docs/node/svm/overview)
- [Dynamic Server Wallets Docs](https://www.dynamic.xyz/docs/node/overview)
- [Dynamic Dashboard](https://app.dynamic.xyz)
- [Dynamic OSS on GitHub](https://github.com/dynamic-labs-oss)
