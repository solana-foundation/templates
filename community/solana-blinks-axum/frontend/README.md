# Frontend

Solana Blinks client built with Next.js 15, React 19, and Tailwind CSS 4. Connects to any Wallet Standard-compatible wallet via `@wallet-standard/react` and reads on-chain data with `@solana/kit`.

## Run

```bash
cp .env.example .env.local    # configure RPC + backend URL
npm install
npm run dev                   # http://localhost:3001
```

## Environment

```
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ACTIONS_API=http://localhost:3001
```

## What it does

- Discovers actions from the backend's `/actions.json`
- Renders interactive cards with forms for each action
- Signs and sends transactions via the wallet's `solana:signAndSendTransaction` feature
- Supports action chaining (multi-step flows)
- Accepts custom action URLs (paste any Blinks-compatible endpoint)
