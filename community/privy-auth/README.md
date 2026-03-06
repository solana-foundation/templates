# Privy + Solana Auth

A Next.js starter template demonstrating Privy authentication with social logins and embedded Solana wallets. Users can sign in with Google, Discord, or Twitter and automatically receive a non-custodial Solana wallet managed by Privy.

## Features

- **Social Login** - Google, Discord, and Twitter authentication via Privy
- **Embedded Solana Wallets** - Automatically created on first login for users without wallets
- **Protected Routes** - Dashboard route with authentication guards
- **Session Management** - JWT-based sessions with automatic refresh
- **TypeScript** - Full type safety with custom Privy type definitions
- **Modern Stack** - Next.js 16, React 19, Tailwind CSS 4

## Prerequisites

Before you start, make sure you have:

1. **Node.js 18+** installed
2. **A Privy account** - Create one at [dashboard.privy.io](https://dashboard.privy.io)
3. **pnpm** (recommended) or npm/yarn

## Quick Start

### 1. Create Template

```bash
pnpm create solana-dapp my-app --template privy-auth
cd my-app
```

### 2. Get Privy App ID

1. Go to [Privy Dashboard](https://dashboard.privy.io) and sign in
2. Click "Create New App" or select an existing app
3. Copy your **App ID** from the dashboard (looks like `clp...`)

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Add your Privy App ID to `.env.local`:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
```

### 4. Install and Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and click "Login with Privy" to test authentication.

## Privy Dashboard Configuration

To enable all features in this template, configure your Privy app in the dashboard:

### Login Methods

1. In your Privy Dashboard, go to **Settings** → **Login Methods**
2. Enable the following providers:
   - **Google** - Click "Enable" and configure OAuth (Privy handles the OAuth app setup)
   - **Discord** - Click "Enable" and configure OAuth
   - **Twitter** - Click "Enable" and configure OAuth
3. Save changes

The template is pre-configured to use these three providers. You can add or remove providers by modifying the `loginMethods` array in [`components/PrivyAppProvider.tsx`](components/PrivyAppProvider.tsx).

### Embedded Wallets

1. Go to **Settings** → **Embedded Wallets**
2. Enable **Solana** as a supported chain
3. Set the creation policy:
   - **Recommended**: "Create for users without wallets" (default in template)
   - Alternative: "Create for all users" or "Off"
4. Choose your Solana network:
   - **Development**: Devnet
   - **Production**: Mainnet-beta
5. Save changes

The template configures this in [`components/PrivyAppProvider.tsx`](components/PrivyAppProvider.tsx):

```typescript
embeddedWallets: {
  solana: {
    createOnLogin: "users-without-wallets",
  },
}
```

### Allowed Origins

1. Go to **Settings** → **Basics**
2. Under **Allowed Origins**, add:
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://myapp.com`)
3. Save changes

Without this, authentication will fail with CORS errors.

### App Appearance (Optional)

Customize your login modal:
1. Go to **Settings** → **Appearance**
2. Upload your logo
3. Choose accent color
4. Customize button text and branding

## How It Works

### Authentication Flow

1. User clicks "Login with Privy" button
2. Privy modal opens with configured login methods (Google, Discord, Twitter)
3. User selects a provider and completes OAuth flow
4. Privy creates a session and returns user data
5. If user doesn't have a Solana wallet, Privy automatically creates an embedded wallet
6. User is redirected to the app with active session

### Session Management

Privy uses JWT tokens for session management:

- **Access tokens** are stored securely by the Privy SDK
- **Sessions persist** across page refreshes via secure cookies
- **Automatic refresh** - Privy handles token refresh automatically
- **Session validation** - Use `authenticated` and `ready` from `usePrivy()` hook

Example session check:

```typescript
const { authenticated, ready, user } = usePrivy();

if (!ready) return <div>Loading...</div>;
if (!authenticated) return <div>Please sign in</div>;
```

### Embedded Wallet Creation

When a user signs in without an existing wallet:

1. Privy generates a new Solana keypair
2. The private key is encrypted and stored securely by Privy
3. The wallet is linked to the user's account
4. The wallet address is accessible via `user.wallet.address`

Users can export their wallet or use it directly through Privy's SDK for signing transactions.

### Protected Routes

The [`app/dashboard/page.tsx`](app/dashboard/page.tsx) demonstrates protected route implementation:

```typescript
useEffect(() => {
  if (ready && !authenticated) {
    router.push("/");
  }
}, [ready, authenticated, router]);
```

This pattern redirects unauthenticated users to the home page.

## Project Structure

```
privy-auth/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Protected route with session demo
│   ├── layout.tsx             # Root layout with PrivyProvider
│   ├── page.tsx               # Home page with login/user info
│   └── globals.css
├── components/
│   └── PrivyAppProvider.tsx   # Privy configuration
├── types/
│   └── privy.ts               # TypeScript type definitions
├── .env.example
└── package.json
```

## Key Components

### PrivyAppProvider

[`components/PrivyAppProvider.tsx`](components/PrivyAppProvider.tsx) wraps your app with Privy's context:

```typescript
<PrivyProvider
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
  config={{
    loginMethods: ["google", "discord", "twitter"],
    embeddedWallets: {
      solana: {
        createOnLogin: "users-without-wallets",
      },
    },
  }}
>
  {children}
</PrivyProvider>
```

### Using Privy Hooks

Access authentication state anywhere in your app:

```typescript
import { usePrivy } from "@privy-io/react-auth";

const { 
  login,           // Open login modal
  logout,          // Sign out user
  authenticated,   // Boolean: is user signed in?
  ready,           // Boolean: is Privy initialized?
  user,            // User object with profile and wallet data
  getAccessToken   // Get JWT access token
} = usePrivy();
```

## Accessing User Data

The `user` object contains:

```typescript
user.id                    // Unique user ID
user.createdAt             // Account creation timestamp
user.google                // Google account info (if linked)
user.discord               // Discord account info (if linked)
user.twitter               // Twitter account info (if linked)
user.email                 // Email address (if linked)
user.wallet                // Primary wallet
user.linkedAccounts        // Array of all linked accounts/wallets
```

Find the Solana wallet:

```typescript
const solanaWallet = user.linkedAccounts?.find(
  (account) => account.type === "wallet" && account.chainType === "solana"
);
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "App ID is required" | Make sure `.env.local` exists with `NEXT_PUBLIC_PRIVY_APP_ID` set |
| Login modal doesn't open | Check that your App ID is correct and matches your Privy dashboard |
| CORS errors | Add `http://localhost:3000` to Allowed Origins in Privy Dashboard |
| Social login fails | Verify the provider is enabled in Privy Dashboard → Login Methods |
| No wallet created | Check Embedded Wallets settings and ensure Solana is enabled |
| Session lost on refresh | Verify cookies aren't blocked in your browser |

## Deployment

When deploying to production:

1. Add your production domain to **Allowed Origins** in Privy Dashboard
2. Set `NEXT_PUBLIC_PRIVY_APP_ID` environment variable in your hosting platform
3. Update Solana network in Privy Dashboard (Devnet → Mainnet-beta)
4. Test authentication flow on production domain

## Learn More

- [Privy Documentation](https://docs.privy.io) - Complete SDK reference and guides
- [Privy Dashboard](https://dashboard.privy.io) - Manage your app settings
- [Privy React SDK](https://www.npmjs.com/package/@privy-io/react-auth) - Package details
- [Solana Web3.js](https://solana.com/docs) - Solana blockchain integration

## Best Practices

### Security

- Never commit `.env.local` to version control
- Use environment variables for all sensitive configuration
- Validate user sessions on protected routes
- Use `getAccessToken()` for authenticated API calls

### User Experience

- Always check `ready` before checking `authenticated` to avoid flicker
- Show loading states while Privy initializes
- Provide clear feedback during authentication state changes
- Handle wallet creation gracefully for new users

### Development

- Test with multiple social providers
- Verify embedded wallet creation for new users
- Test protected route redirects when unauthenticated
- Check session persistence across page refreshes

## License

MIT
