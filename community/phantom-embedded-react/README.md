# Phantom Embedded Wallet - React Starter

A Next.js starter for integrating Phantom's embedded wallet SDK. Users can sign in with Google, Apple, email, or their existing Phantom wallet—no browser extension required.

## Quick Start

### 1. Prerequisites

- **Node.js 18+**
- **Phantom Portal App ID** — Register at [phantom.com/portal](https://phantom.com/portal/) and add:
  - `http://localhost:3000` as an allowed origin URL
  - `http://localhost:3000/auth/callback` as an allowed redirect URL

### 2. Create and configure

```bash
npx create-solana-dapp@latest <your-app-name> --template phantom-embedded-react
cd <your-app-name>
cp .env.example .env.local
```

Add your App ID to `.env.local`:

```env
NEXT_PUBLIC_PHANTOM_APP_ID=your-app-id-from-portal
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's in This Template

```
├── app/
│   ├── layout.tsx          # PhantomProvider setup
│   ├── page.tsx            # Demo page with connect button
│   └── auth/callback/      # OAuth redirect handler
├── components/
│   ├── providers.tsx       # SDK configuration
│   └── connect-button.tsx  # Example wallet UI
└── .env.example
```

The template is pre-configured with:

- Google, Apple, and injected wallet auth providers
- Solana address type enabled
- SSR-safe component patterns for Next.js
- Dark theme

## Common Issues

**"Invalid redirect URL"** — Your `.env.local` redirect URL must exactly match what's in Phantom Portal (including `http` vs `https`).

**"window is not defined"** — Use Next.js `dynamic()` imports with `ssr: false` for components that access wallet state. See `app/page.tsx` for the pattern.

**Wallet disconnects on refresh** — Check that cookies aren't blocked and your `appId` is correct.

## Deployment

Add these environment variables to your hosting platform:

- `NEXT_PUBLIC_PHANTOM_APP_ID`
- `NEXT_PUBLIC_REDIRECT_URL` (update to your production callback URL)

Remember to add your production redirect URL to Phantom Portal.

## Learn More

- [Phantom SDK Documentation](https://docs.phantom.com/wallet-sdks-overview) — Full API reference, hooks, and examples
- [Phantom Portal](https://phantom.com/portal/) — Manage your app settings
- [@phantom/react-sdk](https://www.npmjs.com/package/@phantom/react-sdk) — Package details and changelog
- [Recipes & Code Snippets](https://docs.phantom.com/resources/recipes) — Common patterns for signing, transactions, multi-chain

## License

MIT
