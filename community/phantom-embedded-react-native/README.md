# Phantom Embedded React Native Starter

A minimal Expo starter template for integrating Phantom's embedded user wallets on Solana for mobile apps.

## ✨ Features

- 🔐 **Phantom Connect Authentication** - Secure OAuth-based wallet connection
- 👛 **Embedded User Wallet** - No browser extension required
- 💰 **Solana Balance Display** - Real-time SOL balance fetching
- 📋 **Address Management** - Copy wallet address to clipboard
- 🔄 **Balance Refresh** - Manual balance updates
- 🚪 **Disconnect Functionality** - Clean session management
- 📱 **Mobile-First Design** - Optimized for iOS and Android
- 🎨 **Dark Theme UI** - Beautiful Phantom-branded interface

## 🚨 Important: Development Builds Required

**This template requires a custom development build and will NOT work with Expo Go.**

The Phantom React Native SDK requires native modules that are not available in Expo Go. You must create a development build to test this app.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **pnpm** package manager (`npm install -g pnpm`)
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (macOS) or **Android Emulator** set up
- **Phantom App ID** from [Phantom Portal](https://phantom.app/developer)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file and add your Phantom App ID:

```bash
cp .env.example .env
```

Edit `.env` and add your Phantom App ID:

```env
EXPO_PUBLIC_PHANTOM_APP_ID=your-app-id-here
EXPO_PUBLIC_APP_SCHEME=your-app-scheme
EXPO_PUBLIC_SOLANA_RPC_URL=your-prefered-rpc
```

### 3. Get Your Phantom App ID

1. Visit [Phantom Portal](https://phantom.app/developer)
2. Sign in with your Phantom wallet
3. Create a new app or use an existing one
4. Copy your **App ID** (not Organization ID)
5. Add the redirect URI: `phantomwallet://phantom-auth-callback`

### 4. Create Development Build

**For iOS:**

```bash
pnpm run ios
```

This will:

- Run `expo prebuild` to generate native code
- Install iOS dependencies via CocoaPods
- Build and launch the app in iOS Simulator

**For Android:**

```bash
pnpm run android
```

This will:

- Run `expo prebuild` to generate native code
- Build and launch the app in Android Emulator

## 🔧 Configuration

### URL Scheme

The URL scheme is critical for OAuth deep linking. It must match in two places:

**1. app.json:**

```json
{
  "expo": {
    "scheme": "phantomwallet"
  }
}
```

**2. .env file:**

```env
EXPO_PUBLIC_APP_SCHEME=phantomwallet
```

The complete redirect URI will be: `phantomwallet://phantom-auth-callback`

### Solana RPC Endpoint

By default, the app uses Solana mainnet-beta. You can customize the RPC endpoint:

```env
EXPO_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

For production apps, consider using a dedicated RPC provider like:

- [Helius](https://helius.dev)
- [QuickNode](https://quicknode.com)
- [Alchemy](https://alchemy.com)

## 📁 Project Structure

```
phantom-embedded-react-native-starter/
├── app/
│   ├── _layout.tsx          # Root layout with PhantomProvider
│   ├── index.tsx            # Home screen (connect button)
│   └── wallet.tsx           # Wallet screen (account info)
├── components/
│   ├── ConnectButton.tsx    # Phantom Connect button
│   ├── WalletInfo.tsx       # Wallet details display
│   └── LoadingSpinner.tsx   # Reusable loading component
├── lib/
│   ├── solana.ts            # Solana balance fetching
│   └── utils.ts             # Utility functions
├── assets/                  # App icons and images
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── .env.example             # Environment variables template
```

### Key Files Explained

#### `app/_layout.tsx`

**CRITICAL:** The polyfill import MUST be first!

```typescript
// THIS MUST BE THE FIRST IMPORT!
import 'react-native-get-random-values'

import { PhantomProvider, AddressType } from '@phantom/react-native-sdk'
```

This file:

- Sets up the PhantomProvider with your App ID
- Configures the URL scheme for OAuth callbacks
- Defines the navigation structure

#### `components/ConnectButton.tsx`

Handles Phantom Connect authentication using the `useConnect()` hook. On successful connection, navigates to the wallet screen.

#### `components/WalletInfo.tsx`

Displays connected wallet information:

- Solana address (truncated)
- SOL balance with refresh
- Copy address functionality
- Disconnect button

#### `lib/solana.ts`

Solana blockchain interaction:

- Connects to Solana RPC
- Fetches wallet balance
- Converts lamports to SOL

## 🔌 Deep Linking

The app uses deep linking for OAuth callbacks. Here's how it works:

1. User taps "Connect with Phantom"
2. App opens Phantom Connect in browser
3. User authenticates with Phantom
4. Phantom redirects back to app via: `phantomwallet://phantom-auth-callback`
5. SDK handles the callback and creates session

### Troubleshooting Deep Links

If deep linking isn't working:

1. **Check URL scheme matches** in `app.json` and `.env`
2. **Verify App ID** is correct in `.env`
3. **Ensure redirect URI** is added in Phantom Portal
4. **Rebuild the app** after changing `app.json`

## 🧪 Testing on Physical Devices

### iOS Device

1. Create a development build:

   ```bash
   pnpm run ios --device
   ```

2. Or build with EAS:

   ```bash
   eas build --profile development --platform ios
   ```

3. Install the build on your device

### Android Device

1. Enable USB debugging on your device

2. Connect device via USB

3. Run:
   ```bash
   pnpm run android --device
   ```

## 🛠️ Development

### Start Development Server

```bash
pnpm start
```

This opens the Expo development server. Press:

- `i` to open iOS Simulator
- `a` to open Android Emulator
- `r` to reload the app

### Clear Cache

If you encounter issues:

```bash
pnpm start --clear
```

## 📚 API Reference

### Phantom Hooks

#### `useConnect()`

Initiates Phantom Connect flow:

```typescript
const { connect, isLoading } = useConnect()

await connect()
```

#### `useAccounts()`

Returns array of connected accounts:

```typescript
const accounts = useAccounts()
const solanaAccount = accounts?.[0]
```

#### `useDisconnect()`

Disconnects the current session:

```typescript
const { disconnect, isLoading } = useDisconnect()

await disconnect()
```

### Custom Functions

#### `getBalance(address: string)`

Fetches SOL balance for an address:

```typescript
import { getBalance } from '@/lib/solana'

const balance = await getBalance('5eykt...3j9ss')
console.log(`Balance: ${balance} SOL`)
```

#### `truncateAddress(address: string, chars?: number)`

Truncates long addresses for display:

```typescript
import { truncateAddress } from '@/lib/utils'

const short = truncateAddress('5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp...', 4)
// Returns: "5eyk...j9ss"
```

## 🐛 Troubleshooting

### "Module not found: react-native-get-random-values"

**Solution:** Ensure the polyfill is imported first in `app/_layout.tsx`.

### "Invalid appId"

**Solution:**

1. Check your App ID in `.env`
2. Ensure you're using `appId`, NOT `organizationId`
3. Verify the App ID in Phantom Portal

### "Deep linking not working"

**Solution:**

1. Rebuild the app after changing URL scheme
2. Verify redirect URI in Phantom Portal
3. Check `app.json` and `.env` match

### "Failed to fetch balance"

**Solution:**

1. Check RPC endpoint is reachable
2. Verify wallet address is valid
3. Try using a different RPC provider

### "Expo Go not working"

**Expected behavior.** Expo Go doesn't support the native modules required by Phantom SDK. You must create a development build.

## 🔒 Security Best Practices

1. **Never commit `.env`** - Keep your App ID private
2. **Use environment variables** - Don't hardcode sensitive values
3. **Validate user input** - Always check wallet addresses
4. **Handle errors gracefully** - Provide user-friendly error messages
5. **Use HTTPS RPC endpoints** - Ensure secure connections

## 📖 Resources

- [Phantom React Native SDK Docs](https://docs.phantom.com/sdks/react-native-sdk)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Solana Web3.js Docs](https://github.com/solana-foundation/solana-web3.js)

## 💬 Support

- **Phantom Discord:** [discord.gg/phantom](https://discord.gg/phantom)
- **Phantom Twitter:** [@phantom](https://twitter.com/phantom)
- **Report Issues:** [GitHub Issues](https://github.com/phantom/phantom-embedded-react-native-starter/issues)

## ⚡ Next Steps

After getting the starter working:

1. **Add Transaction Signing** - Use `useSignTransaction()` hook
2. **Implement Message Signing** - Use `useSignMessage()` hook
3. **Multi-Chain Support** - Add Ethereum, Polygon, etc.
4. **Token Balances** - Fetch SPL token balances
5. **NFT Display** - Show user's NFT collection
6. **Custom Styling** - Match your brand colors
7. **Error Handling** - Add comprehensive error handling
8. **Analytics** - Track user interactions
9. **Production RPC** - Use a dedicated RPC provider
10. **Testing** - Add unit and integration tests

## 🎉 Success!

You now have a working Phantom embedded wallet integration! Your users can:

✅ Connect with Phantom using OAuth  
✅ View their Solana wallet address  
✅ Check their SOL balance  
✅ Copy their address  
✅ Disconnect their wallet

Build something amazing! 🚀
