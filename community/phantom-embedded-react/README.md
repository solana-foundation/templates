# Phantom Embedded Wallet React Starter

A modern, production-ready starter template for building Solana dApps with the [Phantom Connect SDK](https://docs.phantom.com/sdks/react-sdk).

## Features

- ⚡️ **Next.js 16** - Latest App Router with React Server Components
- 👻 **Phantom Connect SDK** - Integrated wallet with built-in modal UI
- 🔑 **OAuth Support** - Google, Apple, and Phantom Login authentication
- 🎨 **Tailwind CSS** - Utility-first styling with custom design tokens
- 🌗 **Dark Mode** - Built-in dark mode support
- 📱 **Responsive** - Mobile-first responsive design
- 🔐 **TypeScript** - Full type safety

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [@phantom/react-sdk](https://docs.phantom.com/sdks/react-sdk) - Phantom Connect SDK for React
- [@phantom/browser-sdk](https://docs.phantom.com/sdks/browser-sdk) - Phantom Connect SDK core
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana JavaScript API
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd phantom-embedded-react-starter
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your configuration.

### Development

Run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build

Build the application for production:

```bash
pnpm build
# or
npm run build
```

### Start Production Server

```bash
pnpm start
# or
npm start
```

## Project Structure

```
phantom-embedded-react-starter/
├── public/ # Static assets
│   └── phantom-logo.png
├── src/
│   ├── app/ # Next.js App Router
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── page.tsx # OAuth callback handler
│   │   ├── globals.css # Global styles with design tokens
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx # Home page
│   ├── components/ # React components
│   │   ├── ConnectWalletButton.tsx # Main wallet connection UI
│   │   ├── ThemeToggle.tsx # Dark/light mode toggle
│   │   └── icons/ # Icon components
│   └── provider/
│       ├── ConnectionProvider.tsx # PhantomProvider wrapper
│       └── ThemeProvider.tsx # Theme context
├── .env.example # Environment variables template
├── next.config.js # Next.js configuration
└── tsconfig.json # TypeScript configuration
```

## Design System

This starter uses a custom design token system for consistent theming:

- **Color Tokens**: Defined in `globals.css` using CSS variables
- **Tailwind Integration**: Design tokens mapped to Tailwind utilities
- **Dark Mode**: Automatic dark mode support via `prefers-color-scheme`

### Key Design Tokens

- `--color-brand`: Primary brand color
- `--color-ink`: Primary text color
- `--color-paper`: Background color
- Additional semantic colors for states (success, warning, info)

## Phantom SDK Configuration

### PhantomProvider Config

The SDK is configured in `src/provider/ConnectionProvider.tsx`:

```javascript
<PhantomProvider
  config={{
    appId: "your-app-id", // From Phantom Portal
    addressTypes: [AddressType.solana], // Supported chains
    providers: ["google", "apple", "phantom", "injected"],
    authOptions: {
      redirectUrl: "https://yourapp.com/auth/callback", // Required for OAuth
    },
  }}
  theme={darkTheme}
  appName="Your App Name"
  appIcon="/your-icon.png"
>
```

### OAuth Callback

The `/auth/callback` page handles OAuth flow automatically. The `PhantomProvider`
processes the callback parameters when the page loads:

```javascript
import { usePhantom } from "@phantom/react-sdk";

function AuthCallbackPage() {
  const { isConnected, isLoading, connectError } = usePhantom();

  // Redirect once connected
  useEffect(() => {
    if (isConnected) router.push("/");
  }, [isConnected]);

  if (connectError) return <ErrorUI />;
  return <LoadingUI />;
}
```

### Signing Transactions

For embedded wallets (Google/Apple OAuth), use `signAndSendTransaction`:

```javascript
import { useSolana } from "@phantom/react-sdk";

function MyComponent() {
  const { solana, isAvailable } = useSolana();

  const handleTransaction = async (transaction) => {
    // Always check availability before calling
    if (!isAvailable || !solana?.signAndSendTransaction) {
      console.error("Solana provider not available");
      return;
    }

    const result = await solana.signAndSendTransaction(transaction);
    console.log("TX hash:", result.hash);
  };
}
```

> **Note**: Embedded wallets do NOT support `signTransaction` or `signAllTransactions`.
> Use `signAndSendTransaction` which signs and broadcasts in a single step.

### Phantom Portal Setup

1. Go to [Phantom Portal](https://phantom.app/portal)
2. Create/select your app
3. Copy your App ID
4. Add your redirect URLs to the allowlist (e.g., `http://localhost:3000/auth/callback`)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PHANTOM_APP_ID` | App ID from Phantom Portal | Yes (for OAuth) |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Custom Solana RPC URL | No |
| `NEXT_PUBLIC_APP_URL` | Your app's URL (for OAuth callback) | No |

See `.env.example` for the template.

## License

ISC

## Learn More

- [Phantom React SDK](https://docs.phantom.com/sdks/react-sdk) - SDK documentation
- [Sign & Send Transactions](https://docs.phantom.com/sdks/react-sdk/sign-and-send-transaction) - Transaction signing guide
- [Connect Flow](https://docs.phantom.com/sdks/react-sdk/connect) - OAuth connection setup
- [Phantom Portal](https://phantom.app/portal) - App configuration
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
