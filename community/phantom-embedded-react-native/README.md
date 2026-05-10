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
