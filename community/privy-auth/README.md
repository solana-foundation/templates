# Privy Auth Template for Solana dApps

A complete Next.js + Tailwind CSS + TypeScript template demonstrating Privy-based authentication for Solana dApps with social logins, embedded wallet creation, and protected routes.

## Features

- 🔐 **Social Login** - Google, Twitter, Discord, email, and wallet authentication
- 💼 **Embedded Wallets** - Auto-created Solana wallets for users without existing wallets
- 🛡️ **Protected Routes** - Client-side route protection with automatic redirects
- 👤 **User Profile Component** - Display user information and connected wallets
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **TypeScript** - Full type safety with custom Privy type definitions
- 📦 **Ready to Deploy** - Works with `pnpm create solana-dapp --template privy-auth`

## Getting Started

### 1. Create Privy Account

1. Visit [https://dashboard.privy.io](https://dashboard.privy.io)
2. Sign up for a free Privy account
3. Create a new app in the Privy Dashboard
4. Copy your **App ID** from the dashboard

### 2. Configure Privy Dashboard

In your Privy Dashboard, configure the following settings:

#### Login Methods

Navigate to **Settings → Login Methods** and enable:

- ✅ **Email** - Email/password authentication
- ✅ **Wallet** - External wallet connection (Phantom, Backpack, etc.)
- ✅ **Google** - Google OAuth
- ✅ **Twitter** - Twitter OAuth
- ✅ **Discord** - Discord OAuth

#### Embedded Wallets

Navigate to **Settings → Embedded Wallets**:

- Enable **Solana** network support
- Set creation policy to **"Create for users without wallets"**
- Configure wallet recovery options as needed

#### Allowed Domains

Navigate to **Settings → Domains**:

- Add `http://localhost:3000` for development
- Add your production domain when deploying

#### Webhooks (Optional)

Set up webhooks for user events:
- User created
- User logged in
- Wallet linked

### 3. Install Dependencies

```bash
# Clone or scaffold the template
pnpm create solana-dapp my-app --template privy-auth

# Navigate to your project
cd my-app

# Install dependencies
pnpm install
```

### 4. Environment Setup

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Add your Privy App ID:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
privy-auth/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Protected dashboard page
│   ├── layout.tsx             # Root layout with Privy provider
│   ├── page.tsx               # Home page with auth UI
│   └── globals.css            # Global styles
├── components/
│   └── auth/
│       ├── login-button.tsx   # Login button component
│       ├── logout-button.tsx  # Logout button component
│       ├── user-profile.tsx   # User profile display
│       └── protected-route.tsx # Route protection HOC
├── lib/
│   └── providers.tsx          # Privy provider configuration
├── types/
│   └── privy.ts               # TypeScript definitions
└── .env.example               # Environment template
```

## Embedded Wallet Features

### Auto-Creation

Embedded wallets are automatically created for users who log in via social methods (Google, Twitter, Discord, Email) and don't have an existing wallet. This provides a seamless onboarding experience.

### Key Benefits

- **No User Friction** - Users don't need to install browser extensions
- **Secure** - Wallets are encrypted and managed by Privy
- **Cross-Device** - Users can access their wallet from any device
- **Recovery** - Built-in recovery mechanisms via email or social login

### Accessing Embedded Wallets

```typescript
import { useWallets } from "@privy-io/react-auth";

function MyComponent() {
  const { wallets } = useWallets();
  
  // Find embedded wallet
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  
  // Use wallet address
  console.log(embeddedWallet?.address);
}
```

### Solana Transactions

Embedded wallets can sign Solana transactions:

```typescript
import { useWallets } from "@privy-io/react-auth";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

async function sendTransaction() {
  const { wallets } = useWallets();
  const embeddedWallet = wallets[0];
  
  // Create connection
  const connection = new Connection("https://api.devnet.solana.com");
  
  // Build transaction
  const transaction = new Transaction().add(/* your instructions */);
  
  // Sign and send (Privy handles the signing)
  const signature = await embeddedWallet.sendTransaction(transaction, connection);
}
```

## Session Management

### Authentication State

Privy maintains authentication state across page reloads using secure session tokens:

```typescript
import { usePrivy } from "@privy-io/react-auth";

function MyComponent() {
  const { ready, authenticated, user } = usePrivy();
  
  // ready: Boolean indicating if Privy has initialized
  // authenticated: Boolean indicating if user is logged in
  // user: User object with profile and linked accounts
}
```

### Session Persistence

- Sessions persist across browser refreshes
- Secure HTTP-only cookies store session tokens
- Configurable session duration in Privy Dashboard
- Automatic token refresh handled by Privy SDK

### Logout

```typescript
import { usePrivy } from "@privy-io/react-auth";

function LogoutButton() {
  const { logout } = usePrivy();
  
  return <button onClick={logout}>Log Out</button>;
}
```

## Protected Routes

Use the `ProtectedRoute` component to guard pages that require authentication:

```typescript
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

The component:
- Checks authentication status on mount
- Shows loading state while Privy initializes
- Redirects unauthenticated users to home page
- Renders protected content only for authenticated users

## Configuration Options

Edit `lib/providers.tsx` to customize Privy configuration:

```typescript
<PrivyProvider
  appId={appId}
  config={{
    // Login methods to display
    loginMethods: ["email", "wallet", "google", "twitter", "discord"],
    
    // UI customization
    appearance: {
      theme: "light", // or "dark"
      accentColor: "#676FFF",
    },
    
    // Embedded wallet settings
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

## Best Practices

### Security

1. **Never expose App Secret** - Only use App ID in client-side code
2. **Validate on Server** - Always verify user sessions on your backend
3. **Use HTTPS** - Never use HTTP in production
4. **Configure Allowed Domains** - Restrict to your actual domains

### User Experience

1. **Handle Loading States** - Show spinners while Privy initializes
2. **Graceful Redirects** - Redirect smoothly when auth state changes
3. **Error Handling** - Catch and display authentication errors
4. **Mobile Optimized** - Test on mobile devices (embedded wallets shine here)

### Development

1. **Use TypeScript** - Leverage included type definitions
2. **Environment Variables** - Never commit `.env.local`
3. **Test Auth Flows** - Test all login methods in development
4. **Monitor Dashboard** - Check Privy Dashboard for user events

## Troubleshooting

### "NEXT_PUBLIC_PRIVY_APP_ID is not set"

- Ensure `.env.local` exists with your App ID
- Restart dev server after adding environment variables
- Check that variable name matches exactly

### Login Modal Doesn't Appear

- Verify App ID is correct in Privy Dashboard
- Check browser console for errors
- Ensure allowed domains are configured correctly

### Social Login Fails

- Configure OAuth apps in respective platforms (Google, Twitter, etc.)
- Add OAuth redirect URLs in Privy Dashboard
- Check Privy Dashboard → Settings → Login Methods

### Wallet Not Created

- Verify embedded wallets are enabled in Privy Dashboard
- Check that Solana network is enabled
- Ensure creation policy allows wallet creation

## API Reference

### usePrivy Hook

```typescript
const {
  ready,          // boolean - Privy SDK loaded
  authenticated,  // boolean - User is logged in
  user,           // User | null - User object
  login,          // () => void - Open login modal
  logout,         // () => void - Log out user
} = usePrivy();
```

### useWallets Hook

```typescript
const {
  wallets,        // ConnectedWallet[] - All connected wallets
  ready,          // boolean - Wallets loaded
} = useWallets();
```

## Resources

- **Privy Documentation** - [https://docs.privy.io](https://docs.privy.io)
- **Getting Started Guide** - [https://docs.privy.io/basics/get-started/about](https://docs.privy.io/basics/get-started/about)
- **Solana Integration** - [https://docs.privy.io/guide/solana](https://docs.privy.io/guide/solana)
- **React Auth SDK** - [https://docs.privy.io/reference/react-auth](https://docs.privy.io/reference/react-auth)
- **Privy Dashboard** - [https://dashboard.privy.io](https://dashboard.privy.io)
- **Privy Discord** - [https://discord.gg/privy](https://discord.gg/privy)

## License

MIT

## Support

For issues with this template, open an issue on the [Solana Foundation Templates](https://github.com/solana-foundation/solana-dev-templates) repository.

For Privy-specific issues, visit [Privy Support](https://docs.privy.io) or their Discord community.

