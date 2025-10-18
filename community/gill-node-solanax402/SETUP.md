# x402 Setup Guide

Complete setup instructions for the x402 Solana protocol implementation.

## Prerequisites

- Node.js 18+ (for native fetch support)
- npm or yarn
- Solana CLI (optional, for devnet testing)

## Installation

### 1. Clone and Install Dependencies

```bash
cd x402_ts
npm install
```

### 2. Generate Facilitator Keypair

The facilitator needs a Solana keypair to sign and pay for transactions.

**Option A: Using Solana CLI**

```bash
solana-keygen new --outfile facilitator-keypair.json
solana-keygen pubkey facilitator-keypair.json
```

**Option B: Using Node.js**

```javascript
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const keypair = Keypair.generate();
console.log('Public Key:', keypair.publicKey.toString());
console.log('Private Key:', bs58.encode(keypair.secretKey));
```

### 3. Configure Environment

Create `.env` file from template:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Facilitator Configuration
FACILITATOR_PORT=3001
FACILITATOR_PRIVATE_KEY=<your_facilitator_private_key_base58>
FACILITATOR_PUBLIC_KEY=<your_facilitator_public_key>

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WS_URL=wss://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Server Configuration
SERVER_PORT=3000
FACILITATOR_URL=http://localhost:3001
MERCHANT_SOLANA_ADDRESS=<merchant_wallet_address>

# Payment Configuration
MAX_PAYMENT_AMOUNT=1000000000
SIMULATE_TRANSACTIONS=false

# Database
DATABASE_PATH=./src/facilitator/nonce.db
NONCE_EXPIRY_HOURS=24
```

### 4. Fund Facilitator Wallet (Devnet)

The facilitator needs SOL to pay gas fees:

```bash
solana airdrop 2 <FACILITATOR_PUBLIC_KEY> --url devnet
```

Verify balance:

```bash
solana balance <FACILITATOR_PUBLIC_KEY> --url devnet
```

### 5. Build TypeScript

```bash
npm run build
```

This compiles TypeScript files from `src/` to `dist/`.

### 6. Start Applications

**Using PM2 (recommended):**

```bash
npm start
```

This starts both facilitator and server as background processes.

**View logs:**

```bash
npm run logs
```

**Stop applications:**

```bash
npm stop
```

**Restart applications:**

```bash
npm restart
```

**Using npm scripts directly (development):**

```bash
# Terminal 1: Start facilitator
npm run dev:facilitator

# Terminal 2: Start server
npm run dev:server
```

## Testing

### Generate Test Client Wallet

```bash
npm run generate:client
```

This creates `test-client-keypair.json` with a new Solana wallet.

### Fund Test Client (Devnet)

```bash
solana airdrop 1 <CLIENT_PUBLIC_KEY> --url devnet
```

Get the public key from `test-client-keypair.json` or from the script output.

### Run Tests

**Main test (TRUE x402 instant finality):**

```bash
npm test
```

This test:

- Creates a payment request with signed transaction
- Sends to server's protected endpoint
- Facilitator verifies and settles payment
- Client's SOL moves to merchant on-chain
- Returns premium content

**Test HTTP 402 response (no payment):**

```bash
npm run test:402
```

This test:

- Requests protected resource without payment
- Expects HTTP 402 Payment Required response
- Verifies payment requirements in response

**Test replay attack prevention:**

```bash
npm run test:replay
```

This test:

- Sends payment request twice with same nonce
- First attempt succeeds
- Second attempt is rejected (replay attack blocked)

## Verification

### Check Application Status

**Facilitator health:**

```bash
curl http://localhost:3001/health | jq .
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-08T...",
    "facilitator": "38dZtt5G8rRT..."
  }
}
```

**Server health:**

```bash
curl http://localhost:3000/health | jq .
```

**View statistics:**

```bash
curl http://localhost:3001/stats | jq .
```

Expected response:

```json
{
  "success": true,
  "data": {
    "totalNonces": 25,
    "usedNonces": 25,
    "activeNonces": 0,
    "expiredNonces": 0
  }
}
```

### Test Public Endpoint (No Payment)

```bash
curl http://localhost:3000/public | jq .
```

This should return successfully without requiring payment.

### Test Protected Endpoint (Requires Payment)

```bash
curl http://localhost:3000/api/premium-data
```

This should return HTTP 402 with payment requirements:

```json
{
  "error": "Payment Required",
  "accepts": [
    {
      "maxAmountRequired": "10000000",
      "asset": "SOL",
      "payTo": "merchant_address",
      "network": "devnet",
      "resource": "/api/premium-data"
    }
  ]
}
```

## PM2 Process Management

### View All Processes

```bash
npx pm2 list
```

### Monitor Processes

```bash
npm run pm2:monit
```

### View Specific Logs

```bash
# Facilitator logs
npx pm2 logs x402-facilitator

