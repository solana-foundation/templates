# x402 Next.js Solana Template

**A simple Next.js starter template with x402 payment protocol integration for Solana.**

This template demonstrates a streamlined implementation of the x402 payment protocol (v2) using the `@x402/next` package, making it easy to add cryptocurrency payment gates to your Next.js applications.

> ⚠️ **Using on Mainnet?** This template is configured for testnet (devnet) by default, and the default facilitator (`https://x402.org/facilitator`) is testnet-only. To accept real payments on mainnet, set `NEXT_PUBLIC_NETWORK=solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` and use a facilitator that supports Solana mainnet, such as the [Coinbase CDP facilitator](https://docs.cdp.coinbase.com/x402/seller/quickstart) (requires CDP API keys) or [PayAI](https://facilitator.payai.network) (no API key needed to start: set `NEXT_PUBLIC_FACILITATOR_URL=https://facilitator.payai.network`). More options are listed in the [x402 facilitator directory](https://docs.x402.org/dev-tools/facilitators). You don't need to configure a fee payer: the x402 server reads it from the facilitator. See [Going to Production](#going-to-production).

## Table of Contents

- [What is x402?](#what-is-x402)
- [Features](#features)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Usage](#usage)

---

## What is x402?

**x402** is an open payment protocol that uses HTTP status code **402 "Payment Required"** to enable seamless cryptocurrency payments for web content and APIs.

### Key Benefits

- **Direct Payments** - Accept cryptocurrency payments without third-party payment processors
- **No Accounts** - No user registration or authentication required
- **Blockchain-Verified** - Payments are verified directly on the Solana blockchain
- **Simple Integration** - Add payment gates to any Next.js page or API route
- **Flexible Pricing** - Set different prices for different content

### How It Works

```
1. User requests protected content
2. Server responds with 402 Payment Required
3. User signs a USDC payment with a Solana wallet
4. The request is sent again with the signed payment
5. The facilitator verifies and settles the payment on Solana, and the server grants access
```

---

## Features

- **x402 Payment Proxy** - Powered by the `@x402/next` package
- **Paid API Routes** - `withX402` settles the payment only after a successful response
- **Solana Integration** - Uses Solana blockchain for payment verification
- **Multiple Price Tiers** - Configure different prices for different routes
- **Type-Safe** - Full TypeScript support
- **Next.js 16** - Built on the latest Next.js App Router

---

## Getting Started

### Prerequisites

- Node.js 20.9+ or Bun
- pnpm, npm, or yarn
- A Solana wallet address to receive payments

### Installation

```bash
# Clone or create from template
npx create-solana-dapp my-app --template x402-template

# Navigate to project
cd my-app

# Install dependencies
pnpm install

# Set your receiving address (and optionally the network and facilitator)
cp .env.example .env.local

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see your app running.

### Test the Payment Flow

1. Navigate to `http://localhost:3000`
2. Click on "Access Cheap Content" or "Access Expensive Content"
3. You'll see the x402 paywall. Connect a Solana wallet that holds devnet USDC
4. Complete the payment
5. Access is granted and you'll see the protected content

The template also includes a paid API route. Without a payment it returns `402 Payment Required` with the payment requirements in a base64 `PAYMENT-REQUIRED` header:

```bash
curl -i http://localhost:3000/api/cat-fact
```

To pay from code, use `@x402/fetch` with `@x402/svm` (see the [fetch client example](https://github.com/x402-foundation/x402/tree/main/examples/typescript/clients/fetch)).

---

## How It Works

This template uses the `@x402/next` package, which handles the entire payment flow. `paymentProxy` protects pages from the Next.js proxy, and `withX402` protects individual API routes.

### Proxy Configuration

The core of the payment integration is in `proxy.ts`:

```typescript
import { paymentProxy } from '@x402/next'
import { HTTPFacilitatorClient, x402ResourceServer } from '@x402/core/server'
import type { Network } from '@x402/core/types'
import { SOLANA_DEVNET_CAIP2, SOLANA_MAINNET_CAIP2 } from '@x402/svm'
import { registerExactSvmScheme } from '@x402/svm/exact/server'
import { createPaywall } from '@x402/paywall'
import { svmPaywall } from '@x402/paywall/svm'

const receiverAddress = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS
if (!receiverAddress) {
  throw new Error(
    'NEXT_PUBLIC_RECEIVER_ADDRESS is not set. Copy .env.example to .env.local and set your Solana address.',
  )
}
export const payTo = receiverAddress
// x402 v2 identifies networks by CAIP-2 id
export const network = (process.env.NEXT_PUBLIC_NETWORK || SOLANA_DEVNET_CAIP2) as Network
if (network !== SOLANA_DEVNET_CAIP2 && network !== SOLANA_MAINNET_CAIP2) {
  throw new Error(
    `NEXT_PUBLIC_NETWORK must be a Solana CAIP-2 id: ${SOLANA_DEVNET_CAIP2} (devnet) or ${SOLANA_MAINNET_CAIP2} (mainnet).`,
  )
}
const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || 'https://x402.org/facilitator'

export const server = new x402ResourceServer(new HTTPFacilitatorClient({ url: facilitatorUrl }))
registerExactSvmScheme(server)

export const paywall = createPaywall()
  .withNetwork(svmPaywall)
  .withConfig({
    appName: 'x402 Demo',
    testnet: network === SOLANA_DEVNET_CAIP2,
  })
  .build()

export const proxy = paymentProxy(
  {
    '/content/cheap': {
      accepts: { scheme: 'exact', price: '$0.01', network, payTo },
      description: 'Access to cheap content',
      mimeType: 'text/html',
    },
    '/content/expensive': {
      accepts: { scheme: 'exact', price: '$0.25', network, payTo },
      description: 'Access to expensive content',
      mimeType: 'text/html',
    },
  },
  server,
  undefined, // paywallConfig: already set on the paywall above
  paywall,
)

// Configure which paths the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/', // Include the root path explicitly
  ],
}
```

### API Route Configuration

`app/api/cat-fact/route.ts` protects an API route with `withX402`, reusing the server and paywall from `proxy.ts`:

```typescript
import { NextResponse } from 'next/server'
import { withX402 } from '@x402/next'
import { network, payTo, paywall, server } from '@/proxy'

const handler = async () => NextResponse.json({ fact: 'A group of cats is called a clowder.' })

// withX402 settles the payment only after the handler returns a successful response (status < 400)
export const GET = withX402(
  handler,
  {
    accepts: { scheme: 'exact', price: '$0.01', network, payTo },
    description: 'Access to a premium cat fact',
    mimeType: 'application/json',
  },
  server,
  undefined, // paywallConfig: already set on the paywall in proxy.ts
  paywall,
)
```

You can also protect API routes from `proxy.ts`, but then the payment settles even when the route handler fails. `withX402` settles only after the handler returns a successful response.

### What Happens Under the Hood

1. **Request Interception** - The proxy (or `withX402`) checks if the requested route requires payment
2. **402 Response** - Without a payment, the server returns 402 with the payment requirements in the `PAYMENT-REQUIRED` header. Browsers get a paywall page
3. **Wallet Payment** - The user connects a Solana wallet and signs a USDC transfer. The facilitator's fee payer covers the transaction fee
4. **Payment Verification** - The request is sent again with a `PAYMENT-SIGNATURE` header, and the facilitator verifies the payment
5. **Settlement** - The facilitator submits the transaction on Solana, and the response includes a `PAYMENT-RESPONSE` header
6. **Access Granted** - The user sees the protected content

There are no sessions: every request to a protected route needs its own payment.

---

## Project Structure

```
x402-template/
├── proxy.ts                   # 🛡️  x402 payment proxy configuration
├── app/
│   ├── page.tsx              # 🏠 Homepage with links to protected content
│   ├── layout.tsx            # 📐 Root layout
│   ├── globals.css           # 🎨 Global styles
│   ├── api/
│   │   └── cat-fact/
│   │       └── route.ts      # 💳 Paid API route (withX402)
│   └── content/
│       └── [type]/
│           └── page.tsx      # 🔒 Protected content pages
├── components/
│   └── cats-component.tsx    # 🐱 Example content component
├── lib/                      # 📚 Utility functions (if needed)
├── public/                   # 📁 Static assets
└── package.json              # 📦 Dependencies
```

---

## Configuration

### Environment Variables

Set these in `.env.local` (copy `.env.example`). `NEXT_PUBLIC_RECEIVER_ADDRESS` is required. The network defaults to Solana devnet and the facilitator to `https://x402.org/facilitator`:

```bash
# Your Solana wallet address (where payments go)
NEXT_PUBLIC_RECEIVER_ADDRESS=your_solana_address_here

# Network as a CAIP-2 id: solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1 (devnet) or solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp (mainnet)
NEXT_PUBLIC_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1

# Facilitator URL (service that verifies and settles payments)
# x402.org is testnet-only. For mainnet, use a facilitator that supports Solana mainnet,
# e.g. https://facilitator.payai.network (see https://docs.x402.org/dev-tools/facilitators)
NEXT_PUBLIC_FACILITATOR_URL=https://x402.org/facilitator
```

### Customizing Routes and Prices

Edit `proxy.ts` to add or modify protected pages:

```typescript
export const proxy = paymentProxy(
  {
    '/premium': {
      accepts: { scheme: 'exact', price: '$1.00', network, payTo },
      description: 'Premium content access',
      mimeType: 'text/html',
    },
    // ... other routes
  },
  server,
  undefined, // paywallConfig: already set on the paywall above
  paywall,
)
```

For API routes, wrap the handler with `withX402` as in `app/api/cat-fact/route.ts`.

### Network Selection

You can use different networks:

- `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` - Devnet, for testing (use test tokens)
- `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` - Mainnet, for production (real money!)

x402 v2 identifies networks by [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md) id. The v1 names (`solana-devnet`, `solana`) are not accepted: any other value makes `proxy.ts` throw an error that lists these two ids.

---

## Usage

### Creating Protected Content

Simply create pages under protected routes defined in your proxy:

```tsx
// app/content/premium/page.tsx
export default async function PremiumPage() {
  return (
    <div>
      <h1>Premium Content</h1>
      <p>This content requires payment to access.</p>
      {/* Your protected content here */}
    </div>
  )
}
```

### Adding New Price Tiers

1. Add the route configuration in `proxy.ts`
2. Create the corresponding page component
3. Users will automatically be prompted to pay when accessing the route

### Testing with Devnet

When using devnet:

- Payments use test tokens (no real money)
- Perfect for development and testing
- Get devnet USDC from the [Circle Faucet](https://faucet.circle.com/). The paying wallet doesn't need SOL: the facilitator pays the transaction fee

### Going to Production

To accept real payments:

1. Set `NEXT_PUBLIC_NETWORK=solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`
2. Set `NEXT_PUBLIC_FACILITATOR_URL` to a facilitator that supports Solana mainnet (see the note at the top of this README). With the testnet-only default, the server exits with `Facilitator does not support scheme "exact" on network "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"`.
3. Update your wallet address to your production wallet
4. Test thoroughly before deploying!
5. Consider implementing additional security measures

> **Note:** the built-in browser paywall (`@x402/paywall`) reads the payer's USDC balance and the token mint through the public mainnet RPC (`https://api.mainnet-beta.solana.com`), which rejects requests from browsers with `403 Access forbidden`. `@x402/paywall` has no option to change this RPC yet, so on mainnet the paywall can fail at the balance step (see [#196](https://github.com/solana-foundation/templates/issues/196)). Non-browser clients that send the `PAYMENT-SIGNATURE` header themselves, such as `@x402/fetch`, are not affected.

---

## Dependencies

This template uses minimal dependencies:

```json
{
  "dependencies": {
    "@x402/core": "^2.27.0",
    "@x402/next": "^2.27.0",
    "@x402/paywall": "^2.27.0",
    "@x402/svm": "^2.27.0",
    "next": "16.3.4",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  }
}
```

- **next** - Next.js framework
- **react** / **react-dom** - React library
- **@x402/next** - x402 payment proxy and `withX402` route wrapper for Next.js
- **@x402/core** - x402 resource server and facilitator client
- **@x402/svm** - Solana payment scheme
- **@x402/paywall** - Browser paywall for Solana wallets

---

## Learn More

### x402 Protocol

- [x402 Specification](https://github.com/x402-foundation/x402) - Official protocol documentation
- [x402 Next Package](https://www.npmjs.com/package/@x402/next) - Proxy and route wrapper used in this template

### Solana

- [Solana Documentation](https://docs.solana.com/) - Official Solana docs
- [Solana Explorer](https://explorer.solana.com/) - View transactions on-chain

### Coinbase Developer

- [CDP Docs](https://docs.cdp.coinbase.com/) - Coinbase Developer documentation

---

## Troubleshooting

### Payment Not Working

1. Check that `NEXT_PUBLIC_RECEIVER_ADDRESS` in `.env.local` is correct
2. Verify you're using the correct network (devnet vs mainnet)
3. Check browser console for errors
4. Make sure the paying wallet holds USDC on that network

### 402 Errors Not Displaying

1. Check the proxy matcher configuration in `proxy.ts`
2. Verify route paths match your page structure
3. Clear Next.js cache: `rm -rf .next && pnpm dev`

### During installation, viewing `--silent --ignore-scripts` flag

1. If you are using npm with Node 20.9+ and pnpm is not yet installed, some required scripts may be skipped due to the flags used.
2. Although the project files are generated, you will need to install pnpm to ensure all scripts run correctly and fix the setup.
3. Clean any partial install and install pnpm:

```bash
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml yarn.lock
pnpm install
```

---

## Support

For issues specific to this template, please open an issue on the repository.

For x402 protocol questions, refer to the [official documentation](https://github.com/x402-foundation/x402).

---

## License

MIT License - Feel free to use this template for your projects.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ from [Kronos](https://www.kronos.build/)**
