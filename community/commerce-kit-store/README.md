# Solana Commerce Kit Store

A Next.js e-commerce template demonstrating USDC payments on Solana using the Commerce Kit.

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  Add items  │ ──▶ │  Generate QR │ ──▶ │  Scan & Pay │ ──▶ │   Verified   │
│  to cart    │     │  with unique │     │  with any   │     │   on-chain   │
│             │     │  reference   │     │  Solana     │     │              │
└─────────────┘     └──────────────┘     │  wallet     │     └──────────────┘
                                         └─────────────┘
```

1. **Cart** - User adds products to their shopping cart
2. **Checkout** - App generates a Solana Pay QR code with a unique reference address
3. **Payment** - User scans the QR with any Solana wallet and sends USDC
4. **Verification** - App polls the blockchain, finds the transaction by reference, and verifies the amount

## Quick Start

### 1. Install

```bash
pnpm install
```

### 2. Configure

Create `.env.local`:

```bash
# Required: Your Solana wallet address to receive payments
NEXT_PUBLIC_MERCHANT_WALLET=<your-solana-wallet-address>

# RPC endpoint (mainnet or devnet)
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: USDC mint address (defaults to mainnet USDC)
# Mainnet: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
# Devnet:  4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
# NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

### 3. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Solana Integration

### Key Files

| File                                                   | Purpose                                                  |
| ------------------------------------------------------ | -------------------------------------------------------- |
| `src/hooks/use-headless-checkout.ts`                   | Main payment hook - QR generation, polling, verification |
| `src/components/checkout/headless-checkout-dialog.tsx` | Payment UI component                                     |
| `src/store/components/cart-drawer.tsx`                 | Cart with checkout integration                           |

### Payment Flow (useHeadlessCheckout)

```typescript
// 1. Generate a unique reference keypair
const referenceKeyPair = await generateKeyPair()
const reference = await getAddressFromPublicKey(referenceKeyPair.publicKey)

// 2. Create Solana Pay request with QR code
const { url, qr } = await createSolanaPayRequest({
  recipient: address(MERCHANT_WALLET),
  amount: BigInt(amountInMinorUnits),
  splToken: address(USDC_MINT),
  reference: reference, // This is how we track the payment
})

// 3. Poll for transactions containing our reference
const signatures = await rpc.getSignaturesForAddress(reference).send()

// 4. Verify the payment on-chain
const result = await verifyPayment(rpc, signature, expectedAmount, recipient, mint)
```

### Dependencies

| Package                     | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `@solana-commerce/headless` | Payment requests, QR codes, verification |
| `@solana/kit`               | Key generation, address utilities        |
| `@solana/client`            | RPC client for blockchain queries        |
| `@solana/react-hooks`       | React hooks for Solana client            |

### Why These Packages?

This template uses `@solana/kit` (the new Solana JavaScript SDK) instead of `@solana/web3.js`. Benefits:

- **Smaller bundle** - Tree-shakeable, only import what you need
- **Type-safe** - Better TypeScript support
- **Modern** - Uses native BigInt, no polyfills needed

## Project Structure

```
src/
├── hooks/
│   ├── use-headless-checkout.ts  # Payment flow hook
│   └── use-purchase-history.ts   # Transaction history
├── components/
│   ├── checkout/
│   │   └── headless-checkout-dialog.tsx  # Payment dialog
│   └── wallet-ui.tsx                     # Wallet connect button
├── store/
│   ├── components/               # Product grid, cart drawer
│   ├── hooks/                    # Cart, product selection
│   └── providers/                # Cart context
└── app/
    └── page.tsx                  # Store home
```

## Resources

- [Solana Commerce Kit Docs](https://launch.solana.com/docs/commerce-kit)
- [Solana Pay Specification](https://docs.solanapay.com)

## License

Apache-2.0
