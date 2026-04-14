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

- [Phantom SDK Documentation](https://docs.phantom.com/wallet-sdks-overview) — Full API reference and examples
- [Phantom Portal](https://phantom.com/portal/) — Manage your app settings
- [@phantom/browser-sdk](https://www.npmjs.com/package/@phantom/browser-sdk) — Package details and changelog

## License

MIT
