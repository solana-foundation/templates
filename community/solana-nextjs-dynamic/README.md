# Solana Next.js + Dynamic

A Next.js starter template integrating [Dynamic](https://www.dynamic.xyz) wallet authentication with Solana. Connect Phantom, Solflare, and 100+ Solana wallets through Dynamic's unified SDK.

## Features

- Wallet connection via [Dynamic Widget](https://docs.dynamic.xyz/react/reference/components/dynamicwidget)
- Solana wallet detection with `isSolanaWallet`
- SOL balance fetching
- SOL transfer transactions
- Tailwind CSS styling

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Dynamic Environment ID:

```env
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your-environment-id-here
```

Get your Environment ID from the [Dynamic Dashboard](https://app.dynamic.xyz/dashboard/developer).

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Files

- `app/providers.tsx` — Sets up `DynamicContextProvider` with `SolanaWalletConnectors`
- `app/layout.tsx` — Wraps the app with the provider
- `app/page.tsx` — Demonstrates wallet connection, balance fetching, and SOL transfers

## Dynamic SDK

The core setup in `providers.tsx`:

```tsx
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'

<DynamicContextProvider
  settings={{
    environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
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

- [Dynamic Docs](https://docs.dynamic.xyz)
- [Dynamic React Quickstart](https://docs.dynamic.xyz/react-quickstart)
- [Solana Wallets with Dynamic](https://docs.dynamic.xyz/wallets/using-wallets/solana/solana-wallets)
- [Dynamic Dashboard](https://app.dynamic.xyz)
