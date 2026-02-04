# nextjs-anchor

Next.js starter with Tailwind CSS, `@solana/react-hooks`, and an Anchor vault program example.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs-anchor
```

```shell
npm install   # Builds program and generates client automatically
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect your wallet, and interact with the vault on devnet.

## What's Included

- **Wallet connection** via `@solana/react-hooks` with auto-discovery
- **SOL Vault program** - deposit and withdraw SOL from a personal PDA vault
- **Codama-generated client** - type-safe program interactions using `@solana/kit`
- **Tailwind CSS v4** with light/dark mode

## Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | Next.js 16, React 19, TypeScript        |
| Styling        | Tailwind CSS v4                         |
| Solana Client  | `@solana/client`, `@solana/react-hooks` |
| Program Client | Codama-generated, `@solana/kit`         |
| Program        | Anchor (Rust)                           |

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── providers.tsx      # Solana client setup
│   │   └── vault-card.tsx     # Vault deposit/withdraw UI
│   ├── generated/vault/       # Codama-generated program client
│   └── page.tsx               # Main page
├── anchor/                    # Anchor workspace
│   └── programs/vault/        # Vault program (Rust)
└── codama.json                # Codama client generation config
```

## Deploy Your Own Vault

The included vault program is already deployed to devnet. To deploy your own:

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
- [framework-kit](https://github.com/solana-foundation/framework-kit) - the React hooks used here
- [Codama](https://github.com/codama-idl/codama) - client generation from IDL
