# Privy Auth — Solana dApp Template

A [create-solana-dapp](https://github.com/solana-developers/solana-templates) community template demonstrating **Privy-based authentication** in a Solana dApp — including social logins, embedded wallet creation, and protected routes.

## Features

- **Social Logins** — Google, Twitter, Discord, GitHub, and email authentication via Privy
- **Embedded Wallets** — Automatic Solana wallet creation on login (no browser extension needed)
- **Protected Routes** — Auth-gated dashboard page with automatic redirect for unauthenticated users
- **Wallet Actions** — View wallet address, check SOL balance, and sign messages
- **Session Management** — Privy handles tokens, refresh flows, and auth state automatically
- **Dark Theme** — Solana-branded UI with purple/green gradient accents

## Quick Start

### 1. Create your project

```bash
npx create-solana-dapp@latest --template privy-auth
```

Or clone directly:

```bash
git clone <repo-url> && cd privy-auth
pnpm install
```

### 2. Set up Privy

1. Create an account at [dashboard.privy.io](https://dashboard.privy.io)
2. Create a new app
3. Copy your **App ID** from the dashboard

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
```

### 4. Configure Privy Dashboard

In your [Privy Dashboard](https://dashboard.privy.io), configure the following:

**Login Methods** (Settings → Login Methods):

- Enable: Email, Google, Twitter, Discord, GitHub
- Enable: Wallet login

**Embedded Wallets** (Settings → Embedded Wallets):

- Enable Solana embedded wallets
- Set creation rule to "Create for users without wallets"

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
community/privy-auth/
├── app/
│   ├── layout.tsx              # Root layout with PrivyProvider
│   ├── page.tsx                # Public landing page
│   ├── globals.css             # Solana-themed design system
│   └── dashboard/
│       └── page.tsx            # Protected dashboard (requires auth)
├── components/
│   ├── auth/
│   │   ├── login-button.tsx    # Triggers Privy login modal
│   │   ├── user-profile.tsx    # User info, wallet address, logout
│   │   └── auth-guard.tsx      # Route protection wrapper
│   ├── layout/
│   │   ├── navbar.tsx          # Navigation with auth status
│   │   └── footer.tsx          # Footer with attribution
│   ├── providers/
│   │   └── privy-provider.tsx  # PrivyProvider + Solana config
│   └── wallet/
│       ├── wallet-info.tsx     # Wallet address + SOL balance
│       └── sign-message.tsx    # Sign message demo
├── types/
│   └── privy.ts                # TypeScript type definitions
├── .env.example                # Environment variables template
└── package.json                # Dependencies + template metadata
```

## How It Works

### Authentication Flow

1. User visits the landing page and clicks **"Get Started"**
2. Privy modal opens with social login options (Google, Twitter, Discord, GitHub, email)
3. On successful login, Privy automatically creates a Solana embedded wallet
4. User is redirected to the protected **Dashboard**

### Protected Routes

The `AuthGuard` component wraps protected pages:

```tsx
import { AuthGuard } from '@/components/auth/auth-guard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <YourProtectedContent />
    </AuthGuard>
  )
}
```

It checks `usePrivy().authenticated` and redirects unauthenticated users to `/`.

### Embedded Wallet

Privy creates Solana wallets automatically on login. The `PrivyProvider` is configured with:

```tsx
embeddedWallets: {
  solana: {
    createOnLogin: "users-without-wallets",
  },
},
```

Access wallets via the `useWallets` hook from `@privy-io/react-auth/solana`.

### Signing Messages

The template includes a message signing demo using Privy's `useSignMessage` hook:

```tsx
import { useSignMessage } from '@privy-io/react-auth/solana'

const { signMessage } = useSignMessage()
const result = await signMessage({
  message: new TextEncoder().encode('Hello!'),
  wallet,
})
```

## Environment Variables

| Variable                             | Required | Description                          |
| ------------------------------------ | -------- | ------------------------------------ |
| `NEXT_PUBLIC_PRIVY_APP_ID`           | ✅       | Your Privy App ID from the dashboard |
| `NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL` | ❌       | Custom Solana mainnet RPC URL        |

## Tech Stack

- [Next.js 15](https://nextjs.org) — React framework with App Router
- [Privy](https://privy.io) — Authentication and embedded wallets
- [@solana/kit](https://github.com/anza-xyz/solana-web3.js) — Solana RPC client
- [Tailwind CSS 4](https://tailwindcss.com) — Styling
- [TypeScript](https://typescriptlang.org) — Type safety

## Relevant Links

- [Privy Dashboard](https://dashboard.privy.io)
- [Privy Documentation](https://docs.privy.io)
- [Privy React SDK](https://www.npmjs.com/package/@privy-io/react-auth)
- [Solana Templates](https://templates.solana.com)
- [Next.js Documentation](https://nextjs.org/docs)
