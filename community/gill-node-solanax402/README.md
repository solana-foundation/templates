# x402 Solana Protocol Implementation

A TypeScript implementation of the x402 payment protocol for Solana blockchain, featuring instant finality, sponsored transactions, and replay attack protection.

## Overview

The x402 protocol enables payment-gated access to web resources through Solana blockchain payments. This implementation provides:

- **Instant Finality**: Client funds move immediately to merchant (on-chain settlement)
- **Sponsored Transactions**: Facilitator pays gas fees, client authorizes SOL transfer
- **Replay Protection**: Cryptographic nonce system prevents duplicate payments
- **TypeScript**: Full type safety with Zod validation
- **Production Ready**: PM2 process management, structured logging, error handling

## Architecture

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│                 │  HTTP   │              │  HTTP   │                 │
│  Client App     │────────>│ Server App   │────────>│ Facilitator App │
│                 │         │              │         │                 │
│ • Signs auth    │         │ • x402 mw    │         │ • Verifies sig  │
│ • Signs tx      │         │ • Protected  │         │ • Adds fee sig  │
│ • Sends both    │         │   routes     │         │ • Broadcasts tx │
└─────────────────┘         └──────────────┘         └─────────────────┘
                                                                            │
                                                                            ▼
                                                                 ┌─────────────────┐
                                                      │  Solana Devnet  │
                                                      │  (Blockchain)   │
                                                                 └─────────────────┘
```

### Flow

1. **Client** creates and signs Solana transaction (client -> merchant transfer)
2. **Client** signs authorization payload (for replay protection)
3. **Client** sends both to server via HTTP header
4. **Server** middleware extracts payment and forwards to facilitator
5. **Facilitator** verifies signatures and checks nonce
6. **Facilitator** adds signature as fee payer (sponsors transaction)
7. **Facilitator** broadcasts to Solana blockchain
8. **Instant Settlement**: Client's SOL moves to merchant on-chain
9. **Server** delivers protected resource

## Project Structure

```
x402_ts/
├── src/
│   ├── facilitator/
│   │   ├── index.ts                # Main facilitator app entry
│   │   └── nonce.db                # SQLite database (runtime, gitignored)
│   ├── server/
│   │   └── index.ts                # Main server app entry
│   ├── errors/
│   │   └── index.ts                # Custom error classes
│   ├── lib/
│   │   ├── api-logger.ts           # Structured logging
│   │   ├── api-response-helpers.ts # Standardized responses
│   │   ├── get-facilitator-config.ts  # Zod config validation
│   │   ├── get-facilitator-context.ts # Dependency injection
│   │   ├── get-server-config.ts    # Server config validation
│   │   ├── get-server-context.ts   # Server context
│   │   ├── nonce-database.ts       # SQLite nonce management
│   │   ├── payment-request.ts      # Payment payload structures
│   │   ├── solana-utils.ts         # Solana/Gill SDK utilities
│   │   └── x402-middleware.ts      # Express middleware
│   └── routes/
│       ├── health.ts               # Health check endpoint
│       ├── verify.ts               # Payment verification
│       ├── settle.ts               # Payment settlement
│       ├── nonce.ts                # Nonce management
│       ├── stats.ts                # Statistics
│       └── index.ts                # Route exports
├── dist/                           # Compiled TypeScript output (gitignored)
├── logs/                           # PM2 log files (gitignored)
├── test-true-x402.mjs              # TRUE x402 instant finality test
├── test-replay-attack.mjs          # Replay attack prevention test
├── test-402-response.mjs           # HTTP 402 response test
├── generate-test-client.mjs        # Generate test client wallet
├── ecosystem.config.cjs            # PM2 configuration
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── .env                            # Environment configuration
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp env.example .env
# Edit .env with your configuration
```

Required environment variables:

- `FACILITATOR_PRIVATE_KEY` - Facilitator's private key (base58)
- `SOLANA_RPC_URL` - Solana RPC endpoint (default: devnet)
- `SIMULATE_TRANSACTIONS` - Set to `false` for real blockchain transactions

### 3. Build TypeScript

```bash
npm run build
```

### 4. Start Applications

```bash
# Start both facilitator and server with PM2
npm start

# View logs
npm run logs

# Stop applications
npm stop
```

The facilitator runs on port 3001, server on port 3000 (configurable in .env).

## Testing

### Run All Tests

```bash
# Make sure apps are running first
npm start

# Run main test (TRUE x402 instant finality)
npm test

# Test HTTP 402 response (missing payment)
npm run test:402

# Test replay attack prevention
npm run test:replay
```

### Generate Test Client Wallet

```bash
npm run generate:client
# Creates test-client-keypair.json with a new wallet
```

### Fund Test Wallet on Devnet

```bash
solana airdrop 1 <YOUR_CLIENT_PUBLIC_KEY> --url devnet
```

## How It Works

### TRUE x402 Protocol (Instant Finality)

This implementation uses **sponsored transactions** for TRUE x402 instant finality:

1. **Client Side**:
   - Creates authorization payload with nonce
   - Signs authorization (Ed25519 signature for replay protection)
   - Creates Solana transaction (client -> merchant transfer)
   - Signs transaction with their private key
   - Sends both to server

2. **Facilitator Side**:
   - Verifies authorization signature
   - Checks nonce is unused (prevents replay attacks)
   - Marks nonce as used immediately
   - Deserializes client-signed transaction
   - Adds facilitator signature as fee payer
   - Broadcasts to Solana blockchain
   - Client's SOL moves to merchant instantly

3. **Result**:
   - Client's funds committed on-chain (instant finality)
   - Facilitator paid gas fee
   - No debt tracking needed
   - Single atomic transaction

### Payment Request Structure

```typescript
{
  payload: {
    amount: "10000000",           // Amount in lamports
    recipient: "merchant_address", // Merchant Solana address
    resourceId: "/api/resource",   // Resource identifier
    resourceUrl: "/api/resource",  // Resource URL
    nonce: "unique_hex_string",    // Cryptographic nonce
    timestamp: 1234567890,         // Unix timestamp
    expiry: 1234571490             // Expiration timestamp
  },
  signature: "base58_signature",   // Client's Ed25519 signature
  clientPublicKey: "client_pub",   // Client's Solana public key
  signedTransaction: "base64_tx"   // Client-signed Solana transaction
}
```

### Nonce System (Replay Protection)

The nonce database prevents replay attacks:

- Each payment request includes a unique nonce
- Nonce is stored and marked as "used" during verification
- Subsequent requests with same nonce are rejected
- Nonces expire after 24 hours (configurable)
- Automatic cleanup removes expired nonces

### Protected Endpoints

The server provides examples of payment-protected routes:

```typescript
// Public endpoint (no payment required)
GET /public

