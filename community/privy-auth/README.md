# Privy Auth Template

Social login + embedded Solana wallet powered by [Privy](https://docs.privy.io).

## Features

- **Social Login** -- Google, GitHub, Discord, Twitter, and email via Privy
- **Embedded Wallets** -- Solana wallet auto-created on first login, no extensions needed
- **SOL Balance** -- Real-time devnet balance display
- **Message Signing** -- Sign and verify messages with the embedded wallet
- **Protected Routes** -- Client-side auth guard with skeleton loading states
- **Dark/Light Theme** -- System-aware theme toggle via `next-themes`
- **TypeScript** -- Fully typed with custom Privy type definitions
- **shadcn/ui** -- Polished component library with Tailwind CSS v4

## Quick Start

```bash
npx create-solana-dapp --template privy-auth
cd privy-auth
cp .env.example .env.local
# Add your Privy App ID to .env.local
pnpm dev
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io)
- A [Privy](https://dashboard.privy.io) account (free tier available)

### 1. Create a Privy App

1. Go to [dashboard.privy.io](https://dashboard.privy.io) and create a new app
2. Navigate to **Settings > Basics** and copy your **App ID**
3. Under **Login Methods**, enable **Google**, **GitHub**, **Discord**, **Twitter**, and **Email**
4. Under **Embedded Wallets**, enable **Solana** embedded wallets

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Open `.env.local` and replace the placeholder with your App ID:

```
NEXT_PUBLIC_PRIVY_APP_ID=your-actual-app-id
```

### 3. Install and Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Verify

Click **Get Started**, sign in with any enabled provider, and you should see the dashboard with your wallet address and SOL balance. If you see it, you're all set.

## How It Works

### Authentication Flow

1. User visits the landing page and clicks **Get Started**
2. Privy opens a modal with the configured login methods
3. After authentication, Privy auto-creates an embedded Solana wallet
4. The user is redirected to `/dashboard`
5. The dashboard displays wallet address, SOL balance, linked accounts, and a message signing demo

### Session Management

Privy manages authentication state client-side through the `usePrivy()` hook. The `ready` boolean indicates the Privy client has finished initializing, and `authenticated` indicates the user has an active session.

For production apps, consider [cookie-based sessions](https://docs.privy.io/recipes/react/cookies) for SSR support and improved security.

```tsx
import { usePrivy } from '@privy-io/react-auth'

const { ready, authenticated, user } = usePrivy()
// ready:         Privy client has finished initializing
// authenticated: user has an active session
// user:          authenticated user object (or null)
```

### Protected Routes

The `AuthGuard` component wraps pages that require authentication. It checks `ready` and `authenticated` state, shows a loading skeleton during initialization, and redirects unauthenticated users to the home page.

For production, consider [server-side middleware](https://docs.privy.io/guide/react/configuration/cookies) for route protection before the page loads.

```tsx
// components/auth/auth-guard.tsx (simplified)
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && !authenticated) router.replace('/')
  }, [ready, authenticated, router])

  if (!ready) return <LoadingSkeleton />
  if (!authenticated) return null
  return <>{children}</>
}
```

### Embedded Wallet

Privy automatically creates a non-custodial Solana wallet on first login when configured with `createOnLogin: 'users-without-wallets'`. The wallet is:

- **Created on login** -- no extra steps for the user
- **Non-custodial** -- only the user controls the private key
- **Persistent** -- survives across sessions and devices

If auto-creation doesn't trigger, the dashboard shows a **Create Wallet** fallback button. The three `createOnLogin` options are `'all-users'`, `'users-without-wallets'`, and `'off'`. See the [embedded wallet docs](https://docs.privy.io/guide/react/wallets/embedded/solana/creation) for details.

```tsx
// components/providers/privy-provider.tsx (config excerpt)
<PrivyProvider
  appId={PRIVY_APP_ID}
  config={{
    loginMethods: ['google', 'github', 'discord', 'twitter', 'email'],
    embeddedWallets: {
      solana: {
        createOnLogin: 'users-without-wallets',
      },
    },
  }}
>
```

## Environment Variables

| Variable                   | Required | Description                                                             |
| -------------------------- | -------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Yes      | Your Privy App ID from [dashboard.privy.io](https://dashboard.privy.io) |

## Key Hooks

| Hook                | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `usePrivy()`        | Auth state, user object, `ready` and `authenticated` flags        |
| `useLogin()`        | Trigger the Privy login modal with `onComplete` callback          |
| `useLogout()`       | End the user's session with `onSuccess` callback                  |
| `useWallets()`      | Access embedded Solana wallets from `@privy-io/react-auth/solana` |
| `useCreateWallet()` | Manually create an embedded wallet if auto-creation is off        |

## Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page (auto-redirects if logged in)
│   ├── dashboard/page.tsx      # User profile, wallet, actions
│   └── protected/page.tsx      # Auth-guarded demo route
├── components/
│   ├── auth/
│   │   ├── auth-guard.tsx      # Client-side route protection
│   │   ├── auth-status.tsx     # Header auth badge
│   │   ├── login-button.tsx    # Privy login trigger
│   │   └── logout-button.tsx   # Privy logout trigger
│   ├── dashboard/
│   │   ├── actions-panel.tsx   # Message signing demo
│   │   ├── user-panel.tsx      # Profile + linked accounts
│   │   └── wallet-panel.tsx    # Wallet address, SOL balance, create
│   ├── providers/
│   │   ├── privy-provider.tsx  # Privy config + env guard
│   │   └── theme-provider.tsx  # Dark/light theme
│   ├── ui/                     # shadcn/ui components
│   └── header.tsx              # Nav + auth status
├── types/privy.ts              # PrivyUserSummary, WalletSummary, SessionInfo
├── .env.example                # Environment variable template
├── og-image.png                # 1200x630 gallery image
└── package.json
```

## Not Included

- **No mainnet support** -- devnet only, this is a demo template
- **No external wallet connections** -- no Phantom or Solflare; this demonstrates Privy embedded wallets
- **No token transfers or SPL interactions** -- message signing is the canonical wallet demo
- **No cookie-based SSR sessions** -- documented above as a production best practice, not implemented
- **No middleware route protection** -- documented above as a production option, not implemented

## Resources

- [Privy Solana Getting Started](https://docs.privy.io/recipes/solana/getting-started-with-privy-and-solana)
- [Privy React Quickstart](https://docs.privy.io/basics/react/quickstart)
- [Privy Cookie Sessions](https://docs.privy.io/recipes/react/cookies)
- [Privy Embedded Wallets (Solana)](https://docs.privy.io/guide/react/wallets/embedded/solana/creation)
- [Privy Dashboard](https://dashboard.privy.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
