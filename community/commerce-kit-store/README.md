# Solana Commerce Kit Store

A Next.js e-commerce template demonstrating USDC payments on Solana using the Commerce Kit.

Requires Node.js 24 or newer. Wallet connection uses Kit 8 RPC and wallet plugins with `@solana/react`.

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
3. **Payment** - User pays with a connected V1-capable wallet, or scans the QR with a Solana wallet
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

# Keep this aligned with the RPC endpoint and USDC mint
NEXT_PUBLIC_SOLANA_CLUSTER=mainnet

# Optional: WebSocket endpoint when your RPC provider uses a separate URL
# NEXT_PUBLIC_RPC_WS_URL=wss://api.mainnet-beta.solana.com

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

For local payment tests, use `NEXT_PUBLIC_SOLANA_CLUSTER=devnet`, the devnet RPC endpoint and devnet USDC mint together. Do not use real funds for testing.

The public Solana RPC endpoints can determine the wallet network when the cluster is omitted. Custom RPC endpoints require an explicit `NEXT_PUBLIC_SOLANA_CLUSTER`; conflicting public RPC and cluster settings are rejected.

### Transaction Versions

The store accepts legacy, V0 and V1 payment transactions. A Solana Pay transfer QR does not choose the transaction version: the scanning wallet constructs and signs the payment. The store requests transaction details with V1 support enabled and verifies the actual USDC increase received by the merchant, the mint, the checkout reference and transaction success before confirming an order.

The checkout's **Pay with connected wallet** action builds and sends V1 transactions. It requires a wallet advertising V1 support, checks USDC and SOL balances, and creates the merchant's associated token account if necessary. Connecting a wallet alone never sends a payment. QR checkout remains an alternative whose transaction version is selected by the scanning wallet.

If sending returns an uncertain result, do not pay again. Keep the checkout open while its reference is checked on-chain. Confirmation is based on the merchant's actual received tokens, not merely the wallet returning success. This starter does not provide persistent order recovery after a page reload; production stores should persist order references and reconcile payments server-side.

Closing is disabled while a connected-wallet payment is being sent or awaiting verification. Temporary RPC errors retry with backoff without replacing the checkout reference.

The SDK's structured failure information allows another attempt when sending never started, or when a signed attempt is finalized as failed or absent after finalized blockhash expiry. An unknown outcome remains locked rather than assuming payment failed.

## Solana Integration

### Key Files

| File                                                   | Purpose                                                  |
| ------------------------------------------------------ | -------------------------------------------------------- |
| `src/hooks/use-headless-checkout.ts`                   | Main payment hook - QR generation, polling, verification |
| `src/hooks/use-wallet-payment.ts`                      | Connected-wallet V1 payment and retry protection         |
| `src/lib/prepare-wallet-payment.ts`                    | Balance checks and checked USDC transfer instructions    |
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

// 4. Verify the payment on-chain, including V1 transactions
const result = await verifyUsdcPayment(rpc, signature, {
  amount: expectedMinorUnits,
  recipient,
  mint,
  reference,
})
```

### Dependencies

| Package                     | Purpose                                 |
| --------------------------- | --------------------------------------- |
| `@solana-commerce/headless` | Payment requests and QR codes           |
| `@solana/kit`               | Key generation, address utilities       |
| `@solana/kit-plugin-rpc`    | RPC client for blockchain queries       |
| `@solana/kit-plugin-wallet` | Wallet Standard discovery and lifecycle |
| `@solana/react`             | React client provider and hooks         |
| `@solana-program/token`     | Checked token transfer and ATA creation |

Payment verification lives in `src/lib/verify-payment.ts`. It checks received token-balance deltas rather than the merchant's existing token balance.

## Validation

```bash
npm run ci
```

This runs the production build, lint, formatting and automated payment-verification/checkout tests. Manually verify wallet connection, account switching, reload restoration, disconnect, cart checkout, QR generation and a devnet USDC payment. Confirm an order only after verification succeeds.

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
