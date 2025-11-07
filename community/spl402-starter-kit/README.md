# SPL-402 Starter Kit

A production-ready full-stack starter template for building payment-gated APIs using the SPL-402 protocol on Solana. This template includes a complete Express.js backend with payment verification middleware and a React frontend with Solana wallet integration.

## What is SPL-402?

spl402 is the HTTP 402 protocol built SPECIFICALLY for Solana from scratch.

Building an EVM-optimized x402 protocol for Solana is like putting a speed limiter on a race car. For L2's 2000ms latency is fine. But is DIFFERENT.

That's why spl402 is 4x faster and significantly easier to integrate into Solana apps compared to x402.

http://spl402.org is what happens when you match protocol to blockchain capability:

✅ ~500ms latency (3-4x faster than x402)
✅ ZERO platform fees
✅ Direct wallet-to-wallet payments
✅ No middlemen or facilitators
✅ Zero dependencies (peer deps only)
✅ No API keys needed

Pay-per-request. The way it should be.

Live demo showing sub-second payment → content unlock on mainnet. This is how monetization should work.

The Solana true economic layer for APIs is finally here.
Open source. Production ready.

Built different.
Try it on mainnet: http://live.spl402.org
Repo: http://github.com/astrohackerx/spl402
SDK: https://www.npmjs.com/package/spl402

It enables:

- **Direct payments**: Wallet-to-wallet transfers with no intermediaries
- **Zero platform fees**: Only pay Solana network transaction fees (~$0.00001)
- **HTTP-native**: Works with standard HTTP/fetch APIs
- **Simple integration**: One middleware, one client call

Think of it as "pay-per-request" for your APIs, but without the overhead of traditional payment processors.

## Why SPL-402 vs x402?

| Feature              | SPL-402            | x402     |
| -------------------- | ------------------ | -------- |
| **Latency**          | ~500ms             | ~2000ms  |
| **Platform Fees**    | 0%                 | Variable |
| **Dependencies**     | 0 (peer deps only) | Multiple |
| **Transaction Cost** | ~$0.00001          | Higher   |
| **Speed**            | 3-4x faster        | Baseline |
| **Middleman**        | None               | Yes      |
| **API Keys**         | Not required       | Required |
| **Setup Time**       | < 5 minutes        | Longer   |

**Why is SPL-402 faster?**

1. **No facilitator**: Payments go directly from payer to recipient
2. **Minimal verification**: Only checks on-chain signature, no third-party APIs
3. **Optimized code**: Zero external dependencies, pure Solana primitives
4. **Local-first**: Can verify payments without external RPC calls in many cases

## How It Works

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│ Client  │                │  Your   │                │ Solana  │
│         │                │  API    │                │ Network │
└────┬────┘                └────┬────┘                └────┬────┘
     │                          │                          │
     │  1. GET /api/data        │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │  2. 402 Payment Required │                          │
     │     + Payment details    │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  3. Create & sign tx     │                          │
     │──────────────────────────┼─────────────────────────>│
     │                          │                          │
     │  4. GET /api/data        │                          │
     │     + Payment proof      │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │  5. Verify signature     │
     │                          │─────────────────────────>│
     │                          │<─────────────────────────┤
     │                          │                          │
     │  6. 200 OK + Data        │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
```

### Payment Flow

1. **Client requests protected resource** → Server responds with `402 Payment Required`
2. **Server includes payment details** → Amount, recipient address, network
3. **Client creates Solana transaction** → Signs and submits to network
4. **Client retries request with proof** → Includes transaction signature
5. **Server verifies payment** → Checks signature on-chain
6. **Server returns content** → Client receives requested data

## Features

### Backend

- Express.js server with SPL-402 middleware
- 4 demo endpoints with different pricing tiers
- Mainnet-ready configuration with RPC support
- CORS enabled for cross-origin requests
- Production-ready error handling

### Frontend

- React 18 + Vite for fast development
- Full Solana Wallet Adapter integration
- spl402 React hooks for seamless payment processing
- Beautiful UI with Tailwind CSS
- Real-time payment processing feedback
- Comprehensive error handling and loading states

## Quick Start

### Prerequisites

- Node.js 18 or higher
- A Solana wallet (Phantom, Solflare, etc.)
- SOL on mainnet for testing payments

### 1. Server Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=3001
RECIPIENT_WALLET=your_solana_wallet_address
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm start
```

