# Phantom Embedded Wallet - React Native Starter

An Expo starter for integrating Phantom's embedded wallet SDK on mobile. Users can sign in with Google, Apple, email, or their existing Phantom wallet—no browser extension required.

**Note:** This template requires a custom development build and will NOT work with Expo Go. The Phantom React Native SDK requires native modules that are not available in Expo Go.

## Quick Start

### 1. Prerequisites

- **Node.js 18+**
- **Phantom Portal App ID** — Register at [phantom.com/portal](https://phantom.com/portal/) and add:
  - Your app's URL scheme (e.g., `phantomwallet://phantom-auth-callback`) as an allowed redirect URL

### 2. Create and configure

```bash
npx create-solana-dapp@latest <your-app-name> --template phantom-embedded-react-native
cd <your-app-name>
cp .env.example .env
```

Add your App ID and configuration to `.env`:

```env
EXPO_PUBLIC_PHANTOM_APP_ID=your-app-id-here
EXPO_PUBLIC_APP_SCHEME=your-app-scheme
EXPO_PUBLIC_SOLANA_RPC_URL=your-prefered-rpc
```

### 3. Run

**For iOS:**

```bash
pnpm run ios
```

**For Android:**

```bash
pnpm run android
```

## What's in This Template

```
├── app/
│   ├── _layout.tsx          # PhantomProvider setup (polyfill import must be first)
│   ├── index.tsx            # Demo page with connect button
│   └── wallet.tsx           # Wallet screen with account info
├── components/
│   ├── ConnectButton.tsx    # Example wallet UI
│   └── WalletInfo.tsx       # Balance and address display
├── lib/
│   ├── solana.ts            # Solana balance fetching
│   └── utils.ts             # Utility functions
└── .env.example
```

The template is pre-configured with:

- Google, Apple, and injected wallet auth providers
- Solana address type enabled
- Deep linking for OAuth callbacks
- Dark theme

## Common Issues

**"Invalid redirect URL"** — Your redirect URL in `.env` must exactly match what's in Phantom Portal. The format is `{scheme}://phantom-auth-callback` (e.g., `phantomwallet://phantom-auth-callback`).

**"Module not found: react-native-get-random-values"** — Ensure the polyfill is imported first in `app/_layout.tsx` before any other imports.

**"Expo Go not working"** — Expected behavior. Expo Go doesn't support the native modules required by Phantom SDK. You must create a development build.

**"Deep linking not working"** — Rebuild the app after changing the URL scheme in `app.json` or `.env`. Verify the redirect URI is added in Phantom Portal.

**"Failed to fetch balance"** — Check that your RPC endpoint is reachable. For production, consider using a dedicated RPC provider like Helius, QuickNode, or Alchemy.

## Deployment

Add these environment variables to your build configuration:

- `EXPO_PUBLIC_PHANTOM_APP_ID`
- `EXPO_PUBLIC_APP_SCHEME` (must match your app's URL scheme)
- `EXPO_PUBLIC_SOLANA_RPC_URL` (update to your production RPC endpoint)

Remember to add your production redirect URL to Phantom Portal.

## Learn More

- [Phantom SDK Documentation](https://docs.phantom.com/wallet-sdks-overview) — Full API reference, hooks, and examples
- [Phantom Portal](https://phantom.com/portal/) — Manage your app settings
- [@phantom/react-native-sdk](https://www.npmjs.com/package/@phantom/react-native-sdk) — Package details and changelog
- [Recipes & Code Snippets](https://docs.phantom.com/resources/recipes) — Common patterns for signing, transactions, multi-chain

## License

MIT
