# nextjs

Next.js starter with Tailwind CSS, [`@solana/kit`](https://github.com/anza-xyz/kit) and [`@solana/kit-client-rpc`](https://github.com/anza-xyz/kit-plugins) for wallet connection, balance display, and cluster switching.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs
```

```shell
npm install
npm run dev
```

## What's Included

- Wallet connection via [wallet-standard](https://github.com/wallet-standard/wallet-standard) (auto-discovers Phantom, Solflare, etc.)
- Balance display with real-time WebSocket updates
- Devnet airdrop
- Cluster switching (devnet, testnet, mainnet, localnet)
- Light/dark theme toggle

## Using Your Own RPC

The public mainnet RPC (`api.mainnet-beta.solana.com`) rejects requests from browser origins. To use mainnet, replace the URL in `app/lib/solana-client.ts` with your own RPC provider (e.g. [Helius](https://www.helius.dev/), [Triton](https://triton.one/)).

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [@solana/kit](https://github.com/anza-xyz/kit) for RPC, signers, and transaction types
- [@solana/kit-client-rpc](https://github.com/anza-xyz/kit-plugins) for the plugin-based client
- [SWR](https://swr.vercel.app/) for data fetching
- [sonner](https://sonner.emilkowal.ski/) for toast notifications
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
