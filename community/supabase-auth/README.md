# Supabase Auth + Solana Template

A [Next.js](https://nextjs.org) starter template that demonstrates Solana wallet authentication using Supabase's Web3 authentication. This template helps you build a full-stack Solana application with user sessions, protected routes, and wallet-based login, all without managing your own authentication server.

The template uses Supabase's managed PostgreSQL database, so there's no local database setup required. Everything runs through Supabase's hosted services.

## Features

- **Supabase Authentication** with Solana wallet integration via Web3 auth
- **[Zod](https://zod.dev)** for environment variable validation (T3 Stack style)
- **[TanStack Query](https://tanstack.com/query)** for API state management and caching
- **[Tailwind CSS](https://tailwindcss.com)** and **[Shadcn UI](https://ui.shadcn.com)** for styling
- **[Wallet UI](https://registry.wallet-ui.dev)** components for Solana wallet interactions
- **Protected Routes** with authentication middleware
- **[TypeScript](https://www.typescriptlang.org)** throughout for type safety

## Prerequisites

Before you start, make sure you have:

1. **Node.js 18+** installed - required to run [Next.js](https://nextjs.org)
2. **A Supabase account** - create one at [supabase.com](https://supabase.com) (free tier works)
3. **A Solana wallet** - Phantom, Solflare, or Backpack installed in your browser
4. **Git** - to clone or fork this repository

You'll also need your Supabase project URL and anon key, which you can find in your project's API settings.

## Setup Steps

### 1. Clone or fork this repository

```bash
git clone https://github.com/solana-foundation/templates.git
cd templates/community/supabase-auth
```

This gets you the template code locally.

### 2. Install dependencies

```bash
npm install
```

This installs [Next.js](https://nextjs.org), Supabase client, wallet libraries, and all other dependencies listed in `package.json`.

### 3. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details (name, database password, region)
4. Wait for the project to finish provisioning (about 2 minutes)

[More details about projects](https://supabase.com/docs/guides/getting-started)

Once your project is ready, you'll see the project dashboard.

### 4. Enable Web3 Authentication in Supabase

This step is critical. Without it, authentication will fail with a 422 error.

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Scroll down to find **Web3** (it may be under "Additional Providers")
3. Toggle **Web3** to enabled
4. Save the changes

If you don't see Web3 as an option, make sure you're using a Supabase project that supports Web3 authentication (this feature may be in beta).

### 5. Get your Supabase credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (the `anon` key, not the `service_role` key)

Keep these handy. You'll need them in the next step.

### 6. Configure environment variables

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Open `.env.local` and replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

**Why `.env.local`?** [Next.js](https://nextjs.org) automatically loads this file and ignores it in git, so your secrets stay local.

The template uses [Zod](https://zod.dev) to validate these environment variables at build time. If you see an "Invalid environment variables" error, don't panic. It just means your `.env.local` file is missing a key or has an invalid URL format.

### 7. Start the development server

```bash
npm run dev
```

This starts [Next.js](https://nextjs.org) with Turbopack (faster than the default webpack). You should see output like:

```text
▲ Next.js 15.5.6
- Local:        http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see a "gm" screen. That's how you know it's working.

## Environment Variables

The template requires two environment variables, both validated by [Zod](https://zod.dev):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

These are prefixed with `NEXT_PUBLIC_` because they're used in client-side code. If you see an "Invalid environment variables" error, check that your `.env.local` file exists and has both keys set correctly.

## Wallet Connection

The template uses the Wallet UI library to manage wallet connections. Here's how it works:

1. **Select a wallet**: Click the wallet dropdown in the header (shows "Connect Wallet" if nothing is connected)
2. **Choose your wallet**: Select Phantom, Solflare, or another supported wallet
3. **Approve the connection**: Your wallet extension will prompt you to connect. Click "Approve" or "Connect"
4. **Verify connection**: Once connected, you'll see your wallet address in the header (truncated, like `J4AJ...MAAP`)

The wallet connection is separate from Supabase authentication. Connecting your wallet lets the app read your balance and account info, but it doesn't sign you into Supabase yet.

### Requesting Airdrop (Devnet)

The template connects to Solana Devnet by default, which is a test network with free tokens for development.

If you see a yellow banner saying "You are connected to Devnet but your account is not found on this cluster," you can request an airdrop:

1. Click the **Request Airdrop** button in the banner
2. Wait a few seconds for the transaction to confirm

**Important**: Devnet has rate limits. If you see a 429 error (Too Many Requests), you've hit the rate limit. Wait a few minutes and try again, or use a different Devnet RPC endpoint.

The airdrop gives you test SOL that you can use to test transactions without spending real money. This step is optional and only needed if you want to test transactions.

## Signing In with Solana

Once your wallet is connected, you can authenticate with Supabase:

1. Scroll to the "Sign in with Solana" card
2. You should see "Wallet Connected: [your address]" in green text
3. Click the **Sign in with Solana** button
4. Your wallet will prompt you to sign a message. This is the authentication challenge
5. Approve the signature in your wallet

If authentication succeeds, you'll see "Wallet authenticated successfully!" and the card will update to show a welcome message with your wallet address and buttons to view account details or sign out.

**What happens behind the scenes**: The app calls `supabase.auth.signInWithWeb3()`, which uses your wallet to sign a message. Supabase verifies the signature and creates a session that persists across page refreshes.

### Common Authentication Errors

#### "Authentication failed: Web3 provider is disabled"

This means Web3 authentication isn't enabled in your Supabase project. Go back to **Authentication → Providers** in your Supabase dashboard and make sure Web3 is toggled on.

#### "Authentication failed: [422 error]"

A 422 error usually means:

- Web3 authentication isn't enabled (see above)
- Your Supabase project doesn't support Web3 auth (check if you're on a supported plan)
- The `window.solana` provider isn't properly connected

#### "Solana wallet not detected"

Make sure you have a Solana wallet extension installed (Phantom, Solflare, etc.) and that it's enabled in your browser.

## Protected Routes

The `/account` route is protected and requires authentication. Unauthenticated users are redirected to the home page. You can protect additional routes by wrapping them with the `ProtectedRoute` component (see `src/components/auth/protected-route.tsx`).

**Signing out**: Click the "Sign Out" button in the welcome card or use the disconnect button in the header. This clears your Supabase session and disconnects your wallet.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid environment variables" error | Check that `.env.local` exists and contains both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 422 error when signing in | Enable Web3 authentication in Supabase dashboard (Authentication → Providers → Web3) |
| "Web3 provider is disabled" | Same as above. Web3 auth must be enabled in Supabase |
| Wallet not connecting | Make sure a Solana wallet extension is installed and enabled in your browser |
| 429 errors on airdrop | You've hit Devnet rate limits. Wait a few minutes or use a different RPC endpoint |
| Port 3000 already in use | Change the port: `npm run dev -- -p 3001` or kill the process using port 3000 |
| Build fails with type errors | Run `npm install` again to ensure all dependencies are installed correctly |

If you're still stuck, check the browser console (F12) and the terminal where `npm run dev` is running. Error messages there usually point to the specific issue.

## Folder Structure

```text
supabase-auth/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── account/                  # Protected account routes
│   │   ├── layout.tsx                # Root layout with providers
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   ├── auth/                     # Authentication components
│   │   ├── solana/                   # Solana wallet integration
│   │   └── ui/                       # Shadcn UI primitives
│   ├── features/                     # Feature-based organization
│   │   ├── account/                  # Account feature
│   │   ├── cluster/                 # Network/cluster feature
│   │   └── dashboard/               # Dashboard feature
│   ├── hooks/                        # Custom React hooks
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   └── utils.ts
│   └── env.ts                        # Environment validation (Zod)
├── public/                           # Static assets
├── .env.example                      # Environment template
├── package.json
└── next.config.ts
```

**Key files:**

- `src/lib/supabase.ts` - Supabase client initialization
- `src/env.ts` - Environment variable validation
- `src/components/auth/auth-provider.tsx` - Auth context provider
- `src/components/auth/wallet-login.tsx` - Wallet authentication UI
- `src/app/layout.tsx` - Root layout with all providers

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Acknowledgments

This template uses:

- [Supabase](https://supabase.com) for authentication and database
- [Next.js](https://nextjs.org) as the React framework
- [Gill](https://gill.site/) for Solana SDK functionality
- [Wallet UI](https://registry.wallet-ui.dev) for Solana wallet components
- [TanStack Query](https://tanstack.com/query) for data fetching
- [Shadcn UI](https://ui.shadcn.com) for component primitives

## License

Based on the Gill Supabase Template by Guillaume Bibeau and contributors.

Curated and refined by [Opeyemi Bangkok](https://www.github.com/resourcefulmind) for improved developer onboarding
