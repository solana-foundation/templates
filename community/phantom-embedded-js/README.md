# Phantom Embedded JS

A vanilla JavaScript/TypeScript starter for integrating Phantom's embedded wallet SDK. Users can sign in with Google or Apple OAuth—no browser extension required.

## Quick Start

### 1. Prerequisites

- **Node.js 18+**
- **Phantom Portal App ID** — Register at [phantom.com/portal](https://phantom.com/portal/) and add:
  - `http://localhost:5173` as an allowed origin URL
  - `http://localhost:5173/` as an allowed redirect URL

### 2. Create and configure

```bash
npx create-solana-dapp@latest <your-app-name> --template phantom-embedded-js
cd <your-app-name>
cp .env.example .env
```

Add your App ID to `.env`:

```env
VITE_PHANTOM_APP_ID=your-app-id-from-portal
VITE_REDIRECT_URL=http://localhost:5173/
```

### 3. Run

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## What's in This Template

```
├── src/
│   ├── main.ts       # App entry point & session handling
│   ├── phantom.ts    # SDK wrapper (connect, disconnect, sign, send)
│   ├── solana.ts     # Balance fetching via @solana/web3.js
│   ├── ui.ts         # UI state management
│   └── styles.css    # Styles with light/dark theme support
├── index.html
└── .env.example
```

The template is pre-configured with:

- Google and Apple OAuth providers
- Solana address type enabled
- Message signing and transaction sending examples
- Light/dark theme toggle

## Common Issues

**"Invalid redirect URL"** — Your `.env` redirect URL must exactly match what's in Phantom Portal (including trailing slash).

**"Missing App ID"** — Ensure `VITE_PHANTOM_APP_ID` is set in `.env` and restart the dev server.

**Balance fetch error** — Make sure `VITE_SOLANA_RPC_URL` points to a valid Solana RPC endpoint. For production, use a dedicated provider like [Helius](https://helius.dev) or [QuickNode](https://quicknode.com).

## Deployment

Add these environment variables to your hosting platform:

- `VITE_PHANTOM_APP_ID`
- `VITE_REDIRECT_URL` (update to your production callback URL)
- `VITE_SOLANA_RPC_URL` (optional, defaults to mainnet-beta)

Remember to add your production redirect URL to Phantom Portal.

## Learn More

- [Phantom SDK Documentation](https://docs.phantom.com/wallet-sdks-overview) — Full API reference and examples
- [Phantom Portal](https://phantom.com/portal/) — Manage your app settings
- [@phantom/browser-sdk](https://www.npmjs.com/package/@phantom/browser-sdk) — Package details and changelog

## License

MIT
