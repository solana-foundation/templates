# Phantom Embedded Wallet - React Native Starter

An Expo starter for integrating Phantom's embedded wallet SDK on mobile. This template configures Google and Apple sign-in, with Solana and Ethereum wallet addresses. No browser extension is required.

**Note:** This template requires a custom development build and will NOT work with Expo Go. The Phantom React Native SDK requires native modules that are not available in Expo Go.

## Quick Start

### 1. Prerequisites

- **Node.js 20.19.4 or newer**, compatible with this template's React Native 0.81.5 and [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/).
- **Phantom Portal access and an App ID**. Confirm that you can create or access an app at [Phantom Portal](https://phantom.com/portal/) before proceeding. A placeholder App ID cannot authenticate. If new registrations are paused or your account cannot create an app, follow the portal's access instructions or contact [Phantom support](https://help.phantom.com/). This is an external prerequisite, not a local configuration error.
- **Android:** Android Studio and the Android SDK, with an emulator or connected device. See [Expo's Android environment setup](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated).
- **iOS:** macOS and Xcode for a local native build. Windows cannot run `expo run:ios` locally.

### 2. Create and configure

```bash
npx create-solana-dapp@latest <your-app-name> --template phantom-embedded-react-native-starter
cd <your-app-name>
npm install
```

The template name matches the repository's [template catalog](https://github.com/solana-foundation/templates/blob/main/TEMPLATES.md). If your CLI cannot resolve the catalog name, use the explicit repository template instead:

```bash
npx create-solana-dapp@latest <your-app-name> --template gh:solana-foundation/templates/community/phantom-embedded-react-native
```

Copy `.env.example` to `.env` (`cp .env.example .env` in a Unix shell, or `Copy-Item .env.example .env` in PowerShell). Add your App ID:

```env
EXPO_PUBLIC_PHANTOM_APP_ID=your-app-id-here
EXPO_PUBLIC_APP_SCHEME=phantomwallet
EXPO_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

Keep `EXPO_PUBLIC_APP_SCHEME` equal to `expo.scheme` in `app.json`. The default callback is `phantomwallet://phantom-auth-callback`; add that complete URL to your app's allowed redirect URLs in Phantom Portal. If you customize the scheme, update both files and the portal entry, then rebuild the native app.

Before building, replace `expo.ios.bundleIdentifier` and `expo.android.package` in `app.json` with your own reverse-domain identifiers. The `com.example.phantomwallet` values are placeholders. For iOS signing, select your own Apple development team when required; no author's team ID is included.

The SDK receives `EXPO_PUBLIC_PHANTOM_APP_ID` in the client. Do not put private keys or service secrets in `EXPO_PUBLIC_*` variables.

You can use pnpm instead of npm: run `pnpm install` and use `pnpm run` for the commands below. Use one package manager per generated project; do not bypass dependency errors with `--legacy-peer-deps`.

### 3. Run

**For iOS:**

```bash
npm run ios
```

**For Android:**

```bash
npm run android
```

## What's in This Template

Native builds initialize Web Crypto before the Phantom SDK through `lib/crypto.native.ts`. The random-values polyfill alone does not provide the `crypto.subtle` methods used during authentication. Web builds use the browser's native implementation. Rebuild your native app after changing native dependencies.

`app/+native-intent.tsx` keeps the SDK's OAuth callback on the welcome route while Phantom processes the original linking event. Once the SDK reports a connected session, the connect component redirects to the dashboard, including after session restoration.

```
├── app/
│   ├── _layout.tsx          # PhantomProvider setup (crypto initialization must be first)
│   ├── +native-intent.tsx   # OAuth callback routing
│   ├── index.tsx            # Demo page with connect button
│   └── wallet.tsx           # Wallet screen with account info
├── components/
│   ├── ConnectButton.tsx    # Example wallet UI
│   └── WalletInfo.tsx       # Balance and address display
├── lib/
│   ├── crypto.native.ts     # Native Web Crypto initialization
│   ├── crypto.ts            # Browser Web Crypto entry point
│   ├── solana.ts            # Solana balance fetching
│   └── utils.ts             # Utility functions
└── .env.example
```

The template is pre-configured with:

- Google and Apple auth providers
- Solana and Ethereum address types enabled
- Deep linking for OAuth callbacks
- Dark theme

## Common Issues

**"Invalid redirect URL"** — The app reads `EXPO_PUBLIC_APP_SCHEME`, not `EXPO_PUBLIC_REDIRECT_URL`. Set the same scheme in `.env` and `app.json`, and allowlist the complete `{scheme}://phantom-auth-callback` URL in Phantom Portal (e.g., `phantomwallet://phantom-auth-callback`).

**"Template not found"** — Use the catalog name `phantom-embedded-react-native-starter` or the explicit `gh:solana-foundation/templates/community/phantom-embedded-react-native` identifier above, not the directory name alone.

**Portal signup or app creation is unavailable** — Local setup cannot remove this restriction. Obtain access through Phantom before testing authentication. The separate MCP integration below does not supply an App ID for this mobile template.

**Dependency installation fails** — Check `node --version` against the prerequisite above and use the current template, which aligns React types with React Native 0.81.5. Run `npx expo install --check` to check Expo package compatibility before building.

**"Module not found: react-native-get-random-values"** — Install the template's dependencies and keep `import '../lib/crypto'` as the first import in `app/_layout.tsx`. Native builds resolve `lib/crypto.native.ts`, which initializes both random values and Web Crypto before Phantom loads. Rebuild the native app after changing native dependencies; importing the random-values polyfill alone does not provide `crypto.subtle`.

**"Expo Go not working"** — Expected behavior. Expo Go doesn't support the native modules required by Phantom SDK. You must create a development build.

**"Deep linking not working"** — Rebuild the app after changing the URL scheme in `app.json` or `.env`. Verify the redirect URI is added in Phantom Portal.

**"Failed to fetch balance"** — Check that your RPC endpoint is reachable. For production, consider using a dedicated RPC provider like Helius, QuickNode, or Alchemy.

## Deployment

Add these environment variables to your build configuration:

- `EXPO_PUBLIC_PHANTOM_APP_ID`
- `EXPO_PUBLIC_APP_SCHEME` (must match your app's URL scheme)
- `EXPO_PUBLIC_SOLANA_RPC_URL` (update to your production RPC endpoint)

Remember to add your production redirect URL to Phantom Portal.

## Claude / AI Agent Setup

This template works with the [Phantom MCP server](https://www.npmjs.com/package/@phantom/mcp-server), giving AI assistants like Claude direct access to your embedded wallet — checking balances, sending transactions, signing messages, and trading perpetuals on Hyperliquid.

### Setup (Claude Desktop)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "phantom": {
      "command": "npx",
      "args": ["-y", "@phantom/mcp-server@latest"]
    }
  }
}
```

Restart Claude Desktop. On first use, a browser window opens to authenticate your Phantom wallet. No Phantom Portal App ID required — the MCP server handles its own authentication.

### Available tools (28)

**Wallet & balances**

- `get_connection_status` — Local connection check (no API call)
- `get_wallet_addresses` — Solana, Ethereum, Bitcoin, and Sui addresses
- `get_token_balances` — All token balances with live USD prices
- `get_token_allowance` — ERC-20 allowance for a spender on EVM

**Transactions**

- `send_solana_transaction` — Sign and broadcast a Solana transaction (with simulation preview)
- `send_evm_transaction` — Sign and broadcast an EVM transaction
- `transfer_tokens` — Transfer SOL, SPL tokens, or EVM native/tokens
- `buy_token` — Swap via Phantom routing (Solana, EVM, cross-chain)
- `simulate_transaction` — Preview asset changes without submitting

**Signing**

- `sign_solana_message` — Sign a UTF-8 message on Solana
- `sign_evm_personal_message` — EIP-191 personal sign on EVM
- `sign_evm_typed_data` — EIP-712 typed data (DeFi permits, order signing)

**Auth & misc**

- `phantom_login` — Trigger wallet authentication
- `pay_api_access` — Pay for API access
- `portfolio_rebalance` — Rebalance token portfolio

**Perpetuals — Hyperliquid (13 tools)**

- `deposit_to_hyperliquid` — Bridge tokens into your Hyperliquid perp account
- `get_perp_account` — Account balance and available margin
- `get_perp_markets` — Markets with price, funding rate, open interest, and max leverage
- `get_perp_positions` — Open positions with PnL and liquidation price
- `get_perp_orders` — Open limit, take-profit, and stop-loss orders
- `get_perp_trade_history` — Historical fills and closed PnL
- `open_perp_position` — Open a long/short with configurable leverage
- `close_perp_position` — Full or partial close via market order
- `cancel_perp_order` — Cancel an open order by ID
- `update_perp_leverage` — Change leverage and margin type (isolated/cross)
- `transfer_spot_to_perps` — Move USDC from Hypercore spot to perp
- `withdraw_from_perps` — Move USDC from perp back to spot
- `withdraw_from_hyperliquid_spot` — Withdraw from Hyperliquid spot to wallet

## Learn More

- [Phantom SDK Documentation](https://docs.phantom.com/wallet-sdks-overview) — Full API reference, hooks, and examples
- [Phantom Portal](https://phantom.com/portal/) — Manage your app settings
- [@phantom/react-native-sdk](https://www.npmjs.com/package/@phantom/react-native-sdk) — Package details and changelog
- [Recipes & Code Snippets](https://docs.phantom.com/resources/recipes) — Common patterns for signing, transactions, multi-chain

## License

MIT
