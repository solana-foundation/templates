# Privy Auth — Solana dApp Template

A Next.js 16 + Tailwind 4 + TypeScript community template demonstrating [Privy](https://privy.io)-based authentication on Solana. Ships with social logins, auto-created embedded wallets, protected routes, and a polished dark UI — ready to extend.

---

## Features

- **Social login** — Google, Twitter, Discord, GitHub, Apple via Privy modal
- **Embedded Solana wallet** — created automatically for users who don't bring their own
- **Protected routes** — `/dashboard` redirects unauthenticated users to `/`
- **User profile card** — avatar, email, linked social accounts with sign-out
- **Wallet card** — truncated address, copy-to-clipboard, Solana Explorer link
- **Auth status indicator** — animated dot synced to Privy's `ready`/`authenticated` state
- **TypeScript-first** — typed `PrivyUser`, `PrivyWallet`, `AuthStatus` definitions

---

## Quick Start

### 1. Create a Privy account

Go to [dashboard.privy.io](https://dashboard.privy.io) and create a new app. Copy your **App ID** from the dashboard.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# Optional — for enhanced security
NEXT_PUBLIC_PRIVY_CLIENT_ID=your-privy-client-id
```

### 3. Install dependencies and run

```bash
npm install
npm run dev
# or
yarn && yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Privy Dashboard Configuration

### Enable login methods

In your Privy dashboard → **Login Methods**, enable any combination of:

| Method | Notes |
|---|---|
| Email | OTP sent to user's email |
| Google | Requires Google OAuth app |
| Twitter / X | Requires Twitter OAuth app |
| Discord | Requires Discord app |
| GitHub | Requires GitHub OAuth app |
| Apple | Requires Apple Developer account |

### Allowed origins

Add `http://localhost:3000` (dev) and your production URL to **Allowed Origins** in dashboard settings.

### Appearance

Customize colors in `providers/provider.tsx`:

```ts
appearance: {
  theme: 'dark',
  accentColor: '#6366f1', // change to your brand color
},
```

---

## Project Structure

```
privy-auth/
├── app/
│   ├── layout.tsx           # Root layout — wraps everything in PrivyProvider
│   ├── page.tsx             # Landing page — hero, feature grid, login CTA
│   ├── globals.css          # Design tokens, card styles, glow utilities
│   └── dashboard/
│       ├── layout.tsx       # Auth guard — redirects to / if unauthenticated
│       └── page.tsx         # Protected page — profile, wallet, quick links
├── providers/
│   └── provider.tsx         # PrivyProvider config (social methods, appearance, embedded wallet)
└── src/
    ├── components/
    │   ├── LoginButton.tsx  # Login/logout button with glow + loading state
    │   ├── UserProfile.tsx  # Avatar, name, email, linked accounts, sign-out
    │   ├── WalletCard.tsx   # Embedded wallet address, copy, Explorer link
    │   └── AuthStatus.tsx   # Animated status dot (Connected / Connecting / Not connected)
    ├── hooks/

    ├── lib/
    │   └── utils.ts         # cn(), truncateAddress(), getInitials()
    └── types/
        └── privy.ts         # PrivyUser, PrivyWallet, AuthStatus, AuthState types
```

---

## Embedded Wallets

Privy automatically creates a Solana wallet for users who sign in without a wallet. This is configured in `providers/provider.tsx`:

```ts
embeddedWallets: {
  solana: {
    createOnLogin: 'users-without-wallets',
  },
},
```

Options:
- `'users-without-wallets'` — only create if the user has no existing wallet (default)
- `'all-users'` — always create an embedded wallet

The wallet address is surfaced in `WalletCard` via Privy's `useWallets()` hook directly.

---

## Session Management

Privy handles session persistence automatically via browser storage. Key behaviors:

- Sessions persist across page refreshes
- `usePrivy().ready` is `false` until Privy has hydrated — always gate UI on `ready`
- `usePrivy().authenticated` is the source of truth for auth state
- `logout()` clears the Privy session and any embedded wallet keys from the browser

For the auth guard pattern used in this template:

```tsx
// app/dashboard/layout.tsx
const { ready, authenticated } = usePrivy();
useEffect(() => {
  if (ready && !authenticated) router.replace('/');
}, [ready, authenticated]);
```

---

## Useful Links

- [Privy Docs](https://docs.privy.io)
- [Privy Dashboard](https://dashboard.privy.io)
- [Privy React Auth SDK](https://docs.privy.io/basics/react)
- [Privy Solana Guide](https://docs.privy.io/wallets/solana)
- [Solana Foundation Templates](https://github.com/solana-foundation/templates)
