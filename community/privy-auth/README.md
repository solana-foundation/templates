# Privy Auth Template

A clean, professional Next.js template demonstrating Privy authentication for Solana dApps. This template includes social logins, embedded wallet creation, user profile management, and protected routes.

## Features

- ✅ **Social Login Options** - Google, Twitter, Discord, Email, and Wallet authentication
- ✅ **Embedded Wallet Creation** - Automatic Solana wallet creation for users without wallets
- ✅ **User Profile Management** - Display and manage user accounts and wallet information
- ✅ **Protected Routes** - Example implementation of route protection using Privy sessions
- ✅ **TypeScript** - Fully typed for type safety
- ✅ **Tailwind CSS** - Modern, responsive UI design
- ✅ **Solana Integration** - Built with `@solana/kit` for Solana RPC connections

## Quick Start

### 1. Create a Privy Account

1. Go to [privy.io](https://privy.io) and sign up for a free account
2. Create a new app in the [Privy Dashboard](https://dashboard.privy.io)
3. Copy your App ID from the dashboard

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Privy App ID:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

### 3. Configure Auth Providers in Privy Dashboard

To enable social logins, configure them in your Privy Dashboard:

1. Go to [Dashboard](https://dashboard.privy.io) → Your App → **Authentication**
2. Enable the providers you want:
   - **Email** - No additional setup required
   - **Google** - Configure OAuth credentials
   - **Twitter** - Configure Twitter OAuth app
   - **Discord** - Configure Discord OAuth app
   - **Wallet** - Already enabled for Solana wallets

For detailed setup instructions for each provider, see the [Privy Authentication Docs](https://docs.privy.io/guide/react/social-logins).

### 4. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Embedded Wallet Features

Privy's embedded wallets provide several benefits:

- **Seamless Onboarding** - Users don't need to install browser extensions
- **Social Recovery** - Users can recover wallets using their social accounts
- **Multi-Device Access** - Wallets work across devices
- **Gasless Transactions** - Optional sponsored transaction support
- **Key Management** - Private keys are securely managed by Privy

The template is configured to automatically create embedded Solana wallets for users who log in without an existing wallet. This is controlled by the `createOnLogin: "users-without-wallets"` setting in the PrivyProvider configuration.

## Session Management

This template uses Privy's built-in session management:

- **Automatic Session Persistence** - User sessions persist across page refreshes
- **Session State** - Use `usePrivy()` hook to check authentication status
- **Protected Routes** - See `/protected` route for an example implementation

### Example: Checking Authentication Status

```typescript
import { usePrivy } from "@privy-io/react-auth";

function MyComponent() {
  const { ready, authenticated, user } = usePrivy();
  
  if (!ready) return <div>Loading...</div>;
  if (!authenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.email?.address}!</div>;
}
```

### Example: Protected Route

See `app/protected/page.tsx` for a complete example of protecting routes:

```typescript
useEffect(() => {
  if (ready && !authenticated) {
    router.push("/");
  }
}, [ready, authenticated, router]);
```

## Project Structure

```
app/
├── components/
│   ├── login-screen.tsx      # Login UI component
│   ├── user-profile.tsx       # User profile display
│   ├── providers.tsx          # PrivyProvider configuration
│   └── ui/
│       └── header.tsx         # Navigation header
├── protected/
│   └── page.tsx               # Protected route example
├── layout.tsx                 # Root layout with providers
└── page.tsx                   # Home page
```

## Type Definitions

The template includes TypeScript types for Privy user objects and sessions. The `usePrivy()` hook provides fully typed user objects:

```typescript
import { usePrivy } from "@privy-io/react-auth";

const { user } = usePrivy();

// user.email?.address
// user.phone?.number
// user.google?.email
// user.twitter?.username
// user.discord?.username
```

For Solana wallets:

```typescript
import { useWallets } from "@privy-io/react-auth";

const { wallets } = useWallets();
const solanaWallet = wallets.find(w => w.walletClientType === "privy");
```

## Learn More

- [Privy Documentation](https://docs.privy.io) - Complete Privy integration guide
- [Privy React Auth SDK](https://docs.privy.io/guide/react) - React-specific documentation
- [Solana Integration](https://docs.privy.io/guide/react/chains/solana) - Solana-specific features
- [Social Logins Setup](https://docs.privy.io/guide/react/social-logins) - Configure OAuth providers
- [Embedded Wallets](https://docs.privy.io/guide/react/wallets/embedded) - Embedded wallet documentation

## Deployment

The easiest way to deploy your Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `NEXT_PUBLIC_PRIVY_APP_ID` environment variable
4. Deploy!

Make sure to add your environment variables in your deployment platform's settings.

## License

MIT
