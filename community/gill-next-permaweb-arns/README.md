# Permaweb + ArNS Deployment Template

Deploy your Solana dapp to the Permaweb (Arweave) with one command using ArNS and the `permaweb-deploy` CLI. This template provides a production-ready workflow for permanent, decentralized hosting of Solana applications.

## Features

- **One-Command Deployment** - `pnpm run deploy` handles everything from build to ArNS update
- **Interactive Mode** - Guided deployment process perfect for beginners
- **Multiple Environments** - Easy staging, testnet, and production deployments
- **CI/CD Ready** - GitHub Actions workflow for automated deployments
- **Flexible Payment** - Use Turbo Credits or on-demand ARIO token conversion
- **ArNS Integration** - Human-readable domains on the Permaweb (e.g., `your-app.ar.io`)
- **Permanent Hosting** - Your dapp lives forever on Arweave's decentralized storage

## What is Permaweb?

The Permaweb is permanent, decentralized web hosting built on Arweave blockchain. Once deployed:

- Your dapp is **permanently accessible** - it can't be taken down
- **Zero ongoing hosting costs** - pay once, host forever
- **Censorship-resistant** - no single point of failure
- **Fast global access** - served via the AR.IO Network's gateway infrastructure

## What is ArNS?

ArNS (Arweave Name System) provides human-readable names for your Permaweb applications. Instead of accessing your dapp via a transaction ID, users can visit `your-app.ar.io`.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 20 or later
- **pnpm** 10.5.2 or later
- **ArNS Name** - Purchase at [arns.app](https://arns.app)
- **Arweave Wallet** - Create at [arweave.app](https://arweave.app)
- **Funding** - Either Turbo Credits or ARIO tokens for deployment costs

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Your ArNS Name

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your ArNS name:

```bash
NEXT_PUBLIC_ARNS_NAME=your-app
```

### 3. Update Package Scripts

In `package.json`, replace `YOUR_ARNS_NAME` with your actual ArNS name in all deployment scripts:

```json
{
  "scripts": {
    "deploy": "pnpm build && permaweb-deploy deploy --arns-name my-solana-app --deploy-folder out",
    "deploy:staging": "pnpm build && permaweb-deploy deploy --arns-name my-solana-app --undername staging --deploy-folder out"
  }
}
```

### 4. Set Up Your Wallet

Create a base64-encoded wallet key:

```bash
# Export your wallet as base64
export DEPLOY_KEY=$(base64 -i wallet.json)
```

> **Security Warning**: Never commit your wallet file or DEPLOY_KEY to git! These files are already in `.gitignore`.

### 5. First Deployment (Interactive Mode)

For your first deployment, use interactive mode which will guide you through the process:

```bash
pnpm run deploy:interactive
```

The CLI will prompt you for:

- ArNS name
- Wallet location or DEPLOY_KEY
- Payment method (Turbo Credits or on-demand)
- Other deployment options

### 6. Subsequent Deployments

Once configured, deploy with a single command:

```bash
pnpm run deploy
```

Your dapp will be:

1. Built as a static site
2. Uploaded to Arweave
3. Linked to your ArNS name
4. Accessible at `https://your-app.ar.io`

## Deployment Scripts

This template includes several deployment scripts:

### Production Deployment

```bash
pnpm run deploy
```

Deploys to your root ArNS domain (e.g., `your-app.ar.io`).

### Interactive Deployment

```bash
pnpm run deploy:interactive
```

Guided deployment with prompts for all configuration options. Perfect for first-time setup or when you want to customize deployment parameters.

### Staging Deployment

```bash
pnpm run deploy:staging
```

Deploys to a staging subdomain (e.g., `staging_your-app.ar.io`). Great for testing before production.

### Testnet Deployment

```bash
pnpm run deploy:testnet
```

Deploys to AR.IO testnet using test tokens. Use this for testing without spending real tokens.

### On-Demand Payment Deployment

```bash
pnpm run deploy:on-demand
```

Automatically converts ARIO tokens to pay for deployment. No pre-funded Turbo Credits needed.

## ArNS Setup

### Getting an ArNS Name

1. Visit [arns.app](https://arns.app)
2. Connect your Arweave wallet
3. Search for available names
4. Purchase your chosen name (requires ARIO tokens)
5. Your ArNS name is now ready to use

### Understanding Undernames (Subdomains)

ArNS supports undernames, which work similar to subdomains:

- `@` = Root domain (`your-app.ar.io`)
- `staging` = Staging under_name (`staging_your-app.ar.io`)
- `v2` = Version under_name (`v2_your-app.ar.io`)

You can deploy to different undernames without affecting your production deployment. ArNS uses underscores over periods because this means the primary name owns the namespsace rather than DNS.

## Wallet Setup

### Creating an Arweave Wallet

1. Visit [arweave.app](https://arweave.app)
2. Click "Create Wallet"
3. Download and securely store your keyfile
4. Save your wallet address

### Funding Your Wallet

For deployments, you need either:

#### Option 1: Turbo Credits (Recommended for frequent deploys)

1. Visit [ardrive.io](https://ardrive.io)
2. Purchase Turbo Credits with crypto or credit card
3. Credits are associated with your wallet address

#### Option 2: ARIO Tokens (For on-demand payment)

1. Acquire ARIO tokens (available on DEXs)
2. Keep them in your deployment wallet
3. The CLI will auto-convert to Turbo Credits as needed

### Creating DEPLOY_KEY

The `DEPLOY_KEY` environment variable should contain your base64-encoded wallet:

```bash
# For Arweave JWK wallet
export DEPLOY_KEY=$(base64 -i arweave-wallet.json)

# Or for Ethereum wallet
export DEPLOY_KEY=$(base64 -i ethereum-wallet.json)
```

Alternative wallet types supported by `permaweb-deploy`:

- Arweave JWK
- Ethereum
- Polygon (MATIC)
- KYVE

## GitHub Actions Setup

This template includes a GitHub Actions workflow for automatic deployments.

### Required Secrets

Add these secrets to your GitHub repository:

1. **DEPLOY_KEY** - Your base64-encoded wallet:

   ```bash
   base64 -i wallet.json
   ```

   Copy the output and add it as a secret named `DEPLOY_KEY`

2. **ARNS_NAME** - Your ArNS name (e.g., `my-solana-app`)

### Adding Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add `DEPLOY_KEY` and `ARNS_NAME`

### Triggering Deployments

The workflow automatically deploys when you push to the `main` branch. You can also manually trigger it:

1. Go to Actions tab in your repository
2. Select "Deploy to Permaweb" workflow
3. Click "Run workflow"

### Workflow Configuration

The workflow is defined in `.github/workflows/deploy.yml`. It:

- Checks out your code
- Installs dependencies
- Builds the static site
- Deploys to Permaweb using on-demand payment
- Reports deployment success with your ArNS URL

## Payment Options

### Turbo Credits (Pre-funded)

**Best for**: Frequent deployments, predictable costs

- Purchase credits in advance
- Credits tied to your wallet address
- Fast, no conversion needed
- Available at [ardrive.io](https://ardrive.io)

**How it works**:

```bash
# Uses your pre-funded Turbo Credits automatically
pnpm run deploy
```

### On-Demand ARIO Conversion

**Best for**: Occasional deployments, flexibility

- Pay per deployment
- Auto-converts ARIO to Turbo Credits
- Small conversion fee applies
- Must have ARIO in your wallet

**How it works**:

```bash
# Specify max tokens to spend (prevents overspending)
pnpm run deploy:on-demand
```

### Cost Estimation

Typical Next.js dapp deployment:

- Small app (<5 MB): ~0.5-1 ARIO
- Medium app (5-20 MB): ~1-3 ARIO
- Large app (20-50 MB): ~3-10 ARIO

Costs are one-time and grant permanent hosting.

## Development

### Local Development

```bash
# Start development server with Turbopack
pnpm dev
```

Visit `http://localhost:3000` to see your app.

### Building Locally

```bash
# Build static site
pnpm build
```

The output will be in the `out/` directory. You can preview it locally:

```bash
# Serve the static files
npx serve out
```

### Linting and Formatting

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check

# Run all checks (CI)
pnpm ci
```

## Advanced Usage

### Custom TTL Settings

Control how long gateways cache your deployment:

```bash
pnpm exec permaweb-deploy deploy \
  --arns-name your-app \
  --deploy-folder out \
  --ttl-seconds 3600
```

### Multiple Environments

Set up different environments using undernames:

```json
{
  "scripts": {
    "deploy:prod": "pnpm build && permaweb-deploy deploy --arns-name my-app --undername @ --deploy-folder out",
    "deploy:staging": "pnpm build && permaweb-deploy deploy --arns-name my-app --undername staging --deploy-folder out",
    "deploy:dev": "pnpm build && permaweb-deploy deploy --arns-name my-app --undername dev --deploy-folder out"
  }
}
```

### Custom ANT Process

If you have a custom ANT (Arweave Name Token) process:

```bash
pnpm exec permaweb-deploy deploy \
  --ant-process YOUR_ANT_PROCESS_ID \
  --deploy-folder out
```

### Deployment with Tags

Add custom tags to your deployment:

```bash
pnpm exec permaweb-deploy deploy \
  --arns-name your-app \
  --deploy-folder out \
  --tags "version:1.0.0" "environment:production"
```

## Troubleshooting

### Deployment Fails with "Insufficient Funds"

**Cause**: Not enough Turbo Credits or ARIO tokens.

**Solution**:

- Check your Turbo Credit balance at [ardrive.io](https://ardrive.io)
- Or ensure you have ARIO tokens and use on-demand payment:
  ```bash
  pnpm run deploy:on-demand
  ```

### "ArNS name not found"

**Cause**: The specified ArNS name doesn't exist or isn't owned by your wallet.

**Solution**:

- Verify your ArNS name at [arns.app](https://arns.app)
- Ensure the name is owned by the wallet you're deploying with
- Check for typos in your ArNS name

### Build Fails with "Image Optimization Error"

**Cause**: Next.js Image component requires optimization, which isn't supported in static export.

**Solution**:

- Already configured in `next.config.ts` with `unoptimized: true`
- If you still see this error, ensure you're using `next/image` properly

### ArNS Not Resolving After Deployment

**Cause**: DNS propagation delay.

**Solution**:

- Wait 5-10 minutes for propagation
- Access via transaction ID in the meantime: `https://ar.io/YOUR_TX_ID`
- Check status at [arns.app](https://arns.app)

### GitHub Actions Deployment Failing

**Cause**: Missing or incorrect secrets.

**Solution**:

1. Verify `DEPLOY_KEY` secret is correctly base64-encoded
2. Verify `ARNS_NAME` secret matches your actual ArNS name
3. Check the Actions log for specific error messages

### "DEPLOY_KEY environment variable not set"

**Cause**: The `DEPLOY_KEY` environment variable is missing.

**Solution**:

```bash
# Set the variable before deploying
export DEPLOY_KEY=$(base64 -i wallet.json)
pnpm run deploy
```

## Static Export Limitations

Because Permaweb hosts static files only, some Next.js features are not available:

- ❌ Server-side rendering (SSR)
- ❌ API routes
- ❌ Incremental static regeneration (ISR)
- ❌ Server actions
- ✅ Client-side React components
- ✅ Static page generation
- ✅ Client-side data fetching
- ✅ All Solana/Web3 functionality

All dynamic functionality must be handled client-side using React hooks and Web3 libraries.

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage with deployment info
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── deployment-info.tsx # ArNS deployment info display
│   │   ├── solana/             # Solana wallet components
│   │   └── ui/                 # UI components
│   └── lib/
│       ├── constants.ts        # ArNS & Arweave configuration
│       └── utils.ts            # Utility functions
├── .env.example                # Environment variable template
├── .gitignore                  # Excludes wallet files
├── next.config.ts              # Static export configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## Resources

### Documentation

- [Arweave Documentation](https://docs.arweave.org)
- [AR.IO Network](https://ar.io)
- [ArNS Documentation](https://arns.app)
- [permaweb-deploy CLI](https://github.com/permaweb/permaweb-deploy)
- [Turbo SDK](https://github.com/ardriveapp/turbo-sdk)

### Tools

- [ArNS Registry](https://arns.app) - Purchase and manage ArNS names
- [Arweave.app](https://arweave.app) - Create Arweave wallet
- [ArDrive](https://ardrive.io) - Purchase Turbo Credits
- [ViewBlock](https://viewblock.io/arweave) - Arweave block explorer

### Community

- [Arweave Discord](https://discord.gg/arweave)
- [AR.IO Discord](https://discord.gg/ario)
- [Solana Discord](https://discord.gg/solana)

## License

This template is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

Built with [gill](https://github.com/solana-developers/gill) and deployed to the Permaweb via [AR.IO Network](https://ar.io).
