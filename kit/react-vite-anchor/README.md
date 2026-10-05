# vite-anchor

React + Vite starter with Tailwind CSS, Kit 8 RPC/wallet plugins, `@solana/react`, and an Anchor vault program example.

## Getting Started

Requires Node.js 24 or newer. Wallets must be configured for devnet.

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/react-vite-anchor
```

```shell
npm install   # Uses the checked-in program client; no Rust build is required
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), connect your wallet, and interact with the vault on devnet.

## What's Included

- **Wallet connection** via the Kit wallet plugin with Wallet Standard discovery and account updates
- **Version 1 transactions** configured through the Kit RPC plugin
- **SOL Vault program** - deposit and withdraw SOL from a personal PDA vault
- **Codama-generated client** - type-safe program interactions using `@solana/kit`
- **Tailwind CSS v4** with light/dark mode

## Stack

| Layer          | Technology                                     |
| -------------- | ---------------------------------------------- |
| Frontend       | React 19, Vite, TypeScript                     |
| Styling        | Tailwind CSS v4                                |
| Solana Client  | Kit 8, Kit RPC/wallet plugins, `@solana/react` |
| Program Client | Codama-generated, `@solana/kit`                |
| Program        | Anchor (Rust)                                  |

## Project Structure

```
├── src/
│   ├── App.tsx               # Main app with wallet UI
│   ├── VaultCard.tsx         # Vault deposit/withdraw UI
│   ├── providers.tsx         # Solana client setup
│   ├── generated/vault/      # Codama-generated program client
│   └── main.tsx              # Entry point
├── anchor/                   # Anchor workspace
│   └── programs/vault/       # Vault program (Rust)
└── codama.json               # Codama client generation config
```

## Deploy Your Own Vault

The included vault program is already deployed to devnet. To deploy your own:

> **Note:** `npm run setup` and `npm run anchor-build` pass `--ignore-keys` to `anchor build` so the program keeps the devnet program ID shipped with this template (`F4jZpgbtTb6RWNWq6v35fUeiAsRJMrDczVPv9U23yXjB`). Anchor 1.x otherwise generates a fresh program keypair on build and rewrites `declare_id!`. The steps below build without that flag on purpose, so Anchor syncs your own program ID before deploying.

### Prerequisites

- [Rust](https://rustup.rs/)
- [Solana CLI](https://solana.com/docs/intro/installation)
- [Anchor](https://www.anchor-lang.com/docs/installation)

### Steps

1. **Configure Solana CLI for devnet**

   ```bash
   solana config set --url devnet
   ```

2. **Create a wallet (if needed) and fund it**

   ```bash
   solana-keygen new
   solana airdrop 2
   ```

3. **Build and deploy the program**

   ```bash
   cd anchor
   anchor build
   anchor keys sync    # Updates program ID in source
   anchor build        # Rebuild with new ID
   anchor deploy
   cd ..
   ```

4. **Regenerate the client and restart**
   ```bash
   npm run setup   # Rebuilds program and regenerates client
   npm run dev
   ```

## Testing

```bash
npm run ci   # Frontend build, lint, formatting, and unit tests
```

For browser testing, use devnet SOL only. Verify wallet account switching, deposit, withdrawal, and wallet rejection. Each transaction requires wallet approval.

Tests use [LiteSVM](https://github.com/LiteSVM/litesvm), a fast lightweight Solana VM for testing.

```bash
npm run anchor-build   # Build the program first
npm run anchor-test    # Run tests
```

The tests are in `anchor/programs/vault/src/tests.rs` and automatically use the program ID from `declare_id!`.

## Regenerating the Client

If you modify the program, regenerate the TypeScript client:

```bash
npm run setup   # Or: npm run anchor-build && npm run codama:js
```

This uses [Codama](https://github.com/codama-idl/codama) to generate a type-safe client from the Anchor IDL.

## Learn More

- [Solana Docs](https://solana.com/docs) - core concepts and guides
- [Anchor Docs](https://www.anchor-lang.com/docs) - program development framework
- [Deploying Programs](https://solana.com/docs/programs/deploying) - deployment guide
- [Kit](https://github.com/anza-xyz/kit) - Solana client and React integration
- [Codama](https://github.com/codama-idl/codama) - client generation from IDL
