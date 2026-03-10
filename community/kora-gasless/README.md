# Kora Gasless Transactions Template

A Next.js template demonstrating gasless transactions on Solana using [Kora](https://github.com/solana-foundation/kora).

## What is Kora?

Kora is a fee abstraction layer for Solana that lets users pay transaction fees with SPL tokens instead of SOL (or avoid fees altogether). It acts as a "paymaster" that sponsors network fees on behalf of users.

## Features

- 🚫 **No SOL Required**: Users can send tokens without holding SOL
- 💵 **USDC Transfers**: Example implementation for gasless USDC transfers
- 🔗 **Wallet Integration**: Built-in support for Phantom and Solflare
- ⚡ **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+
- A running Kora server (see [Kora docs](https://launch.solana.com/docs/kora/getting-started))

### Installation

```bash
# Clone and install
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Kora RPC URL

# Start development server
npm run dev
```

### Environment Variables

```env
# Your Kora server endpoint
NEXT_PUBLIC_KORA_RPC_URL=http://localhost:8080

# Solana RPC (mainnet, devnet, etc.)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## How It Works

1. **User connects wallet** and initiates a USDC transfer
2. **App builds transaction** with Kora as the fee payer (not the user)
3. **User signs** the transaction (authorizing the transfer, not paying fees)
4. **Kora validates** the transaction against security rules
5. **Kora co-signs** as the fee payer
6. **Transaction is sent** to Solana network
7. **User's USDC is transferred** - Kora paid the ~$0.00025 network fee!

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Main page with UI
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── GaslessTransfer.tsx   # USDC transfer form
│   │   └── WalletProvider.tsx    # Wallet adapter setup
│   ├── hooks/
│   │   └── useGaslessTransaction.ts  # Custom hook for gasless txs
│   └── lib/
│       └── kora.ts         # Kora client utilities
```

## Key Code: Gasless Transaction Hook

```typescript
// hooks/useGaslessTransaction.ts
const sendGaslessTransaction = async (transaction: Transaction) => {
  // 1. Get Kora's fee payer address
  const feePayer = await getFeePayer();
  
  // 2. Set Kora as fee payer (not the user!)
  transaction.feePayer = new PublicKey(feePayer);
  
  // 3. User signs (they're authorizing the action, not paying)
  const signedByUser = await signTransaction(transaction);
  
  // 4. Send to Kora for fee payer signature
  const { signedTransaction } = await signAndSendGasless(serialized);
  
  // 5. Broadcast fully-signed transaction
  const signature = await connection.sendRawTransaction(txBytes);
};
```

## Running Your Own Kora Server

See the [Kora documentation](https://launch.solana.com/docs/kora/getting-started) for setup instructions:

```bash
# Install Kora CLI
cargo install kora-cli

# Start server with your config
kora rpc start --signers-config signers.toml
```

## Learn More

- [Kora Documentation](https://launch.solana.com/docs/kora/getting-started)
- [Kora GitHub](https://github.com/solana-foundation/kora)
- [Solana Web3.js](https://solana.com/docs/clients/javascript)

## License

MIT
