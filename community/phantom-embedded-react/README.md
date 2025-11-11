# Phantom Embedded React Starter

A minimal Next.js starter template for integrating Phantom's embedded user wallets on Solana using React hooks. This template provides a clean, production-ready foundation for building decentralized applications with Phantom Connect authentication.

## Features

- **OAuth Authentication** - Users login with Google or Apple via Phantom Connect
- **Embedded User Wallet** - No browser extension required
- **Solana Account Management** - View wallet address and SOL balance
- **Modern Stack** - Built with Next.js 14, TypeScript, and Tailwind CSS
- **React Hooks** - Simple integration using `@phantom/react-sdk` hooks
- **Responsive Design** - Mobile-first UI that works on all devices
- **Type-Safe** - Full TypeScript support for better developer experience

## Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** package manager
- A **Phantom App ID** from [Phantom Portal](https://phantom.com/portal/)
- **Whitelisted redirect URL** in your Phantom Portal app configuration

### Installation

1. **Clone or create from template**

```bash
npx create-solana-dapp@latest my-phantom-app --template phantom-embedded-react-starter
cd my-phantom-app
```

Or clone directly:

```bash
git clone https://github.com/phantom/phantom-embedded-react-starter.git
cd phantom-embedded-react-starter
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Add your Phantom App ID and redirect URL to `.env.local`:

```env
NEXT_PUBLIC_PHANTOM_APP_ID=your-app-id-here
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**Important:** The `NEXT_PUBLIC_REDIRECT_URL` must be whitelisted in your Phantom Portal under URL Config!

4. **Configure Phantom Portal**

- Visit [Phantom Portal](https://phantom.com/portal/)
- Sign up or log in with your wallet
- Create a new application or select existing one
- Go to **URL Config** in the left menu
- **Whitelist your redirect URL:**
  - For local dev: `http://localhost:3000/`
  - For production: `https://yourdomain.com/`
- Scroll down to find your **App ID** (shown at bottom of URL Config page)
- Copy the App ID and paste it into `.env.local`

5. **Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## Project Structure

```
phantom-embedded-react-starter/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with wallet UI
│   ├── providers.tsx       # PhantomProvider configuration
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── ConnectButton.tsx   # Wallet connection button
│   ├── WalletInfo.tsx      # Address and balance display
│   └── LoadingSpinner.tsx  # Reusable loading component
├── lib/
│   ├── solana.ts           # Solana RPC helpers
│   └── utils.ts            # Utility functions
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
└── .env.example            # Environment variables template
```

## How It Works

### 1. OAuth Authentication Flow

This template uses **embedded user wallets** with OAuth authentication:

1. User clicks "Login with Phantom"
2. Redirects to Phantom Connect (`https://connect.phantom.app/login`)
3. User logs in with **Google or Apple**
4. Phantom redirects back to your app with authentication
5. User can now access their Phantom wallet

### 2. PhantomProvider Setup

The app uses `PhantomProvider` to configure the embedded wallet with OAuth:

```typescript
import { PhantomProvider } from '@phantom/react-sdk';
import { AddressType } from '@phantom/browser-sdk';

<PhantomProvider
  config={{
    providerType: 'embedded',
    addressTypes: [AddressType.solana],
    appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID!,
    authOptions: {
      authUrl: 'https://connect.phantom.app/login',
      redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    },
  }}
>
  {children}
</PhantomProvider>
```

**Important:** 
- Import `AddressType` from `@phantom/browser-sdk` (not `@phantom/react-sdk`)
- The `redirectUrl` must be an existing page in your app
- The `redirectUrl` must be whitelisted in Phantom Portal
- Users authenticate via Google/Apple OAuth, not browser extension

### 3. React Hooks

The template uses three main hooks from `@phantom/react-sdk`:

**useConnect** - Handle wallet connection
```typescript
const { connect, isLoading } = useConnect();
```

**useAccounts** - Access connected accounts
```typescript
const accounts = useAccounts();
const solanaAccount = accounts?.[0];
```

**useDisconnect** - Handle wallet disconnection
```typescript
const { disconnect, isLoading } = useDisconnect();
```

### 4. Balance Fetching

The template uses standard Solana Web3.js to fetch balances:

```typescript
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function getBalance(address: string): Promise<number> {
  const connection = new Connection(RPC_URL);
  const publicKey = new PublicKey(address);
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}
```

## Customization

### Styling

The template uses Tailwind CSS with custom Phantom branding. You can customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: '#ab9ff2',  // Phantom purple
      // Add your custom colors here
    },
  },
}
```

### Adding Features

To extend the template:

1. **Add new components** in the `components/` directory
2. **Add utility functions** in the `lib/` directory
3. **Create new pages** in the `app/` directory (App Router)

**Example:** Adding a transaction feature

```typescript
// components/SendTransaction.tsx
'use client';

