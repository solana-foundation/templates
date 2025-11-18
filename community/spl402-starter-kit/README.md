# SPL-402 Starter Kit

A full-stack starter template for building payment-gated APIs using the SPL-402 protocol on Solana. Enable pay-per-request APIs with <1s payment verification and zero platform fees.

## What is SPL-402?

SPL-402 is an HTTP 402 protocol built for Solana that enables direct wallet-to-wallet payments for API access. Pay only Solana network fees (~$0.00001) with no intermediaries or platform fees.

**Key Benefits:**

- <1s payment latency
- Zero platform fees
- Direct wallet payments
- Simple integration

Learn more: [spl402.org](http://spl402.org) | [GitHub](http://github.com/astrohackerx/spl402) | [npm](https://www.npmjs.com/package/spl402)

## Features

- Express.js backend with SPL-402 middleware (TypeScript)
- React 19 frontend with Solana Wallet Adapter (TypeScript)
- 4 demo endpoints (free, premium, ultra, enterprise tiers)
- Tailwind CSS UI with real-time payment feedback
- Mainnet-ready configuration

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
├── server/          # Express.js backend (TypeScript)
│   ├── index.ts     # SPL-402 middleware & endpoints
│   └── .env.example # Server config
└── client/          # React 19 frontend (TypeScript)
    ├── src/
    │   ├── App.tsx        # Main app logic
    │   ├── main.tsx       # Wallet providers
    │   ├── types.ts       # TypeScript types
    │   └── components/    # Reusable components
    └── .env.example       # Client config
```

## API Endpoints

| Endpoint               | Price     |
| ---------------------- | --------- |
| `/api/free-data`       | Free      |
| `/api/premium-data`    | 0.001 SOL |
| `/api/ultra-premium`   | 0.005 SOL |
| `/api/enterprise-data` | 0.01 SOL  |

## Customization

**Add new endpoints** in `server/index.ts`:

```typescript
// Add route to spl402 config
routes: [{ path: '/api/your-endpoint', price: 0.01 }]

// Add handler
app.get('/api/your-endpoint', (req: Request, res: Response) => {
  res.json({ data: 'Your premium data' })
})
```

**Update UI**: Edit `client/src/App.tsx` or create new components in `client/src/components/`.

## Production Deployment

**Backend** (Railway, Render, DigitalOcean):

- Requires HTTPS and Node.js 18+
- Set environment variables from `.env.example`

**Frontend** (Vercel, Netlify, Cloudflare Pages):

- Update `VITE_API_URL` to production API domain
- Update server `FRONTEND_URL` to match deployed frontend

**Security**: Never commit `.env` files. Use HTTPS in production. Set appropriate CORS origins.

## Testing on Devnet

To test without spending real SOL, switch to Devnet:

**Server** - Update `.env`:

```env
SOLANA_RPC_URL=https://api.devnet.solana.com
```

**Client** - Connect wallet and switch network to Devnet in your wallet settings (Phantom, Solflare, etc.)

**Get Devnet SOL**: Use the [Solana Faucet](https://faucet.solana.com) to get free test SOL

**Important**: Ensure both wallet AND server are on the same network (both Devnet or both Mainnet)

## Resources

[Documentation](https://spl402.org/docs) | [Solana Docs](https://docs.solana.com) | [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## License

MIT
