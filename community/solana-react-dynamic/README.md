# Solana React + Vite + Dynamic

A React + Vite starter integrating [Dynamic](https://www.dynamic.xyz) wallet authentication with Solana. Connect Phantom, Solflare, and 100+ Solana wallets through Dynamic's unified SDK — with embedded MPC wallets and social login built in.

## Features

- Wallet connection via [Dynamic Widget](https://www.dynamic.xyz/docs/react/reference/components/dynamicwidget)
- Solana wallet detection with `isSolanaWallet`
- SOL balance fetching
- SOL transfer transactions
- Tailwind CSS 4 styling

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Dynamic Environment ID:

```env
VITE_DYNAMIC_ENVIRONMENT_ID=your-environment-id-here
```

Get your Environment ID from the [Dynamic Dashboard](https://app.dynamic.xyz/dashboard/developer).

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Key Files

- `src/providers.tsx` — Sets up `DynamicContextProvider` with `SolanaWalletConnectors`
- `src/main.tsx` — Wraps the app with the provider
- `src/App.tsx` — Demonstrates wallet connection, balance fetching, and SOL transfers

## Dynamic SDK

The core setup in `providers.tsx`:

```tsx
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
;<DynamicContextProvider
  settings={{
    environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
    walletConnectors: [SolanaWalletConnectors],
  }}
>
  {children}
</DynamicContextProvider>
```

Key hooks used:

- `useIsLoggedIn()` — Check if the user is authenticated
- `useDynamicContext()` — Access `primaryWallet`, `sdkHasLoaded`, and more
- `isSolanaWallet(wallet)` — Type-narrow to a Solana wallet

## Resources

- [Dynamic Docs](https://www.dynamic.xyz/docs)
- [Dynamic React Quickstart](https://www.dynamic.xyz/docs/react-quickstart)
- [Solana Wallets with Dynamic](https://www.dynamic.xyz/docs/react/wallets/using-wallets/solana/solana-wallets)
- [Dynamic Dashboard](https://app.dynamic.xyz)
