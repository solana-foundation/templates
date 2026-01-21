# LazorKit Starter (Next.js)

A Next.js template demonstrating passkey-based smart wallet integration on Solana using LazorKit.

## What is LazorKit?

LazorKit provides passkey-based authentication for Solana, enabling users to create non-custodial smart wallets secured by device biometrics (Face ID, Touch ID, Windows Hello) instead of seed phrases.

## Features

- Passkey authentication (no seed phrases)
- Non-custodial smart wallet
- SOL transfer example
- Built with Next.js 15, React 19, and Tailwind CSS

## Quick Start

```bash
pnpm create solana-dapp@latest -t lazorkit-starter-next
```

```bash
cd <your-project>
pnpm install
```

Copy the environment file and configure:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and click "Connect Wallet" to create or access your passkey wallet.

## Environment Variables

| Variable                             | Description                             |
| ------------------------------------ | --------------------------------------- |
| `NEXT_PUBLIC_LAZORKIT_RPC_URL`       | Solana RPC endpoint (devnet or mainnet) |
| `NEXT_PUBLIC_LAZORKIT_PORTAL_URL`    | LazorKit portal for passkey auth        |
| `NEXT_PUBLIC_LAZORKIT_PAYMASTER_URL` | Paymaster for transaction fees          |

## Project Structure

```
app/
├── layout.tsx      # Root layout with providers
├── page.tsx        # Main page with wallet demo
├── providers.tsx   # LazorKit provider setup
└── globals.css     # Tailwind styles
```

## Key Integration Points

### Provider Setup (`providers.tsx`)

```tsx
import { LazorkitProvider } from '@lazorkit/wallet'
;<LazorkitProvider
  rpcUrl={process.env.NEXT_PUBLIC_LAZORKIT_RPC_URL!}
  portalUrl={process.env.NEXT_PUBLIC_LAZORKIT_PORTAL_URL!}
  paymasterConfig={{
    paymasterUrl: process.env.NEXT_PUBLIC_LAZORKIT_PAYMASTER_URL!,
  }}
>
  {children}
</LazorkitProvider>
```

### Using the Wallet Hook (`page.tsx`)

```tsx
import { useWallet } from '@lazorkit/wallet'

const {
  smartWalletPubkey, // User's smart wallet address
  isConnected, // Connection status
  connect, // Connect/create wallet
  disconnect, // Disconnect wallet
  signAndSendTransaction, // Sign and send transactions
} = useWallet()
```

## Resources

- [LazorKit Documentation](https://docs.lazorkit.com/)
- [LazorKit GitHub](https://github.com/lazor-kit)

## License

MIT
