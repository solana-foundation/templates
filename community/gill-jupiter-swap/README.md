# Gill + Jupiter Swap Template

A complete Solana swap interface powered by Jupiter Plugin with Crossmint wallet integration.

## ✨ Features

- 🔄 **Jupiter Integration** - Best-in-class swap routing with optimal price discovery
- 🪙 **20+ Popular Tokens** - SOL, USDC, USDT, BONK, WIF, JUP, mSOL, and more
- 🎨 **Modern UI** - Clean, responsive interface with glassmorphism design
- 🔐 **Dual Wallet Support** - Standard Solana wallets + Crossmint wallets
- ⚡ **Real-time Quotes** - Live price updates and route optimization
- 🛡️ **Slippage Control** - Customizable slippage tolerance
- 📊 **Route Visualization** - See swap paths and price impact
- 🌐 **Mainnet Ready** - Production-ready with configurable RPC integration

## 🚀 Quick Start

```bash
# Create new project
npm create solana-dapp@latest -t gh:solana-foundation/templates/community/gill-jupiter-swap

# Navigate to project
cd gill-jupiter-swap

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

Copy `env.example` to `.env.local` and configure:

```env
# Solana RPC endpoint (required)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Jupiter API key (optional, for higher rate limits)
NEXT_PUBLIC_JUPITER_API_KEY=your_jupiter_api_key_here

# Default token mints
NEXT_PUBLIC_DEFAULT_INPUT_MINT=So11111111111111111111111111111111111111112
NEXT_PUBLIC_DEFAULT_OUTPUT_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Referral configuration (optional)
NEXT_PUBLIC_JUP_REFERRAL_ACCOUNT=your_referral_account_here
NEXT_PUBLIC_JUP_REFERRAL_BPS=50
```

## 🔗 Wallet Integration

### Standard Wallets
- **Phantom** - Most popular Solana wallet
- **Solflare** - Feature-rich Solana wallet
- **Backpack** - Developer-focused wallet
- **Glow** - Mobile-first wallet

### Crossmint Wallets
- **Fiat On-Ramp** - Seamless fiat-to-crypto experience
- **Enhanced UX** - Multiple wallet options for different user preferences
- **Future-Proof** - Ready for Crossmint's expanding ecosystem

## 📚 Documentation

- [Jupiter Plugin Documentation](https://docs.jupiter.ag/)
- [Jupiter Swap API](https://docs.jup.ag/)
- [Crossmint Documentation](https://docs.crossmint.com/)
- [Gill Documentation](https://github.com/solana-developers/solana-rpc-get-started)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT License - see LICENSE file for details.
