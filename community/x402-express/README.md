# X402 Express Server and Client

This project demonstrates how to use X402 payment system with Express.js, allowing API endpoints to charge for access using Solana USDC payments.

## What is X402?

X402 is a payment protocol that enables API endpoints to automatically charge clients for access. Payments are processed on the Solana blockchain using USDC.

## Project Structure

- **Server** (`src/index.ts`): Express.js server with X402-protected API routes
- **Client** (`src/client.ts`): Example client that automatically pays when calling protected endpoints
- **Routes** (`src/routes/index.ts`): API routes with X402 payment middleware
- **Config** (`src/config.ts`): Centralized configuration for payment settings (network, asset, amount, payment address)

## Server

The server sets up Express.js with a protected API endpoint that requires payment:

### Protected Route

The `/api/protected` endpoint requires a payment of **100 USDC** to access. It uses X402 middleware to automatically verify and process payments.

```bash
# Start the server (configure for your deployment platform)
# For Vercel:
vercel dev
```

### Configuration

Payment configuration is centralized in `src/config.ts`. The following environment variables can be set to customize the payment settings:

- `PAY_TO_ADDRESS`: Solana address to receive payments (defaults to a test address)
- `NETWORK`: Solana network (defaults to `"mainnet-beta"`)
- `ASSET`: Token asset to use for payments (defaults to `"USDC"`)
- `AMOUNT`: Payment amount per request (defaults to `"100"`)

All configuration values can be overridden via environment variables or edited directly in `src/config.ts`.

## Client

The client demonstrates how to automatically pay for API access using X402:

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables in `.env`:
```
SECRET_KEY=[your Solana keypair JSON array]
PROXY_URL=[optional proxy URL]
```

### Usage

Run the client to call the protected endpoint:
```bash
pnpm run client
```

The client will:
1. Load your Solana keypair
2. Create a payment handler with X402
3. Wrap `fetch` to automatically handle payments
4. Call the protected endpoint (payment happens automatically)

### How It Works

- The client uses `@faremeter/payment-solana` to create a payment handler
- `wrap(fetch, { handlers: [handler] })` automatically adds payment to requests
- When calling a protected endpoint, the payment is processed on Solana before the request completes

## X402 Usage

X402 middleware is configured using centralized settings in `src/config.ts`:

- **Network**: Solana mainnet-beta (configurable via `NETWORK` env var or `src/config.ts`)
- **Asset**: USDC (configurable via `ASSET` env var or `src/config.ts`)
- **Amount**: 100 USDC per request (configurable via `AMOUNT` env var or `src/config.ts`)
- **Payment Address**: Set via `PAY_TO_ADDRESS` env var or `src/config.ts`
- **Facilitator**: Handles payment verification at `https://facilitator.corbits.io`

The middleware automatically:
- Validates incoming payment signatures
- Verifies payment amounts
- Grants access only after successful payment

## Deployment

### Deploy to Vercel

Deploy your own instance of this project to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/v1xingyue/x402-express)

> **Note:** Replace `your-username/x402-express` with your repository URL if deploying from your own fork.

### Manual Deployment Steps

1. **Fork or clone this repository**
2. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Configure the project settings

3. **Set environment variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add `PAY_TO_ADDRESS` with your Solana address to receive payments
   - Optionally set `NETWORK`, `ASSET`, and `AMOUNT` to customize payment settings
   - The client-side variables (`SECRET_KEY`, `PROXY_URL`) are only needed for local client development

4. **Deploy:**
   - Vercel will automatically detect Express.js and deploy
   - Your API will be available at `https://your-project.vercel.app`

5. **Update client URL:**
   - Update the API URL in `src/client.ts` to point to your deployed server
   - Replace `https://x402-express.vercel.app` with your Vercel deployment URL

## Development

### Getting Started

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd x402-express
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

3. **Configure your `.env` file:**
   - **SECRET_KEY**: Convert your Solana wallet's secret key to a JSON array format
     ```bash
     # If you have a keypair file, you can extract it:
     # The format should be: [123,45,67,...] (array of 64 numbers)
     ```
   - **PAY_TO_ADDRESS**: Your Solana address to receive payments (get USDC test tokens from [Circle Faucet](https://faucet.circle.com/))
   - **NETWORK** (optional): Solana network - defaults to `"mainnet-beta"` (also configurable in `src/config.ts`)
   - **ASSET** (optional): Token asset for payments - defaults to `"USDC"` (also configurable in `src/config.ts`)
   - **AMOUNT** (optional): Payment amount per request - defaults to `"100"` (also configurable in `src/config.ts`)
   - **PROXY_URL** (optional): Set if you need to use a proxy for requests

4. **Run the server:**
```bash
# For local development with Vercel:
vercel dev

# Or configure for your preferred deployment platform
```

5. **Test the client:**
```bash
pnpm run client
```

### Adding More Protected Routes

To add additional protected routes with X402 payment, follow this pattern in `src/routes/index.ts`:

```typescript
import { payToAddress, network, asset, amount } from "../config.js";

// Option 1: Use default config values
const defaultExtract = solana.x402Exact({
  network: network as Network,
  asset: asset as Asset,
  amount: amount,
  payTo: payToAddress,
});

// Option 2: Create custom payment requirement
const customExtract = solana.x402Exact({
  network: "mainnet-beta",
  asset: "USDC",
  amount: "50", // Amount in USDC (adjust as needed)
  payTo: payToAddress,
});

// Create protected route
router.get(
  "/custom-endpoint",
  await middleware.createMiddleware({
    facilitatorURL: "https://facilitator.corbits.io",
    accepts: [customExtract],
  }),
  (_, res) => {
    return res.json({ message: "Custom protected endpoint" });
  }
);
```

### Customizing Payment Settings

Payment configuration is centralized in `src/config.ts`. You can customize:

1. **Via Environment Variables** (recommended for deployments):
   ```bash
   NETWORK=mainnet-beta
   ASSET=USDC
   AMOUNT=100
   PAY_TO_ADDRESS=YourSolanaAddressHere
   ```

2. **Directly in `src/config.ts`**:
   ```typescript
   export const amount = process.env.AMOUNT || "100";  // Change default here
   export const asset = process.env.ASSET || "USDC";   // Change asset here
   export const network = process.env.NETWORK || "mainnet-beta";  // Change network here
   ```

- **Amount**: Default is `"100"` USDC. Amounts are specified as strings (e.g., `"50"`, `"1000"`)
- **Asset**: Currently set to `"USDC"`. Can be changed to other supported SPL tokens
- **Network**: Currently `"mainnet-beta"`. Can be changed to `"devnet"` for testing

### Development Workflow

1. **Local Development:**
   - Make changes to server routes in `src/routes/index.ts`
   - Update client code in `src/client.ts`
   - Test locally with `vercel dev`

2. **Adding New Features:**
   - Create new route files in `src/routes/` if needed
   - Import and use them in `src/routes/index.ts`
   - Update client to call new endpoints

3. **Testing Payments:**
   - Use test USDC from [Circle Faucet](https://faucet.circle.com/)
   - Monitor transactions on Solana explorer
   - Check facilitator logs for payment verification

### Tips

- Keep your `SECRET_KEY` secure and never commit it to version control
- Use different addresses for development and production
- Monitor your Solana wallet balance to ensure sufficient USDC for testing
- The facilitator handles payment verification, so your server doesn't need direct blockchain access


## 🤝 Contribution

Contributed by [cevin](https://github.com/v1xingyue) from [Solar](https://www.solar.team/).

Feel free to raise issues or submit PRs for future improvements.