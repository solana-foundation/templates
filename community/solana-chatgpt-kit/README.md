# Solana ChatGPT Kit

![Solana ChatGPT Kit](./public/image.png)

> 🚀 **The World's First ChatGPT App with Native Solana Wallet Integration**

Perform Solana blockchain operations directly from ChatGPT using natural language. Swap tokens, send SOL, check balances, stake assets, and more—all without leaving your conversation.

## 🌟 What Makes This Special?

This is the **first-ever ChatGPT application** that combines:

- ✅ **OpenAI Apps SDK** - Native ChatGPT integration with MCP (Model Context Protocol)
- ✅ **Full Solana Wallet Support** - Use private keys or browser wallet extensions
- ✅ **Interactive Widgets** - Beautiful, responsive UI rendered directly in ChatGPT
- ✅ **Natural Language Commands** - No technical knowledge required
- ✅ **Production Ready** - Fully functional Solana operations powered by Jupiter

## ✨ Features

### 💱 Token Swaps (Jupiter Integration)

- Swap SOL, USDC, USDT, and any SPL token
- Real-time price quotes that update as you type
- Support for token symbols (SOL, USDC) or mint addresses
- Support for ticker symbols like `$SEND`
- Low slippage and optimal routing via Jupiter
- Transaction links to Solscan explorer

### 💸 SOL Transfers

- Send SOL to any wallet address
- **SNS Domain Support** (.sol domains via Bonfida)
- **AllDomains Support** (.superteam, .solana, and other TLDs)
- **x402 Payment Protocol** (External Wallet Mode): Optional $0.001 USDC API fee from user's wallet
- Explicit confirmation before sending
- Transaction tracking and verification

### 📊 Balance Checking

- Check SOL balance for any address
- Query balances using SNS/AllDomains names
- Instant balance lookup with address resolution

### 💰 Token Staking

- Stake SOL into liquid staking tokens (LSTs)
- Default support for JupSOL
- Powered by Jupiter's swap infrastructure
- Earn yield while maintaining liquidity

### 💵 Token Price Lookup

- Get real-time token prices via Jupiter
- Query by mint address (contract address)
- USD price data with formatting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- A Solana wallet with some SOL
- ChatGPT with developer mode access

### Installation

```bash
# Clone the repository
git clone https://github.com/The-x-35/solana-chatgpt-kit.git
cd solana-chatgpt-kit

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env.local` file:

```bash
# Required: Your Solana wallet private key (base58 encoded)
SOLANA_PRIVATE_KEY=your_base58_private_key_here

# Required for external wallet mode: Treasury address for x402 payment fees
# (Only needed if externalWallet = true in lib/solana-config.ts)
X402_TREASURY_ADDRESS=your_treasury_wallet_address_here

# Optional: x402 Facilitator URL (defaults to PayAI facilitator)
FACILITATOR_URL=https://facilitator.payai.network

# Optional: Custom RPC endpoint (defaults to public Solana mainnet)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Jupiter API key for higher rate limits
JUPITER_API_KEY=your_jupiter_api_key
```

**Getting Your Private Key:**

```bash
# Create a new wallet
npx ts-node -e "
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
const wallet = Keypair.generate();
console.log('Public Key:', wallet.publicKey.toString());
console.log('Private Key (base58):', bs58.encode(wallet.secretKey));
"
```

⚠️ **Security Note**: Never share your private key or commit it to git. Use a dedicated wallet for this app with only the funds you need.

### Development

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Deploy to Production

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/The-x-35/solana-chatgpt-kit)

The app is optimized for Vercel deployment with automatic environment detection.

### Connect to ChatGPT

