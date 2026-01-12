# Phantom Embedded JS

A minimal starter template for integrating **Phantom's embedded user wallets** on Solana using vanilla JavaScript/TypeScript. This template demonstrates how to authenticate users with Phantom Connect and display their Solana account information.

## Features

- **Phantom Connect Authentication** - OAuth-based user authentication with Google and Apple
- **Embedded User Wallet** - No browser extension required
- **Real-time Balance Display** - View SOL balance with auto-refresh every 30 seconds
- **Direct Blockchain Queries** - Uses @solana/web3.js to query Solana RPC directly
- **Copy Address** - One-click address copying
- **Theme Switching** - Toggle between light and dark modes (light mode default)
- **Fully Responsive** - Works seamlessly on mobile and desktop
- **Fast Development** - Built with Vite for instant hot reload
- **Persistent Preferences** - Theme preference saved in localStorage

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm, npm, or yarn
- A Phantom App ID from [Phantom Developer Portal](https://phantom.com/portal)

### Installation

```bash
# Create from template
npx create-solana-dapp my-app --template phantom-embedded-js

# Navigate to project
cd my-app

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Phantom App ID

# Run development server
pnpm dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

### Environment Setup

Edit the `.env` file and add your Phantom App ID:

```env
# Your App ID from Phantom Portal (REQUIRED)
VITE_PHANTOM_APP_ID=your-app-id-here

# Phantom Connect Auth URL (optional - defaults to https://connect.phantom.app)
VITE_PHANTOM_AUTH_URL=https://connect.phantom.app

# Authentication Redirect URL (must be whitelisted in Phantom Portal)
VITE_REDIRECT_URL=http://localhost:5173/

# Solana RPC Endpoint (optional - defaults to mainnet)
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Configuration

### Get Your Phantom App ID

1. Visit [phantom.com/portal](https://phantom.com/portal) to create an app and get your App ID
2. Whitelist your redirect URLs in the Phantom Portal:
   - **Development**: `http://localhost:5173/`
   - **Production**: `https://yourdomain.com/` (your production domain URL)
3. Add your App ID to `.env` file

**Best Practices**:

- Always whitelist both your development and production domain URLs
- Keep your App ID secure and never commit `.env` to version control

## Project Structure

```
phantom-embedded-js/
├── src/
│   ├── main.ts         # App entry point & orchestration
│   ├── phantom.ts      # Phantom SDK wrapper & authentication
│   ├── solana.ts       # Solana utilities (balance, formatting)
│   ├── ui.ts           # UI management
│   └── styles.css      # Styling with theme support
├── index.html          # HTML structure
├── package.json        # Dependencies & metadata
└── .env.example        # Environment template
```

## How It Works

### Authentication Flow

1. User selects Google or Apple sign-in
2. Phantom Connect handles OAuth authentication
3. User is redirected back to your app with authentication data
4. App shows loading state while processing authentication
5. App displays wallet address and SOL balance
6. Balance auto-refreshes every 30 seconds

### Balance Queries

The Phantom SDK doesn't provide balance queries. This template uses `@solana/web3.js` to query the Solana blockchain directly:

```typescript
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const connection = new Connection(rpcUrl, 'confirmed')
const publicKey = new PublicKey(address)
const lamports = await connection.getBalance(publicKey)
const sol = lamports / LAMPORTS_PER_SOL
```

## Customization

### Styling

Customize colors and theme in `src/styles.css`:

```css
:root {
  --phantom-purple: #ab9ff2;
  --bg-page: #fafafa;
  --text-primary: #1a1a1a;
}

[data-theme='dark'] {
  --bg-page: #1a1a1a;
  --text-primary: #ffffff;
}
```

### Environment Variables

| Variable                | Required | Default                               | Description                                                |
| ----------------------- | -------- | ------------------------------------- | ---------------------------------------------------------- |
| `VITE_PHANTOM_APP_ID`   | Yes      | -                                     | App ID from Phantom Portal                                 |
| `VITE_REDIRECT_URL`     | Yes      | -                                     | OAuth redirect URL (must be whitelisted in Phantom Portal) |
| `VITE_PHANTOM_AUTH_URL` | No       | `https://connect.phantom.app`         | Phantom Connect URL                                        |
| `VITE_SOLANA_RPC_URL`   | No       | `https://api.mainnet-beta.solana.com` | Solana RPC endpoint (defaults to mainnet)                  |

## Troubleshooting

### Missing App ID Error

Create a `.env` file with your Phantom App ID from [phantom.com/portal](https://phantom.com/portal), then restart the dev server.

### Authentication Fails

Ensure your redirect URL is whitelisted in Phantom Portal. The URL must match exactly:

- For development: `http://localhost:5173/`
- For production: Your domain URL (e.g., `https://yourdomain.com/`)
- Whitelist both development and production URLs
- Include trailing slash

### Balance Fetch Error or CORS

**Wrong RPC URL**: Make sure you're using a Solana RPC endpoint, not Phantom API.

**Correct (Mainnet):**

```env
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**Wrong:**

```env
VITE_SOLANA_RPC_URL=https://api.phantom.app  # Don't use this!
```

**Recommended RPC Providers** (better reliability than public endpoints):

- [Helius](https://helius.dev)
- [Alchemy](https://www.alchemy.com/solana)
- [QuickNode](https://www.quicknode.com/chains/sol)

## Building for Production

```bash
# Build
pnpm build

# Preview
pnpm preview
```

**Deployment Checklist:**

- Update `VITE_REDIRECT_URL` to your production domain URL
- Whitelist production URL in Phantom Portal (e.g., `https://yourdomain.com/`)
- Use a reliable Solana RPC endpoint (Helius, Alchemy, or QuickNode recommended)
- Set environment variables in your hosting platform
- Test authentication flow in production environment

**Compatible Platforms**: Vercel, Netlify, Cloudflare Pages, GitHub Pages

## Resources

- [Phantom Browser SDK Docs](https://docs.phantom.com/sdks/browser-sdk) - Official SDK documentation
- [Phantom Developer Portal](https://phantom.com/portal) - Get your App ID
- [Solana Web3.js Docs](https://github.com/solana-foundation/solana-web3.js) - Solana JavaScript SDK
- [Solana Cookbook](https://solanacookbook.com/) - Development recipes

## Support

**Need help?** Visit [docs.phantom.com](https://docs.phantom.com) for documentation and support.

**Found a bug?** Contact Phantom support at [docs.phantom.com](https://docs.phantom.com).
