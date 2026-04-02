# nextjs

Next.js starter with Tailwind CSS, [`@solana/connector`](https://github.com/solana-foundation/connectorkit), and [`@solana/kit`](https://github.com/anza-xyz/kit) for wallet connection, balance display, and cluster switching.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs
```

```shell
npm install
npm run dev
```

## What's Included

- Wallet connection via [`@solana/connector`](https://github.com/solana-foundation/connectorkit) and [wallet-standard](https://github.com/wallet-standard/wallet-standard) (auto-discovers Phantom, Solflare, etc.)
- Balance display with real-time WebSocket updates
- Devnet airdrop
- Cluster switching (devnet, testnet, mainnet, localnet)
- Light/dark theme toggle

## Using Your Own RPC

The public mainnet RPC (`api.mainnet-beta.solana.com`) rejects requests from browser origins. To use mainnet reliably, configure your own RPC URL in `app/components/providers.tsx` by passing custom clusters to `getDefaultConfig(...)` (for example, from [Helius](https://www.helius.dev/) or [Triton](https://triton.one/)).

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [@solana/connector](https://github.com/solana-foundation/connectorkit) for wallet discovery, connection state, and cluster/account hooks
- [@solana/kit](https://github.com/anza-xyz/kit) for RPC and transaction utilities
- [sonner](https://sonner.emilkowal.ski/) for toast notifications
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
