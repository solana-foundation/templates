<p align="center">
  <img src="https://solana.com/src/img/branding/solanaLogoMark.svg" height="60" alt="Solana" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://auth.privy.io/logos/privy-logo.png" height="60" alt="Privy" />
</p>

<h1 align="center">privy-auth</h1>

<p align="center">
  <strong>Solana dApp template with Privy authentication</strong>
</p>

<p align="center">
  Social logins &bull; Embedded wallets &bull; Protected routes &bull; Ready to ship
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#setup-guide">Setup</a> &bull;
  <a href="#customization">Customize</a> &bull;
  <a href="#resources">Resources</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Solana-web3.js-9945FF?logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/Privy-Auth-6A6FF5" alt="Privy" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT" />
</p>

---

## Quick Start

```bash
# Scaffold with create-solana-dapp (recommended)
pnpm create solana-dapp --template privy-auth

# Or clone directly
npx degit solana-developers/solana-templates/community/privy-auth my-app
cd my-app && pnpm install
```

<details>
<summary><strong>npm / yarn</strong></summary>

```bash
# npm
npx create-solana-dapp --template privy-auth

# yarn
yarn create solana-dapp --template privy-auth
```

</details>

---

## Features

```
+-------------------+      +-------------------+      +-------------------+
|   Social Login    |      | Embedded Wallets  |      | Protected Routes  |
|                   |      |                   |      |                   |
|  Google           |      |  Auto-created     |      |  Middleware guard  |
|  Twitter/X        |      |  Solana wallet    |      |  Client-side      |
|  Discord          |      |  for every user   |      |  auth check       |
|  Email            |      |  on login         |      |                   |
+-------------------+      +-------------------+      +-------------------+

+-------------------+      +-------------------+      +-------------------+
| External Wallets  |      |  Sign Messages    |      |  Wallet State     |
|                   |      |                   |      |                   |
|  Phantom          |      |  Demo component   |      |  useSolanaWallet  |
|  Solflare         |      |  to sign with     |      |  hook for easy    |
|  Backpack         |      |  embedded wallet  |      |  wallet access    |
|  + more           |      |                   |      |                   |
+-------------------+      +-------------------+      +-------------------+
```

---

## Tech Stack

| | Technology | Version |
|---|-----------|---------|
| **Framework** | Next.js (App Router) | ^15.3 |
| **Language** | TypeScript | ^5 |
| **Styling** | Tailwind CSS | ^4 |
| **Auth** | Privy React SDK | ^2.24 |
| **Blockchain** | Solana web3.js | ^1.98 |
| **Tokens** | SPL Token | ^0.4 |

---

## Setup Guide

### 1. Create a Privy App

> **Takes ~2 minutes.** Free tier is all you need.

