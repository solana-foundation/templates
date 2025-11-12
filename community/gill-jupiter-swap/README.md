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

### ⚠️ IMPORTANT: RPC Setup Required

**The public Solana RPC blocks transaction submissions (403 errors).** You MUST use a private RPC provider to execute swaps.

### Get a Free RPC URL:

1. **Helius** (Recommended): [https://helius.dev](https://helius.dev)
   - Free tier: 100k requests/month
   - Best for swaps and transactions

2. **QuickNode**: [https://quicknode.com](https://quicknode.com)
   - Free tier available
   - Global edge network

3. **Alchemy**: [https://alchemy.com](https://alchemy.com)
   - Free tier available
   - Great developer tools

4. **Triton**: [https://triton.one](https://triton.one)
   - High-performance RPC
   - Free tier available

### Setup Steps:

1. Copy `env.example` to `.env.local`:

   ```bash
   cp env.example .env.local
   ```

2. Add your RPC URL to `.env.local`:

   ```env
   # Solana RPC endpoint (REQUIRED for swaps)
   # Example: https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
   NEXT_PUBLIC_SOLANA_RPC_URL=your_rpc_url_here

   # Default token mints
   NEXT_PUBLIC_DEFAULT_INPUT_MINT=So11111111111111111111111111111111111111112
   NEXT_PUBLIC_DEFAULT_OUTPUT_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

   # Referral configuration (optional)
   # Jupiter Referral Program: Earn fees from every swap made through your app!
   # When users swap through your interface, you earn a percentage of the Jupiter fees.
   # Learn more: https://docs.jup.ag/docs/apis/referral
   NEXT_PUBLIC_JUP_REFERRAL_ACCOUNT=your_referral_account_here
   # BPS = Basis Points (50 BPS = 0.5% of Jupiter's swap fee goes to you)
   NEXT_PUBLIC_JUP_REFERRAL_BPS=50
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## 💰 Jupiter Referral Program

**Monetize your swap interface!** With Jupiter's referral program, you can earn a portion of the swap fees generated through your application.

### How it Works

1. **Set up your referral account** - Add your Solana wallet address to `NEXT_PUBLIC_JUP_REFERRAL_ACCOUNT`
2. **Configure your fee share** - Set basis points (BPS) in `NEXT_PUBLIC_JUP_REFERRAL_BPS` (e.g., 50 BPS = 0.5%)
3. **Start earning** - Every swap made through your interface generates referral fees automatically

### Example Revenue

- If a user swaps $10,000 worth of tokens
- Jupiter fee: ~0.25% = $25
- Your share at 50 BPS (0.5% of Jupiter's fee): $0.125

With high volume, these fees add up quickly! Learn more in the [Jupiter Referral Documentation](https://docs.jup.ag/docs/apis/referral).

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
