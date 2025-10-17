# ZK Compression Airdrop

A Next.js application for distributing SPL tokens using [ZK Compression](https://www.zkcompression.com/) - making token airdrops **~5000x cheaper** than regular SPL tokens.

## Features

- **ZK Compressed Tokens**: Rent-free token accounts stored in Merkle trees
- **Cost Efficient**: ~5000x cheaper than standard SPL tokens
- **Direct Minting**: Simple authority-based distribution (no merkle proofs needed)
- **Batch Processing**: Configurable batch sizes for optimal transaction handling
- **Wallet Integration**: Connect with Phantom, Solflare, and other Solana wallets

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn UI
- **Solana SDK**: [Gill](https://gill.site/) + Wallet UI components
- **ZK Compression**: @lightprotocol/compressed-token + stateless.js

## Prerequisites

1. **Node.js** (v22 or higher)
2. **npm** (recommended) or npm
3. **Solana Wallet** with devnet SOL
4. **Helius RPC API Key** (free tier works) - [Get one here](https://dev.helius.xyz/)

> **Why Helius?** ZK Compression requires special [Photon indexer nodes](https://www.zkcompression.com/references/terminology) to query compressed accounts and generate validity proofs. Helius runs these indexers for free on devnet. Regular Solana RPC nodes can't parse compressed account data stored in Merkle trees.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Helius RPC endpoint (required for ZK compression)
RPC_ENDPOINT=https://devnet.helius-rpc.com?api-key=YOUR_HELIUS_API_KEY

# Your wallet's private key (Base58 encoded) - KEEP THIS SECRET!
DEV_WALLET=your_base58_private_key_here
```

> **Important**:
>
> - Get your Helius API key from https://dev.helius.xyz/
> - To get your Base58 private key from Phantom: Settings → Show Private Key → Copy
> - `DEV_WALLET` works for both scripts and frontend (via next.config.ts)
> - **Never commit your `.env.local` file!**

### 3. Get Devnet SOL

Make sure your wallet has some devnet SOL:

```bash
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
```

Or use the [Solana Faucet](https://faucet.solana.com/).

### 4. Run Complete Airdrop Setup

This single command will:

1. Generate test wallet recipients
2. Create a compressed token mint
3. Generate the airdrop recipients list

```bash
npm run airdrop:setup
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and execute the airdrop!

## Manual Setup (Optional)

If you want to run the setup steps individually:

```bash
# Generate test wallets for recipients
npm run airdrop:wallets

# Create a new compressed token mint
npm run airdrop:mint

# Generate recipients list from test wallets
npm airdrop:recipients
```

## How It Works

### 1. **Compressed Token Mint**

Creates an SPL token registered with Light Protocol's compression program. The token pool enables rent-free compressed accounts.

### 2. **Test Wallets**

Generates Solana keypairs that will receive the airdrop tokens. In production, you'd load real recipient addresses.

### 3. **Airdrop Execution**

The mint authority calls `mintTo()` in batches, directly minting compressed tokens to recipients. No merkle proofs needed - the authority can mint directly.

### 4. **Batching**

Splits recipients across multiple transactions to stay within transaction size limits. Configurable via UI slider (max 50 per batch).

## Project Structure

```
├── scripts/
│   ├── create-compressed-mint.ts      # Create compressed token mint
│   ├── generate-test-wallets.ts       # Generate recipient wallets
│   └── generate-recipients.ts         # Prepare airdrop data
├── src/
│   ├── app/
│   │   └── page.tsx                   # Main airdrop UI
│   ├── components/
│   │   ├── airdrop/                   # Airdrop UI components
│   │   │   ├── airdrop-executor.tsx   # Main orchestrator
│   │   │   ├── airdrop-stats.tsx      # Display token info
│   │   │   ├── airdrop-progress.tsx   # Progress tracking
│   │   │   ├── airdrop-controls.tsx   # Batch controls
│   │   │   └── airdrop-alerts.tsx     # Status alerts
│   │   └── ui/                        # Shadcn components
│   ├── hooks/
│   │   └── use-airdrop.ts             # Airdrop execution hook
│   └── lib/
│       └── airdrop.ts                 # Core airdrop logic
```

## Understanding ZK Compression

### What's Different?

**Standard SPL Tokens:**

- Each token account costs ~0.002 SOL rent
- 1000 recipients = ~2 SOL in rent fees
- Visible on standard explorers

**ZK Compressed Tokens:**

- Token accounts stored in Merkle trees
- About 5000x cheaper (no rent!)
- 1000 recipients = ~0.0004 SOL
- Requires ZK Compression indexer to query

### Why Transactions Don't Appear on Solscan

Compressed token accounts are stored in on-chain Merkle trees, not as individual accounts. Standard explorers can't decode this data structure. To query compressed accounts:

1. **Mint address** on Solana Explorer (shows the mint, not individual accounts)
2. **Photon RPC** with [special methods](https://www.zkcompression.com/resources/json-rpc-methods) like `getCompressedTokenAccountsByOwner`
3. **RPC providers** that run Photon indexers (Helius or [run your own](https://www.zkcompression.com/learn/node-operators))

## Customization

### Change Token Details

Edit `scripts/create-compressed-mint.ts`:

```typescript
const decimals = 9 // Token decimals
const config = {
  name: 'My Airdrop Token',
  symbol: 'AIRDROP',
  // ... rest of config
}
```

### Change Recipient Amounts

Edit `scripts/generate-recipients.ts`:

```typescript
return wallets.map((w, i) => ({
  address: address(w.address),
  amount: 100 * (i + 1), // Customize amounts here
}))
```

### Adjust Max Batch Size

Edit `src/components/airdrop/airdrop-executor.tsx`:

```typescript
maxBatchSize={Math.min(airdropData.recipients.length, 50)} // Change 50 to your max
```

## Scripts Reference

| Script                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| `npm airdrop:setup`      | Complete setup: wallets + mint + recipients |
| `npm airdrop:wallets`    | Generate test wallet recipients             |
| `npm airdrop:mint`       | Create compressed token mint                |
| `npm airdrop:recipients` | Generate airdrop recipients list            |
| `npm dev`                | Start development server                    |
| `npm build`              | Build for production                        |

## Troubleshooting

### "RPC_ENDPOINT environment variable not set"

Make sure you've created `.env.local` and added your Helius RPC endpoint.

### "DEV_WALLET environment variable not set"

Add your Base58 private key to `DEV_WALLET` in `.env.local`. It's exposed to both scripts and frontend via `next.config.ts`.

### "401 Unauthorized: Invalid API key"

Your Helius API key is incorrect. Get a new one from https://dev.helius.xyz/

### "Wallet not authorized"

The connected wallet must match the mint authority. Connect the wallet whose private key is in `DEV_WALLET`.

### "Transaction not found on Solscan"

This is expected! Compressed tokens use Merkle trees. Check the mint address on Solana Explorer instead.

## Production Deployment

1. **Update recipient list**: Replace test wallets with real addresses
2. **Secure your keys**: Use environment variables, never commit keys
3. **Use mainnet RPC**: Update `RPC_ENDPOINT` to Helius mainnet
4. **Test thoroughly**: Always test on devnet first
5. **Monitor transactions**: Keep track of successful/failed mints

## Resources

- [ZK Compression Documentation](https://www.zkcompression.com/)
- [Photon Indexer (Terminology)](https://www.zkcompression.com/references/terminology)
- [ZK Compression RPC Methods](https://www.zkcompression.com/resources/json-rpc-methods)
- [Run Your Own Indexer](https://www.zkcompression.com/learn/node-operators)
- [Light Protocol GitHub](https://github.com/Lightprotocol)
- [Gill SDK](https://gill.site/)
- [Solana Wallet UI](https://registry.wallet-ui.dev)

## License

This project is based on the gill-next-tailwind template from the Solana Foundation.
