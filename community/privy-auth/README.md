# Privy Auth — Solana dApp Template

A [Next.js](https://nextjs.org) + [Tailwind CSS](https://tailwindcss.com) starter template with [Privy](https://www.privy.io) authentication, social logins, and embedded Solana wallets. Built for [`create-solana-dapp`](https://github.com/solana-foundation/solana-com/tree/main/packages/create-solana-dapp).

## Features

- **Social Login** — Google, X (Twitter), Discord, GitHub, and email
- **Embedded Wallets** — Privy auto-creates a Solana wallet for every user
- **Protected Routes** — Client-side auth guard redirects unauthenticated users
- **Wallet Dashboard** — View wallet addresses, balances, and linked accounts
- **Dark Theme** — Styled with Tailwind CSS and Solana brand colors
- **TypeScript** — Fully typed with custom Privy type definitions

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) (or npm / yarn)
- A [Privy](https://dashboard.privy.io) account (free tier available)

## Quick Start

### 1. Create a Privy App

1. Go to [dashboard.privy.io](https://dashboard.privy.io) and sign up or log in.
2. Create a new app (or use an existing one).
3. Copy your **App ID** from the app settings page.

### 2. Configure Privy Dashboard

In your Privy dashboard, enable the following:

- **Login methods**: Email, Google, Twitter, Discord, GitHub
- **Embedded wallets**: Enable Solana embedded wallets
- **Chains**: Add Solana (mainnet-beta or devnet as needed)

### 3. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Privy App ID:

```
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
```

### 4. Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout with PrivyProvider
│   ├── page.tsx                Landing page with login
│   ├── dashboard/
│   │   └── page.tsx            Protected dashboard with wallet info
│   └── globals.css             Tailwind base styles
├── components/
│   ├── LoginButton.tsx         Triggers Privy login modal
│   ├── LogoutButton.tsx        Signs out the user
│   ├── AuthGuard.tsx           Protects routes from unauthenticated access
│   ├── AuthStatus.tsx          Compact auth status indicator
│   ├── WalletInfo.tsx          Displays Solana wallets and balances
│   └── UserProfile.tsx         Shows linked accounts and user metadata
├── providers/
│   └── PrivyClientProvider.tsx Configures PrivyProvider with Solana settings
└── types/
    └── privy.ts                Type definitions for Privy user data
```

## How It Works

### Authentication Flow

1. User visits the landing page and clicks **Sign In**.
2. Privy opens a modal with configured login methods (email, social providers).
3. After authentication, Privy automatically creates an embedded Solana wallet.
4. The user is redirected to the `/dashboard` protected route.
5. The dashboard displays wallet addresses, SOL balances, and linked accounts.

### Embedded Wallets

Privy creates a non-custodial Solana wallet for users who don't already have one. The wallet is:

- **Created on login** — No extra steps for the user
- **Non-custodial** — Only the user controls the private key
- **Persistent** — Survives across sessions and devices
- **Usable** — Can sign transactions and messages via the Privy SDK

### Session Management

Privy manages sessions automatically using secure, httpOnly cookies. The `usePrivy()` hook provides:

- `ready` — Whether the SDK has finished initializing
- `authenticated` — Whether the user has an active session
- `user` — The full user object with linked accounts and wallets

Sessions persist across page refreshes. Use `useLogout()` to end a session.

### Protected Routes

The `AuthGuard` component wraps protected pages. It checks auth state via `usePrivy()` and redirects to `/` if the user is not authenticated. While the SDK loads, it shows a loading spinner.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Yes | Your Privy App ID from [dashboard.privy.io](https://dashboard.privy.io) |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Custom Solana RPC URL (defaults to mainnet-beta public RPC) |

## Key Privy Hooks

| Hook | Purpose |
| --- | --- |
| `usePrivy()` | Auth state, user object, `ready` and `authenticated` flags |
| `useLogin()` | Programmatically trigger the Privy login modal |
| `useLogout()` | End the user's session |
| `useSolanaWallets()` | Access embedded and connected Solana wallets |

## Resources

- [Privy Documentation](https://docs.privy.io)
- [Privy React SDK Reference](https://docs.privy.io/reference/react-auth)
- [Privy Solana Embedded Wallets](https://docs.privy.io/guide/embedded-wallets/solana)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