// Protected endpoint (requires x402 payment)
GET /api/premium-data
  - Requires 0.01 SOL payment
  - Returns premium content after payment verification

// Other protected routes
POST /api/generate-content
GET /api/download/:fileId
GET /api/tier/:tier
```

## API Reference

### Facilitator Endpoints

**Health Check**

```
GET /health
Response: { success: true, data: { status: "healthy", ... } }
```

**Verify Payment**

```
POST /verify
Body: { paymentRequest: "serialized_payment_request" }
Response: { success: true, data: { verified: true, ... } }
```

**Settle Payment**

```
POST /settle
Body: { paymentRequest: "serialized_payment_request" }
Response: { success: true, data: { transactionSignature: "...", ... } }
```

**Get Nonce Status**

```
GET /nonce/:nonce
Response: { success: true, data: { nonce: "...", usedAt: ..., ... } }
```

**Get Statistics**

```
GET /stats
Response: {
  success: true,
  data: {
    totalNonces: 25,
    usedNonces: 25,
    activeNonces: 0
  }
}
```

### Server Endpoints

**Health Check**

```
GET /health
Response: { success: true, data: { status: "healthy", facilitator: {...} } }
```

**Public Endpoint**

```
GET /public
Response: { success: true, data: { message: "No payment required" } }
```

**Protected Endpoint**

```
GET /api/premium-data
Headers: { X-Payment: "serialized_payment_request" }
Response: { success: true, data: { secret: "premium content", ... } }
```

## Development

### Run in Development Mode

```bash
# Terminal 1: Facilitator
npm run dev:facilitator

# Terminal 2: Server
npm run dev:server
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run fmt

# Check formatting
npm run fmt:check
```

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Blockchain**: Solana (via Gill SDK and @solana/web3.js)
- **Database**: SQLite3 (for nonce management)
- **Process Management**: PM2
- **Validation**: Zod
- **Logging**: Structured logging with timestamps
- **Testing**: Custom test scripts using native fetch

## Configuration

### Environment Variables

See `env.example` for all available configuration options:

```env
# Facilitator
FACILITATOR_PORT=3001
FACILITATOR_PRIVATE_KEY=<base58_private_key>
SOLANA_RPC_URL=https://api.devnet.solana.com
SIMULATE_TRANSACTIONS=false
MAX_PAYMENT_AMOUNT=1000000000

# Server
SERVER_PORT=3000
FACILITATOR_URL=http://localhost:3001
MERCHANT_SOLANA_ADDRESS=<merchant_public_key>

# Solana
SOLANA_NETWORK=devnet
```

### PM2 Configuration

The `ecosystem.config.cjs` file configures PM2 process management:

- Auto-restart on crashes
- Environment variable loading
- Separate log files for each app
- Memory limits and monitoring

## Troubleshooting

### Common Issues

**Apps won't start**

- Check `.env` file exists and has valid `FACILITATOR_PRIVATE_KEY`
- Ensure ports 3000 and 3001 are available
- Check PM2 logs: `npm run logs`

**Tests fail with "insufficient SOL"**

- Fund test client wallet: `solana airdrop 1 <address> --url devnet`
- Check `SIMULATE_TRANSACTIONS=false` in `.env`

**Replay attack test succeeds twice**

- Restart facilitator to reset nonce database
- Check facilitator logs for nonce verification

**Transaction fails on-chain**

- Ensure facilitator has SOL for gas fees
- Check Solana devnet is operational
- Verify RPC endpoint is accessible

## Security Considerations

- **Private Keys**: Never commit `.env` or keypair files to git
- **Nonce Database**: Stored locally, contains transaction history
- **HTTPS**: Use HTTPS in production for all HTTP communication
- **Rate Limiting**: Implement rate limiting on facilitator endpoints
- **Input Validation**: All inputs validated with Zod schemas
- **Error Handling**: Structured errors without sensitive data exposure

## License

MIT

## Contributing

This implementation follows the Gill Node Express template patterns and addresses PR feedback for clean, maintainable code. Contributions should maintain:

- TypeScript with strict type checking
- ES modules (import/export)
- Structured error handling
- Native fetch (no axios)
- Direct module consumption (no HTTP calls to own endpoints)
- PM2 process management
- Zod validation
- Context pattern for dependency injection

## Credits

Built with:

- [Gill SDK](https://www.gillsdk.com/) - Solana TypeScript SDK
- [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) - Solana JavaScript API
- [Express.js](https://expressjs.com/) - Web framework
- [PM2](https://pm2.keymetrics.io/) - Process manager
- [Zod](https://github.com/colinhacks/zod) - Schema validation
