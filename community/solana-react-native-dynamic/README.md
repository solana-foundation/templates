# Solana Expo + Dynamic

An Expo / React Native starter integrating [Dynamic](https://www.dynamic.xyz) embedded wallets, social login, and multi-chain auth for Solana. Users sign in with email, SMS, or social (Google, Apple, etc.) and get an MPC wallet provisioned on Solana — no extension required.

## Features

- Dynamic embedded wallets via `@dynamic-labs/react-native-extension`
- Solana wallet detection with `isSolanaWallet`
- SOL balance fetching and SOL transfer
- TypeScript + Expo

## Requirements

This template needs an **Expo development build** — it will not run on Expo Go because the Dynamic React Native extension uses native modules (`expo-secure-store`, `expo-web-browser`).

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Add your Environment ID from the [Dynamic Dashboard](https://app.dynamic.xyz/dashboard/developer):

```env
EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your-environment-id-here
```

### 3. Run a development build

```bash
# Android
pnpm android

# iOS (requires macOS + Xcode)
pnpm ios
```

`pnpm start` alone (Expo Go) will not work — you need the custom dev build created by `expo run:android` / `expo run:ios`.

## Key Files

- `App.tsx` — Wraps the app in `DynamicContextProvider` + `ReactNativeExtension`, shows a wallet + send-SOL screen
- `index.js` — Imports `react-native-get-random-values` (required for web3.js) before app mount
- `app.json` — Expo config with `expo-secure-store` + `expo-web-browser` plugins

## Dynamic SDK

The core setup in `App.tsx`:

```tsx
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { ReactNativeExtension } from '@dynamic-labs/react-native-extension'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
;<DynamicContextProvider
  settings={{
    environmentId: process.env.EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
    walletConnectors: [SolanaWalletConnectors],
  }}
>
  <ReactNativeExtension>{/* your app */}</ReactNativeExtension>
</DynamicContextProvider>
```

## Resources

- [Dynamic React Native Docs](https://www.dynamic.xyz/docs/react-native/overview)
- [Solana Wallets with Dynamic (RN)](https://www.dynamic.xyz/docs/react-native/wallets/using-wallets/solana/solana-wallets)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Dynamic Dashboard](https://app.dynamic.xyz)