import { usePhantom } from '@phantom/react-sdk';

export function SendTransaction() {
  const { provider } = usePhantom();
  
  const handleSend = async () => {
    // Your transaction logic here
  };
  
  return <button onClick={handleSend}>Send SOL</button>;
}
```

### Environment Variables

All environment variables for client-side access must use the `NEXT_PUBLIC_` prefix:

```env
NEXT_PUBLIC_PHANTOM_APP_ID=your-app-id
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**Critical:** Make sure your `NEXT_PUBLIC_REDIRECT_URL` is whitelisted in Phantom Portal under **URL Config** → **Allowed Origins & Redirect URLs**

## Troubleshooting

### "Configuration Error" message

**Problem:** The app shows a configuration error screen.

**Solution:** Make sure you've:
1. Created `.env.local` file (not `.env`)
2. Added your Phantom App ID
3. Added your redirect URL
4. Whitelisted the redirect URL in Phantom Portal
5. Restarted the development server

### Balance not loading

**Problem:** The wallet connects but balance shows as 0.0000 SOL.

**Possible causes:**
- The wallet is actually empty (check on [Solscan](https://solscan.io/))
- RPC endpoint is down (try a different RPC URL)
- Network connectivity issues

**Solution:** Try using a different RPC endpoint in `.env.local`:

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-api-key
```

### TypeScript errors

**Problem:** TypeScript compilation errors.

**Solution:** Make sure you've installed all dependencies:

```bash
pnpm install
```

If errors persist, delete and rebuild:

```bash
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Wallet connection fails

**Problem:** "Login with Phantom" button doesn't work or redirects fail.

**Possible causes:**
- Invalid App ID
- Redirect URL not whitelisted in Phantom Portal
- Network issues
- Outdated SDK version

**Solution:**
1. Verify your App ID at [Phantom Portal](https://phantom.com/portal/)
2. **Check redirect URL is whitelisted** in Portal under URL Config
3. Make sure redirect URL matches exactly (including trailing slash)
4. Check browser console for errors
5. Update dependencies: `pnpm update @phantom/react-sdk @phantom/browser-sdk`

**Common redirect URL issues:**
- `http://localhost:3000` vs `http://localhost:3000/` (trailing slash matters!)
- Production URL must use HTTPS
- URL must be an existing page in your app

## Resources

### Documentation
- [Phantom React SDK Docs](https://docs.phantom.com/sdks/react-sdk)
- [Phantom Portal](https://phantom.com/portal/)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Next.js Documentation](https://nextjs.org/docs)

### Support
- [Phantom React SDK Documentation](https://docs.phantom.com/sdks/react-sdk)
- [Phantom Discord](https://discord.gg/phantom)
- [Solana Stack Exchange](https://solana.stackexchange.com/)

### Community Templates
- [Solana Foundation Templates](https://github.com/solana-foundation/solana-com/tree/main/content/cookbook)
- [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp)

## Building for Production

### Build

```bash
pnpm build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
pnpm start
```

### Deploy

The template works with any hosting platform that supports Next.js:

**Before deploying:**
1. Whitelist your production URL in Phantom Portal (e.g., `https://yourdomain.com/`)
2. Set environment variables in your hosting platform

**Vercel** (Recommended)
```bash
# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_PHANTOM_APP_ID=your-app-id
# NEXT_PUBLIC_REDIRECT_URL=https://yourdomain.com/
# NEXT_PUBLIC_SOLANA_RPC_URL=your-rpc-url

pnpm dlx vercel
```

**Netlify**
```bash
# Set environment variables in Netlify dashboard
pnpm build
# Deploy the .next directory
```

**Self-hosted**
```bash
# Create .env.local on server with production values
pnpm build
pnpm start
```

**Important for Production:**
- Production redirect URL **must use HTTPS**
- Whitelist exact production URL in Phantom Portal (including trailing slash)
- Use a reliable RPC provider (Helius, QuickNode, Alchemy)

## Security Best Practices

1. **Never commit `.env.local`** - This file contains sensitive credentials
2. **Use environment variables** - Never hardcode API keys or secrets
3. **Validate user input** - Always sanitize and validate data from users
4. **Keep dependencies updated** - Regularly update packages for security patches
5. **Use HTTPS in production** - Always serve your app over HTTPS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Phantom SDK](https://phantom.app/)
- Powered by [Solana](https://solana.com/)
- Created with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Need help?** Visit the [Phantom React SDK Documentation](https://docs.phantom.com/sdks/react-sdk) for support.