### 2. Client Setup

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
```

### 3. Test the Application

1. Open http://localhost:5173 in your browser
2. Test the free tier (no wallet required)
3. Connect your Solana wallet
4. Try the premium tiers (requires SOL payment)

## Project Structure

```
spl402-starter-kit/
├── package.json          # Template metadata
├── og-image.png          # Social preview image
├── README.md             # This file
├── server/               # Express.js backend
│   ├── index.js          # Main server with SPL-402 middleware
│   ├── package.json      # Server dependencies
│   └── .env.example      # Server environment template
└── client/               # React frontend
    ├── src/
    │   ├── App.jsx       # Main app with wallet integration
    │   ├── main.jsx      # Wallet providers setup
    │   └── index.css     # Tailwind styles
    ├── package.json      # Client dependencies
    └── .env.example      # Client environment template
```

## API Endpoints

| Endpoint               | Price     | Description            |
| ---------------------- | --------- | ---------------------- |
| `/api/free-data`       | Free      | Public data access     |
| `/api/premium-data`    | 0.001 SOL | Premium analytics      |
| `/api/ultra-premium`   | 0.005 SOL | Ultra premium features |
| `/api/enterprise-data` | 0.01 SOL  | Enterprise tier access |

## How It Works

1. **Frontend** creates a payment request when user accesses a premium endpoint
2. **User's wallet** signs and sends a SOL transaction to the blockchain
3. **Frontend** sends the transaction signature to your server
4. **Server** verifies the signature on-chain using SPL-402
5. **Server** returns the protected data
6. **Frontend** displays the response

All in approximately 500ms!

## Customization

### Adding New Endpoints

Edit `server/index.js`:

```javascript
app.get('/api/your-endpoint', spl402Middleware('0.01', process.env.RECIPIENT_WALLET), (req, res) => {
  res.json({ data: 'Your premium data' })
})
```

### Modifying the UI

Edit `client/src/App.jsx` to customize the interface, add new features, or change the styling.

### Changing Payment Amounts

Update the price parameter in the middleware:

```javascript
spl402Middleware('0.005', process.env.RECIPIENT_WALLET) // 0.005 SOL
```

## Tech Stack

**Backend:**

- Express.js
- spl402 (npm package)
- @solana/web3.js
- CORS
- dotenv

**Frontend:**

- React 18
- Vite
- spl402 (npm package)
- @solana/wallet-adapter-react
- Tailwind CSS
- Lucide React (icons)

## Production Deployment

### Backend Deployment

Recommended platforms:

- Railway
- Render
- DigitalOcean
- AWS/GCP/Azure

Requirements:

- HTTPS endpoint
- Environment variables configured
- Node.js 18+

### Frontend Deployment

Recommended platforms:

- Vercel
- Netlify
- Cloudflare Pages

Update the client `.env` with your production API URL:

```env
VITE_API_URL=https://your-api-domain.com
```

Update the server `.env` with your production frontend URL:

```env
FRONTEND_URL=https://your-frontend-domain.com
```

## Security Considerations

- Never commit `.env` files to version control
- Keep private keys secure
- Use HTTPS in production
- Set appropriate CORS origins
- Monitor transaction verification logs
- Use environment variables for all secrets

## Troubleshooting

### "Please connect your wallet first"

- Click "Connect Wallet" button
- Ensure you're on Mainnet, not Devnet

### "Transaction failed"

- Verify you have sufficient SOL (payment amount + network fees)
- Confirm you're on Mainnet
- Check your RPC isn't rate-limited

### Server won't start

- Check port 3001 is available
- Verify Node.js version (18+)
- Ensure `.env` file exists and is configured

### CORS errors

- Verify `FRONTEND_URL` in server `.env` matches your frontend URL
- Restart server after changing environment variables

## Important Notes

- This template uses **MAINNET** - real SOL will be spent
- Payments are irreversible
- Test with small amounts first
- Network fees apply (~0.00001 SOL per transaction)

## Resources

- [SPL-402 Documentation](https://spl402.org)
- [Solana Documentation](https://docs.solana.com)
- [Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.