1. Go to **[dashboard.privy.io](https://dashboard.privy.io)** and sign up
2. Click **Create App**
3. Enable login methods in the sidebar:

   | Method | Toggle |
   |--------|--------|
   | Google | On |
   | Twitter | On |
   | Discord | On |
   | Email | On |
   | Wallet | On |

4. Go to **Embedded Wallets** > ensure **Solana** is enabled
5. Go to **Settings > API Keys** > copy your **App ID**

### 2. Environment Variables

```bash
cp .env.example .env.local
```

```env
# Required
NEXT_PUBLIC_PRIVY_APP_ID=cmxxxxxxxxxxxxxxxxx

# Optional — for server-side token verification
PRIVY_APP_SECRET=privy_app_secret_xxxxxxxxx

# Optional — defaults to devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

### 3. Run

```bash
pnpm install
pnpm dev
```

Open **[localhost:3000](http://localhost:3000)** — you should see the landing page.

> If you see "Missing Privy App ID", double-check your `.env.local` file.

---

## Project Structure

```
privy-auth/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx .............. Root layout with PrivyProvider
│   │   ├── page.tsx ............... Landing page + login button
│   │   ├── globals.css ............ Dark theme + Tailwind
│   │   └── dashboard/
│   │       └── page.tsx ........... Protected dashboard
│   │
│   ├── components/
│   │   ├── providers.tsx .......... Privy config (logins, wallets, theme)
│   │   ├── login-button.tsx ....... Opens modal, redirects on success
│   │   ├── user-profile.tsx ....... User ID, wallets, linked accounts
│   │   ├── wallet-info.tsx ........ Status indicators (green/red dots)
│   │   └── sign-message.tsx ....... Sign demo with embedded wallet
│   │
│   ├── hooks/
│   │   └── use-solana-wallet.ts ... Extract wallets from Privy user
│   │
│   └── types/
│       └── privy.ts ............... Type helpers for wallet filtering
│
├── middleware.ts ................... Route guard (privy-token cookie)
├── .env.example ................... Environment variable template
└── package.json ................... Deps + create-solana-dapp config
```

---

## How It Works

### Auth Flow

```
                    ┌─────────────────────┐
                    │    Landing Page      │
                    │    (page.tsx)        │
                    └──────────┬──────────┘
                               │
                    Click "Sign In with Privy"
                               │
                    ┌──────────▼──────────┐
                    │    Privy Modal       │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ Google        │  │
                    │  │ Twitter/X     │  │
                    │  │ Discord       │  │
                    │  │ Email         │  │
                    │  │ Wallet        │  │
                    │  └───────────────┘  │
                    └──────────┬──────────┘
                               │
                    User authenticates
                               │
                    ┌──────────▼──────────┐
                    │  Embedded Solana     │
                    │  wallet created      │
                    │  automatically       │
                    └──────────┬──────────┘
                               │
                    privy-token cookie set
                               │
                    ┌──────────▼──────────┐
                    │    /dashboard        │
                    │                     │
                    │  Profile + Wallets  │
                    │  Sign Message Demo  │
                    │  Logout             │
                    └─────────────────────┘
```

### Route Protection

Two layers keep `/dashboard` secure:

| Layer | File | What it does |
|-------|------|-------------|
| **Middleware** | `middleware.ts` | No `privy-token` cookie? Redirect to `/` |
| **Client** | `dashboard/page.tsx` | `usePrivy()` not authenticated? Redirect to `/` |

---

## Customization

<details>
<summary><strong>Change Login Methods</strong></summary>

Edit `src/components/providers.tsx`:

```tsx
loginMethods: ["google", "twitter", "discord", "email", "wallet"],
```

Available: `"google"`, `"twitter"`, `"discord"`, `"email"`, `"wallet"`, `"apple"`, `"github"`, `"linkedin"`, `"tiktok"`, `"farcaster"`, `"phone"`

> Also toggle matching methods in **[Privy Dashboard](https://dashboard.privy.io) > Login Methods**.

</details>

<details>
<summary><strong>Change Theme & Appearance</strong></summary>

```tsx
// src/components/providers.tsx
appearance: {
  theme: "dark",              // "dark" | "light"
  accentColor: "#9945FF",     // any hex color
  showWalletLoginFirst: false, // wallet options first?
  walletChainType: "solana-only",
},
```

</details>

<details>
<summary><strong>Change Embedded Wallet Behavior</strong></summary>

```tsx
// src/components/providers.tsx
embeddedWallets: {
  solana: {
    createOnLogin: "all-users",
    // "all-users"              — wallet for everyone
    // "users-without-wallets"  — only if no external wallet
    // "off"                    — no auto-creation
  },
},
```

</details>

<details>
<summary><strong>Use the Wallet Hook</strong></summary>

```tsx
import { useSolanaWallet } from "@/hooks/use-solana-wallet";

function MyComponent() {
  const { embedded, external, all, ready, authenticated } = useSolanaWallet();

  // embedded  — { address, walletClientType, isEmbedded } | null
  // external  — array of connected external wallets
  // all       — all Solana wallets combined
}
```

</details>

<details>
<summary><strong>Sign Messages</strong></summary>

```tsx
import { useSignMessage } from "@privy-io/react-auth/solana";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";

function MyComponent() {
  const { embedded } = useSolanaWallet();
  const { signMessage } = useSignMessage();

  const handleSign = async () => {
    const msg = new TextEncoder().encode("Hello, Solana!");
    const sig = await signMessage({
      message: msg,
      options: { address: embedded!.address },
    });
    console.log("Signature:", Buffer.from(sig).toString("base64"));
  };
}
```

</details>

<details>
<summary><strong>Add a New Protected Route</strong></summary>

1. Create `src/app/dashboard/settings/page.tsx`
2. Middleware already covers `/dashboard/*` — no config needed
3. Add the client guard:

```tsx
"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) router.replace("/");
  }, [ready, authenticated, router]);

  if (!ready) return <p>Loading...</p>;
  if (!authenticated) return null;

  return <div>Your protected content</div>;
}
```

</details>

<details>
<summary><strong>Switch to Mainnet</strong></summary>

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

For production, use [Helius](https://helius.dev), [QuickNode](https://quicknode.com), or [Triton](https://triton.one).

</details>

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server at `localhost:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## Troubleshooting

<details>
<summary><strong>"Missing Privy App ID" screen</strong></summary>

Set `NEXT_PUBLIC_PRIVY_APP_ID` in `.env.local`. Get it from [dashboard.privy.io](https://dashboard.privy.io) > Settings > API Keys.

</details>

<details>
<summary><strong>Social login not working</strong></summary>

Enable the method in **both** places:
1. `providers.tsx` > `loginMethods` array
2. [Privy Dashboard](https://dashboard.privy.io) > Login Methods

</details>

<details>
<summary><strong>Embedded wallet not created</strong></summary>

Check `embeddedWallets.solana.createOnLogin` is `"all-users"` in `providers.tsx`. Also enable **Embedded Wallets > Solana** in the Privy Dashboard.

</details>

<details>
<summary><strong>Hydration errors in console</strong></summary>

Usually browser extensions (wallets, ad blockers) injecting DOM elements. Cosmetic only — doesn't affect functionality.

</details>

---

## Resources

| | Link |
|---|------|
| Privy Docs | [docs.privy.io](https://docs.privy.io) |
| Privy + Solana Guide | [Getting Started](https://docs.privy.io/recipes/solana/getting-started-with-privy-and-solana) |
| Privy Dashboard | [dashboard.privy.io](https://dashboard.privy.io) |
| Privy SDK Reference | [React Auth](https://docs.privy.io/reference/sdk/react-auth) |
| Solana Docs | [solana.com/docs](https://solana.com/docs) |
| create-solana-dapp | [GitHub](https://github.com/solana-developers/create-solana-dapp) |
| Solana Templates | [GitHub](https://github.com/solana-developers/solana-templates) |

---

<p align="center">
  <strong>Built with Privy + Solana</strong>
  <br />
  <sub>MIT License</sub>
</p>
