# Solana Pay Store

A Next.js e-commerce template demonstrating how to accept cryptocurrency payments using Solana Pay.

## How It Works

This application implements a complete payment flow using Solana Pay:

1. **Browse Products** - Users view products and add items to their cart
2. **Checkout** - Cart items are converted to a Solana Pay payment request
3. **QR Code Generation** - A payment URL is encoded as a QR code
4. **Wallet Scan** - Users scan the QR with any Solana wallet app
5. **Transaction** - The wallet sends USDC to your merchant address
6. **Verification** - The app monitors the blockchain and confirms the payment
7. **Purchase History** - Completed transactions are stored locally for reference

All payments are made in USDC (a USD-pegged stablecoin) directly to your wallet. No intermediaries, no payment processors.

## Features

- Product catalog with shopping cart
- Solana Pay integration for USDC payments
- QR code generation for mobile wallets
- Real-time transaction verification
- Purchase history tracking
- Full TypeScript implementation

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create a `.env.local` file:

```bash
# Your merchant wallet address (where payments will be received)
NEXT_PUBLIC_MERCHANT_WALLET=YourSolanaWalletPublicKeyHere

# Solana RPC endpoint (use mainnet-beta for production)
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com

# Base URL for API endpoints
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** This implementation is designed for mainnet-beta. While the code includes devnet configuration for reference, Solana Pay transaction verification may not function reliably on devnet due to network inconsistencies and SPL token availability. For production use, configure your environment for mainnet-beta with real USDC.

### 3. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 to view the store.

## Project Structure

```
/src/
├── lib/solana-pay/          # Payment URL generation and verification
├── hooks/                    # React hooks for checkout and purchase history
├── components/checkout/      # Checkout dialog, QR display, payment status
├── store/                    # Product catalog, cart management, UI
└── app/                      # Next.js app router pages
```

## Tech Stack

- Next.js 15 - React framework with App Router
- Solana Pay - Decentralized payment protocol
- @solana/web3.js - Solana blockchain SDK
- Tailwind CSS - Utility-first styling
- Shadcn UI - Accessible component library
- TypeScript - Type-safe development

## Key Concepts

**Solana Pay** creates a standardized URL format that wallets can parse to initiate transactions. The URL contains:

- Recipient address (your merchant wallet)
- Amount (in USDC)
- Reference (unique transaction identifier)
- Label and memo (for user context)

The app generates these URLs, displays them as QR codes, and monitors the blockchain for transactions matching the reference ID.

## Resources

- [Solana Pay Docs](https://docs.solanapay.com/)
- [Solana Web3.js](https://solana.com/docs/clients/javascript)
- [Next.js Documentation](https://nextjs.org/docs)

## License

Apache-2.0
