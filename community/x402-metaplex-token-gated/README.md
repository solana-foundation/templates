# x402 Metaplex Token-Gated Membership

A Next.js template for token-gated content using Solana NFTs with x402 payment integration.

## Prerequisites

- Node.js 18+
- pnpm
- A Solana wallet with devnet SOL
- A Helius API key (free tier works)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
# Solana RPC endpoint
SOLANA_RPC_URL=https://api.devnet.solana.com

# Authority wallet private key (base58 encoded)
# This wallet will deploy collections and mint NFTs
AUTHORITY_PRIVATE_KEY=your_private_key_here

# Helius API for NFT verification
HELIUS_API_KEY=your_helius_api_key
HELIUS_NETWORK=devnet

# Collection addresses (leave empty for now, will be filled after step 3)
NEXT_PUBLIC_BRONZE_COLLECTION=
NEXT_PUBLIC_SILVER_COLLECTION=
NEXT_PUBLIC_GOLD_COLLECTION=

# Payment recipient address (your wallet that receives payments)
NEXT_PUBLIC_PAYMENT_ADDRESS=your_payment_address

# Solana cluster for explorer links
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

### 3. Create collections

Run the collection creation script:

```bash
pnpm create-collections
```

This creates three Metaplex Core collections (Bronze, Silver, Gold) using your authority wallet. Copy the output addresses into your `.env.local`:

```bash
NEXT_PUBLIC_BRONZE_COLLECTION=<bronze_collection_address>
NEXT_PUBLIC_SILVER_COLLECTION=<silver_collection_address>
NEXT_PUBLIC_GOLD_COLLECTION=<gold_collection_address>
```

### 4. Start the development server

```bash
pnpm dev
```

Open http://localhost:3000

## How It Works

1. Users visit `/buy/bronze` and pay via x402
2. After payment, they're redirected to `/mint/bronze`
3. User signs a message to prove wallet ownership (no transaction fees)
4. Server mints the NFT using the authority wallet and sends it to the user's wallet
5. The NFT grants access to `/members/bronze` for the membership duration
6. When the NFT expires, users can renew at `/renew/bronze`

## Membership Tiers

| Tier   | Duration | Price |
| ------ | -------- | ----- |
| Bronze | 30 days  | $0.01 |
| Silver | 60 days  | $0.02 |
| Gold   | 90 days  | $0.03 |

## Project Structure

```
src/
├── app/
│   ├── api/nft/          # Mint, renew, verify endpoints
│   ├── buy/[tier]/       # Payment page
│   ├── mint/[tier]/      # NFT minting page
│   ├── members/[tier]/   # Token-gated content
│   └── renew/[tier]/     # Renewal page
├── components/
│   ├── mint-content.tsx  # Minting UI
│   ├── member-content.tsx # Member area UI
│   └── renew-content.tsx # Renewal UI
├── lib/
│   ├── config.ts         # Tier configuration
│   ├── mint-nft.ts       # NFT minting logic
│   └── verify-nft.ts     # NFT verification via Helius
├── middleware.ts         # Payment protection
└── scripts/
    └── create-collections.ts
```

## Testing

1. Get devnet SOL: https://faucet.solana.com
2. Get devnet USDC: https://faucet.circle.com
3. Use Phantom or Solflare in devnet mode

## License

MIT
