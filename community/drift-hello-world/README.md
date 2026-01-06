# Drift Hello World

A Next.js + Tailwind + TypeScript template that introduces Drift Protocol on Solana. Connect a wallet, initialize a Drift user account, and open a simple perp position on devnet with full transaction confirmation handling.

## What You'll Learn

- How to initialize the Drift SDK in a browser dApp
- How Drift user accounts are derived and created
- How to open a basic perp position
- How to confirm transactions and surface status in the UI

## Quick Start

```bash
pnpm create solana-dapp@latest -t gh:solana-foundation/templates/community/drift-hello-world
```

```bash
cd <your-project>
pnpm install
```

```bash
pnpm dev
```

Open http://localhost:3000 and connect a devnet wallet.

## Step-by-Step Tutorial

### 1) Configure a Devnet RPC Endpoint

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

For better performance, use a dedicated RPC provider (Helius, QuickNode, Triton, etc.).

### 2) Fund Your Wallet (Devnet)

```bash
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
```

### 3) Initialize a Drift User Account

1. Click **Connect Wallet**.
2. Click **Initialize Drift Account**.

The SDK derives a user PDA from your wallet address and a sub-account id. The on-chain program creates the account and stores your user state.

### 4) Deposit SOL Collateral

1. Enter a SOL amount (e.g. `0.1`).
2. Click **Deposit SOL collateral**.

This wraps SOL into wSOL and deposits it into Drift's SOL spot market (index 1), giving you margin for perp trading.

### 5) Open a Simple Position

1. Choose **Long** or **Short**.
2. Keep the default market index (0 is SOL-PERP on devnet).
3. Enter a base size (e.g. `0.05`).
4. Click **Open Position**.

The UI will:

- Build the transaction through the Drift SDK
- Await a wallet signature
- Confirm on-chain execution
- Refresh the position status card

### 6) Monitor Position Status

The **Live status** card reads the current position data and displays:

- Direction (long/short)
- Base size
- Quote exposure

## Project Structure

```
src/
  app/                     Next.js app router pages
  components/drift/         Drift UI components
  components/solana/        Wallet connection provider
  hooks/                    Drift SDK state and actions
  lib/                      SDK helpers + formatting
  types/                    Response types for Drift SDK data
```

## Key Components

- `src/components/solana/solana-provider.tsx`: Wallet adapter setup + RPC endpoint
- `src/hooks/use-drift.ts`: Drift SDK initialization, user account creation, and transaction flow
- `src/components/drift/position-form.tsx`: Opens a basic position
- `src/components/drift/position-status.tsx`: Displays position data

## Drift SDK Notes

- **Initialization**: `DriftClient` subscribes to market data and program accounts on devnet.
- **Account derivation**: Drift user accounts are PDAs derived from seeds `["user", authority, subAccountId]`.
- **Transactions**: `openPosition` builds and sends the instruction, then we confirm it via `connection.confirmTransaction`.

## Useful Links

- Drift Protocol docs: https://docs.drift.trade/
- Drift SDK guide: https://docs.drift.trade/sdk/
- Drift GitHub: https://github.com/drift-labs/protocol-v2
- Solana Wallet Adapter: https://github.com/solana-labs/wallet-adapter

## Troubleshooting

- **Wallet connects but account init fails**: Ensure you are on devnet and funded with devnet SOL.
- **No position appears**: Wait for confirmation and refresh. Devnet data can be slower to index.
- **RPC errors**: Swap to a private RPC endpoint for higher rate limits.

## License

MIT