1. Deploy your app (or use ngrok for local testing: `ngrok http 3000`)
2. In ChatGPT, go to **Settings → [Connectors](https://chatgpt.com/#settings/Connectors) → Create**
3. Add your MCP server URL: `https://your-app.vercel.app/mcp`
4. Start using Solana commands in ChatGPT!

**Note**: Connecting MCP servers requires ChatGPT developer mode. See the [connection guide](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt).

## 💬 Usage Examples

Once connected to ChatGPT, you can use natural language commands:

### Swap Tokens

```
"Swap 0.001 SOL to USDC"
"I want to exchange 10 USDC for SOL"
"Convert 0.5 SOL to $SEND"
"Swap SOL to DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"  (mint address)
```

### Send SOL

```
"Send 0.001 SOL to arpit.sol"
"Transfer 0.5 SOL to user.superteam"
"Send 1 SOL to 26k2...QjC"  (wallet address)
```

### Check Balances

```
"What's the balance of arpit.sol?"
"Check balance for user.superteam"
"How much SOL does 26k2...QjC have?"
```

### Stake SOL

```
"Stake 1 SOL into JupSOL"
"I want to stake 0.5 SOL"
```

### Get Token Prices

```
"What's the price of EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v?"  (USDC mint)
"Get the price for DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"  (BONK mint)
```

## 🏗️ Architecture

### Key Components

#### 1. MCP Server (`app/mcp/route.ts`)

The core server that registers tools and resources with ChatGPT:

- **Tools**: Executable functions (swap, transfer, balance check, etc.)
- **Resources**: HTML widgets rendered in ChatGPT iframes
- **Cross-linking**: Tools reference resources via `templateUri`

#### 2. API Routes (`app/api/`)

Backend endpoints that handle blockchain operations:

- `/api/swap/quote` - Get Jupiter swap quotes
- `/api/swap/execute` - Execute token swaps
- `/api/transfer` - Send SOL transactions
- `/api/wallet/balance` - Query wallet balances
- `/api/stake` - Stake SOL into LSTs
- `/api/price` - Token price lookup

#### 3. Wallet Options

**Option A: Private Key (Server-Side)**

- Store private key in `.env.local`
- Transactions signed server-side
- Best for automated operations

**Option B: Browser Wallet Extension (Coming Soon)**

- Connect Phantom, Solflare, or other wallets
- Transactions signed client-side
- Better security for manual operations

#### 4. UI Widgets (`app/swap/`, `app/transfer/`, `app/stake/`)

Beautiful, interactive interfaces rendered in ChatGPT:

- Real-time updates using React hooks
- Dark mode support
- Responsive design for all screen sizes
- Direct integration with ChatGPT theme

#### 5. Address Resolution (`lib/address-resolver.ts`)

Smart address resolution supporting:

- Raw wallet addresses (base58)
- SNS domains (.sol via Bonfida)
- AllDomains TLDs (.superteam, .solana, etc.)

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Blockchain**: Solana Web3.js, SPL Token
- **ChatGPT Integration**: OpenAI Apps SDK, Model Context Protocol (MCP)
- **Swap Infrastructure**: Jupiter Aggregator API
- **Domain Resolution**: Bonfida SNS, AllDomains TLD Parser
- **UI Components**: Radix UI, Lucide Icons

## 🔧 Configuration

### x402 Payment Protocol (External Wallet Mode Only)

When using external wallet mode (`externalWallet = true` in `lib/solana-config.ts`), this application implements the [x402 payment protocol](https://github.com/payainetwork/x402-solana) for API monetization. Each transfer requires a $0.001 USDC payment fee from the user's wallet before execution.

**How it works:**

1. User initiates transfer with browser wallet connected
2. Client calls `/api/transfer` → Server returns 402 Payment Required
3. **Client automatically creates payment transaction** ($0.001 USDC to treasury)
4. **User signs payment with their wallet** (first transaction - USDC payment)
5. Client retries request with `X-PAYMENT` header containing proof
6. Server verifies payment with PayAI facilitator
7. Server returns unsigned transfer transaction
8. **User signs transfer with their wallet** (second transaction - SOL transfer)
9. Transfer executes successfully

**Configuration:**

- Set `externalWallet = true` in `lib/solana-config.ts` to enable
- Set `X402_TREASURY_ADDRESS` env variable to your treasury wallet address
- Set `FACILITATOR_URL` env variable (optional, defaults to PayAI facilitator)
- Fees: $0.001 USDC paid from user's wallet (not server wallet)
- Users must have USDC in their wallet to pay the API fee
- Payment verification handled by PayAI facilitator network

**For developers:**

- Client-side payment: `x402-solana/client` package (see `app/transfer/page.tsx`)
- Server-side verification: `x402-solana/server` package (see `lib/x402-config.ts`)
- API route integration: `app/api/transfer/route.ts`
- Payment token: USDC (mainnet: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)

**Important Notes:**

- When `externalWallet = false` (server wallet mode), x402 is **disabled** and transfers execute directly
- Users need **USDC tokens** in their wallet to pay the $0.001 API fee
- The fee is separate from the SOL being transferred

**Credits:**

- x402 integration with help from [@pranav-singhal](https://github.com/pranav-singhal)

### Adding More Tokens

Edit `lib/solana-config.ts`:

```typescript
export const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  // Add more tokens here
}

export const TOKEN_DECIMALS = {
  SOL: 9,
  USDC: 6,
  USDT: 6,
  BONK: 5,
}
```

### Custom RPC Endpoint

For better performance, use a dedicated RPC endpoint:

```bash
# Recommended providers:
# - Helius (https://helius.dev)
# - QuickNode (https://quicknode.com)
# - Alchemy (https://alchemy.com)

SOLANA_RPC_URL=https://your-custom-rpc-endpoint.com
```

### Slippage Tolerance

Adjust slippage in `app/api/swap/execute/route.ts`:

```typescript
const slippageBps = 100 // 1% (100 basis points)
```

## 📚 API Reference

### Swap Quote

```bash
GET /api/swap/quote
  ?inputToken=SOL
  &outputToken=USDC
  &amount=0.001
```

**Response:**

```json
{
  "inputAmount": 0.001,
  "inputToken": "SOL",
  "outputAmount": 0.18,
  "outputToken": "USDC",
  "priceImpact": 0.01,
  "quote": {
    /* Jupiter quote */
  },
  "timestamp": "2025-10-24T..."
}
```

### Execute Swap

```bash
POST /api/swap/execute
Content-Type: application/json

{
  "inputToken": "SOL",
  "outputToken": "USDC",
  "amount": "0.001"
}
```

**Response:**

```json
{
  "success": true,
  "signature": "5xY...",
  "explorerUrl": "https://solscan.io/tx/5xY...",
  "timestamp": "2025-10-24T..."
}
```

### Check Balance

```bash
GET /api/wallet/balance?account=arpit.sol
```

**Response:**

```json
{
  "sol": 1.5,
  "lamports": 1500000000,
  "resolvedAddress": "26k2...QjC",
  "timestamp": "2025-10-24T..."
}
```

## 🔒 Security Best Practices

1. **Never Expose Private Keys**
   - Use environment variables only
   - Never commit `.env.local` to git
   - Keep `.env.local` in `.gitignore`

2. **Use a Dedicated Wallet**
   - Create a separate wallet for this app
   - Only fund it with what you need
   - Don't use your main wallet

3. **Monitor Transactions**
   - Check [Solscan](https://solscan.io/) regularly
   - Review transaction history
   - Set up alerts for large amounts

4. **Rate Limiting** (Recommended)
   - Add rate limiting to API routes
   - Use Jupiter API key for higher limits
   - Implement request throttling

5. **Input Validation**
   - All inputs are validated with Zod schemas
   - Address resolution includes error handling
   - Transaction amounts are verified

## 🐛 Troubleshooting

### "SOLANA_PRIVATE_KEY not found"

- Ensure `.env.local` exists in project root
- Check variable name spelling
- Restart dev server after adding env vars

### "Invalid private key format"

- Must be base58 encoded
- Use `bs58.encode()` to convert secret key array

### "Failed to fetch quote"

- Check internet connection
- Verify Jupiter API is accessible
- Try a different RPC endpoint
- Check if tokens are supported by Jupiter

### "Insufficient funds"

- Wallet needs SOL for transaction fees (~0.000005 SOL)
- Plus the amount you want to swap/send
- Check balance on Solscan

### "Transaction failed"

- Increase slippage tolerance
- Try a smaller amount
- Check if token accounts exist
- Ensure sufficient SOL for fees

### Widget not loading in ChatGPT

- Check that app is deployed and accessible
- Verify MCP server URL ends with `/mcp`
- Check browser console for CORS errors
- Ensure `assetPrefix` is set correctly in `next.config.ts`

## 📖 Learn More

### Documentation

- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Solana Documentation](https://docs.solana.com)
- [Jupiter Documentation](https://station.jup.ag/docs)
- [Next.js ChatGPT guide](https://vercel.com/blog/running-next-js-inside-chatgpt-a-deep-dive-into-native-app-integration)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

Special thanks to:

- [@pranav-singhal](https://github.com/pranav-singhal) - For help with x402 payment protocol integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind. Use at your own risk. Always verify transactions before confirming. The authors are not responsible for any loss of funds.

---

<div align="center">

**Built with ❤️ for the Solana ecosystem**

[Report Bug](https://github.com/The-x-35/solana-chatgpt-kit/issues) · [Request Feature](https://github.com/The-x-35/solana-chatgpt-kit/issues)

</div>
