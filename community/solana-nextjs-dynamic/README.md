# Solana Next.js + Dynamic

A Next.js starter template integrating [Dynamic](https://www.dynamic.xyz) wallet authentication with Solana. Connect Phantom, Solflare, and 100+ Solana wallets through Dynamic's headless JS SDK.

## Features

- Wallet connection via Dynamic's headless JS SDK — custom connect button, no pre-built widget
- Solana wallet detection with `isSolanaWalletAccount`
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

- `app/dynamicClient.ts` — Creates the Dynamic client singleton and registers Solana extensions
- `app/providers.tsx` — Wraps the app with `DynamicProvider`
- `components/header.tsx` — Custom connect button using `useWalletProviders` + `connectWithWalletProvider`
- `app/page.tsx` — Wallet display, SOL balance, and transfer flow

## Dynamic SDK

The core setup in `app/dynamicClient.ts`:

```ts
import { createDynamicClient } from '@dynamic-labs-sdk/client'
import { addSolanaWalletStandardExtension } from '@dynamic-labs-sdk/solana/walletStandard'
import { addWaasSolanaExtension } from '@dynamic-labs-sdk/solana/waas'

export const dynamicClient = createDynamicClient({
  environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
})

addSolanaWalletStandardExtension()
addWaasSolanaExtension()
```

Provider setup in `app/providers.tsx`:

```tsx
import { DynamicProvider } from '@dynamic-labs-sdk/react-hooks'
import { dynamicClient } from './dynamicClient'

export function Providers({ children }: { children: React.ReactNode }) {
  return <DynamicProvider client={dynamicClient}>{children}</DynamicProvider>
}
```

Key hooks used (from `@dynamic-labs-sdk/react-hooks`):

- `useInitStatus()` — Returns `'uninitialized' | 'in-progress' | 'finished' | 'failed'`
- `useUser()` — Current user object or `null`
- `useWalletAccounts()` — Array of connected wallet accounts
- `useWalletProviders()` — Available wallet providers for connection

Key functions (from `@dynamic-labs-sdk/client`):

- `connectWithWalletProvider({ walletProviderKey })` — Connect a specific wallet
- `logout()` — Disconnect the current wallet

Solana utilities (from `@dynamic-labs-sdk/solana`):

- `isSolanaWalletAccount(account)` — Type guard for Solana wallet accounts
- `getSolanaConnection({ networkData })` — Get a `@solana/web3.js` Connection
- `signAndSendTransaction({ walletAccount, transaction })` — Sign and broadcast a transaction

## Resources

- [Dynamic JS SDK Docs](https://www.dynamic.xyz/docs/javascript/reference/react-quickstart)
- [Dynamic Solana Extension Docs](https://www.dynamic.xyz/docs/javascript/reference/solana)
- [Dynamic Dashboard](https://app.dynamic.xyz)
