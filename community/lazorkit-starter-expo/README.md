# LazorKit Starter (Expo)

A React Native (Expo) template demonstrating passkey-based smart wallet integration on Solana using LazorKit.

## What is LazorKit?

LazorKit provides passkey-based authentication for Solana, enabling users to create non-custodial smart wallets secured by device biometrics (Face ID, Touch ID) instead of seed phrases.

## Features

- Passkey authentication (no seed phrases)
- Non-custodial smart wallet
- Native mobile experience
- Built with Expo, React Native, and expo-router

## Quick Start

```bash
pnpm create solana-dapp@latest -t lazorkit-starter-expo
```

```bash
cd <your-project>
pnpm install
```

Start the Expo development server:

```bash
pnpm start
```

Then:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your device

## Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx    # Tab navigation
│   ├── index.tsx      # Home screen
│   └── explore.tsx    # Explore screen
├── _layout.tsx        # Root layout
├── modal.tsx          # Modal screen
└── wallet.tsx         # Wallet integration screen
```

## LazorKit Mobile Integration

This template uses `@lazorkit/wallet-mobile-adapter` for React Native integration:

```tsx
import { useLazorkitWallet } from '@lazorkit/wallet-mobile-adapter'

const {
  smartWalletPubkey, // User's smart wallet address
  isConnected, // Connection status
  connect, // Connect/create wallet
  disconnect, // Disconnect wallet
  signAndSendTransaction, // Sign and send transactions
} = useLazorkitWallet()
```

## Resources

- [LazorKit Documentation](https://docs.lazorkit.com/)
- [LazorKit GitHub](https://github.com/lazor-kit)
- [Expo Documentation](https://docs.expo.dev/)

## License

MIT
