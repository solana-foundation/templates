# Jupiter Swap Setup Guide

This guide explains how to set up and use the Jupiter swap integration in your ChatGPT app.

## 🚀 Quick Start

### 1. Install Dependencies

Already installed! The project includes:

- `@solana/web3.js` - Solana blockchain interactions
- `@solana/spl-token` - Token operations
- `bs58` - Base58 encoding for private keys

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required: Your Solana wallet private key (base58 encoded)
SOLANA_PRIVATE_KEY=your_base58_private_key_here

# Optional: Custom RPC endpoint (defaults to public Solana mainnet)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Jupiter API key for higher rate limits
JUPITER_API_KEY=your_jupiter_api_key
```

### 3. Get Your Private Key

**⚠️ WARNING: Never share your private key or commit it to git!**

To get your base58-encoded private key from Phantom wallet:

```javascript
// In browser console on Phantom wallet
import bs58 from 'bs58';
// Or use online tool at: https://www.npmjs.com/package/bs58

// If you have secret key array:
const secretKey = new Uint8Array([...]); // Your secret key
const base58Key = bs58.encode(secretKey);
console.log(base58Key);
```

Or create a new wallet programmatically:

```bash
npx ts-node -e "
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
const wallet = Keypair.generate();
console.log('Public Key:', wallet.publicKey.toString());
console.log('Private Key (base58):', bs58.encode(wallet.secretKey));
"
```

### 4. Fund Your Wallet

Your wallet needs SOL for:

- Transaction fees (~0.000005 SOL per swap)
- The tokens you want to swap

Send SOL to your wallet's public key.

### 5. Start the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## 💬 Using the Swap Tool in ChatGPT

### Connect to ChatGPT

1. Deploy your app or use ngrok for local testing
2. In ChatGPT: Settings → Connectors → Create
3. Add your MCP server URL: `https://your-app.vercel.app/mcp`

### Example Commands

Try these prompts in ChatGPT:

#### Basic Swap

```
I want to swap 0.001 SOL to USDC
```

#### Different Tokens

```
Swap 0.5 SOL to USDT
```

```
Convert 10 USDC to SOL
```

#### Just Open the Widget

```
Open the Jupiter swap interface
```

### What Happens

1. ChatGPT calls the `jupiter_swap` tool
2. A beautiful swap widget appears
3. You can:
   - Edit the input amount
   - See real-time output quotes (updates every 500ms)
   - Flip tokens with the swap arrow
   - Execute the swap with one click
4. Transaction happens automatically using your private key
5. Success message shows the Solscan transaction link

## 🎨 Widget Features

- **Real-time Quotes**: Output amount updates as you type
- **Token Flip**: Click the arrow to swap input/output tokens
- **Dark Mode**: Automatically matches ChatGPT's theme
- **Error Handling**: Clear error messages for issues
- **Transaction Links**: Direct links to Solscan explorer
- **Responsive**: Works on mobile, tablet, and desktop

## 🔧 Technical Details

### Supported Tokens

Currently configured tokens:

- **SOL** - Native Solana token
- **USDC** - USD Coin (EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)
- **USDT** - Tether (Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB)

To add more tokens, edit `lib/solana-config.ts`:

```typescript
export const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // Example
}

export const TOKEN_DECIMALS = {
  SOL: 9,
  USDC: 6,
  USDT: 6,
  BONK: 5,
}
```

### API Endpoints

#### Get Quote

```bash
GET /api/swap/quote?inputToken=SOL&outputToken=USDC&amount=0.001
```

Response:

```json
{
  "inputAmount": 0.001,
  "inputToken": "SOL",
  "outputAmount": 0.123456,
  "outputToken": "USDC",
  "priceImpact": 0.01,
  "quote": {
    /* full Jupiter quote */
  },
  "timestamp": "2025-10-19T..."
}
```

#### Execute Swap

```bash
POST /api/swap/execute
Content-Type: application/json

{
  "inputToken": "SOL",
  "outputToken": "USDC",
  "amount": "0.001"
}
```

Response:

```json
{
  "success": true,
  "signature": "5xY...",
  "explorerUrl": "https://solscan.io/tx/5xY...",
  "inputAmount": 0.001,
  "inputToken": "SOL",
  "outputAmount": 0.123456,
  "outputToken": "USDC",
  "timestamp": "2025-10-19T..."
}
```

### Flow Diagram

```
User → ChatGPT → MCP Tool → Widget UI
                              ↓
                        Quote API (real-time)
                              ↓
                        User clicks "Swap"
                              ↓
                        Execute API
                              ↓
                    Jupiter Quote → Jupiter Swap
                              ↓
                    Sign with Private Key
                              ↓
                    Send to Solana Network
                              ↓
                    Confirm Transaction
                              ↓
                    Show Success + Explorer Link
```

## 🔒 Security Best Practices

1. **Never expose private keys**
   - Use environment variables only
   - Never commit `.env.local` to git
   - Add `.env.local` to `.gitignore`

2. **Use dedicated wallet**
   - Don't use your main wallet
   - Create a separate wallet for this app
   - Only fund it with what you need

3. **Monitor transactions**
   - Check Solscan regularly
   - Set up monitoring alerts
   - Review transaction history

4. **Rate limiting** (optional)
   - Add rate limiting to API routes
   - Use Jupiter API key for higher limits

## 🐛 Troubleshooting

### "SOLANA_PRIVATE_KEY not found"

- Make sure `.env.local` exists
- Check the variable name is correct
- Restart the dev server after adding env vars

### "Invalid SOLANA_PRIVATE_KEY format"

- Must be base58 encoded
- Use `bs58.encode()` to convert your secret key

### "Failed to fetch quote"

- Check internet connection
- Verify Jupiter API is accessible
- Try a different RPC endpoint

### "Insufficient funds"

- Make sure wallet has enough SOL
- Need SOL for both swap amount and transaction fees
- Check balance on Solscan

### "Transaction failed"

- Increase slippage tolerance (edit in code)
- Try a smaller amount
- Check if token accounts exist

## 📚 Resources

- [Jupiter Documentation](https://station.jup.ag/docs)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Solscan Explorer](https://solscan.io/)
- [Jupiter Swap API](https://station.jup.ag/docs/apis/swap-api)

## 🎯 Next Steps

Want to enhance the swap feature? Try:

1. **Add more tokens**: Edit `lib/solana-config.ts`
2. **Adjust slippage**: Change `slippageBps` in quote/execute routes
3. **Add price charts**: Integrate charting library
4. **Transaction history**: Store past swaps in database
5. **Multi-hop swaps**: Support complex routing
6. **Limit orders**: Add Jupiter limit order integration
7. **Portfolio view**: Show token balances

Happy swapping! 🚀