# Server logs
npx pm2 logs x402-server
```

### Delete All Processes

```bash
npm run pm2:delete
```

## Development Workflow

### 1. Make Code Changes

Edit files in `src/` directory.

### 2. Rebuild

```bash
npm run build
```

### 3. Restart Applications

```bash
npm restart
```

Or use watch mode for automatic restart:

```bash
npm run dev:facilitator  # Terminal 1
npm run dev:server       # Terminal 2
```

### 4. Run Tests

```bash
npm test
```

### 5. Code Quality

```bash
# Lint TypeScript
npm run lint

# Format code
npm run fmt

# Check formatting
npm run fmt:check
```

## Troubleshooting

### Issue: "FACILITATOR_PRIVATE_KEY is required"

**Solution:**

- Ensure `.env` file exists in project root
- Verify `FACILITATOR_PRIVATE_KEY` is set and on a single line
- Restart applications after updating `.env`

### Issue: "Port 3001 already in use"

**Solution:**

```bash
# Stop PM2 processes
npm stop

# Or kill process manually
lsof -ti:3001 | xargs kill -9
```

### Issue: Tests fail with "insufficient SOL"

**Solution:**

- Fund test client wallet: `solana airdrop 1 <address> --url devnet`
- Check client balance: `solana balance <address> --url devnet`
- Ensure `SIMULATE_TRANSACTIONS=false` in `.env`

### Issue: "Configuration validation failed"

**Solution:**

- Check all required environment variables in `.env`
- Ensure URLs are valid (start with http:// or https://)
- Verify port numbers are integers
- Check private key is valid base58 string

### Issue: Transactions failing on-chain

**Solution:**

- Ensure facilitator has SOL for gas: `solana balance <facilitator> --url devnet`
- Check Solana devnet status: https://status.solana.com/
- Verify RPC endpoint is accessible: `curl https://api.devnet.solana.com`
- Check transaction on explorer: https://explorer.solana.com/?cluster=devnet

### Issue: Nonce database errors

**Solution:**

```bash
# Stop applications
npm stop

# Remove database
rm src/facilitator/nonce.db

# Restart applications (database will be recreated)
npm start
```

### Issue: PM2 not loading environment variables

**Solution:**

- PM2 loads `.env` via `node_args: '-r dotenv/config'` in `ecosystem.config.cjs`
- Verify `.env` file path is correct
- Restart PM2: `npm run pm2:delete && npm start`

## Production Deployment

### Security Checklist

- [ ] Use HTTPS for all endpoints
- [ ] Store private keys securely (not in code or version control)
- [ ] Use environment variables or secret management system
- [ ] Enable rate limiting on facilitator endpoints
- [ ] Set up monitoring and alerting
- [ ] Configure firewall rules (only expose necessary ports)
- [ ] Use mainnet RPC endpoints (not devnet)
- [ ] Implement request signing/authentication
- [ ] Set reasonable `MAX_PAYMENT_AMOUNT`
- [ ] Configure log rotation
- [ ] Back up nonce database regularly

### Recommended Configuration

```env
# Production settings
SOLANA_NETWORK=mainnet-beta
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SIMULATE_TRANSACTIONS=false
MAX_PAYMENT_AMOUNT=1000000000
NONCE_EXPIRY_HOURS=24
```

### Process Management

Use PM2 in production:

```bash
# Start with PM2
npm start

# Save PM2 configuration
npx pm2 save

# Setup PM2 startup script
npx pm2 startup
```

### Monitoring

```bash
# Real-time monitoring
npm run pm2:monit

# View logs
npm run logs

# Check application health
curl http://localhost:3001/health
curl http://localhost:3000/health
```

## Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [Gill SDK Documentation](https://www.gillsdk.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [x402 Protocol Specification](https://github.com/yourusername/x402-spec)

## Support

For issues or questions:

1. Check this guide and README.md
2. Review logs: `npm run logs`
3. Check PM2 status: `npx pm2 list`
4. Verify configuration: review `.env` file
5. Test connectivity: `curl` health endpoints
