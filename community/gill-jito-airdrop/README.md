# Solana Airdrop Claim Template

A complete Next.js template for creating and claiming Solana airdrops using Merkle tree-based distribution. This template includes both the Solana program deployment tools and a beautiful frontend interface for users to claim their allocated tokens.

## 🚀 Features

- **Complete Deployment Setup**: Automated script to deploy and configure your Solana airdrop program
- **Test Wallet Generation**: Creates funded test wallets for development and testing
- **Automatic Configuration**: Updates all config files, environment variables, and frontend code
- **Merkle Tree Verification**: Uses cryptographic proofs to verify eligibility  
- **Real-time UI Feedback**: Shows detailed status during the claiming process
- **Modern Stack**: Built with Next.js, TypeScript, Tailwind CSS, and latest Solana libraries
- **Developer Friendly**: Comprehensive error handling and detailed logging

## 📋 Prerequisites

- **Node.js 18+** and **pnpm** (or npm/yarn)
- **Solana CLI tools** installed and configured
- **Anchor Framework** (version 0.31.1+)
- **Rust** (for compiling Solana programs)
- Access to **Solana Devnet** (with SOL for deployment costs)

### Installing Prerequisites

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"

# Install Anchor
npm install -g @coral-xyz/anchor-cli

# Verify installations
solana --version
anchor --version
```

## 🛠️ Quick Setup Guide

### Step 1: Clone and Install

```bash
git clone https://github.com/cxalem/airdrop-claim-template.git
cd airdrop-claim-template
pnpm install
```

### Step 2: Deploy and Setup

```bash
pnpm airdrop:setup
```

This single command will:
- ✅ Create deployment wallet and fund it with SOL
- ✅ Generate test wallets for airdrop recipients  
- ✅ Build and deploy the Solana program
- ✅ Update all configuration files
- ✅ Generate Merkle tree for airdrop distribution

### Step 3: Initialize the Airdrop

```bash
pnpm airdrop:init
```

This command sets up the on-chain airdrop state and makes it ready for claiming.

### Step 4: Update Your Environment File

After running the setup commands, you need to update your `.env.local` file with:

1. **Program ID** (automatically added by the setup script)
2. **Your private key** (from the generated test wallets)

Create or update `.env.local`:

```bash
# Program ID (automatically set by setup script)
NEXT_PUBLIC_PROGRAM_ID=your_deployed_program_id_here

# Your private key (get this from anchor/test-wallets.json)
NEXT_PUBLIC_USER_PRIVATE_KEY=your_base58_private_key_here

# Network (optional, defaults to devnet)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

**Getting your private key:**
The setup script generates test wallets in `anchor/test-wallets.json`. Use the `base58` private key from any of the generated wallets:

```bash
# View generated wallets
cat anchor/test-wallets.json

# Copy the "base58" private key from any wallet and add it to .env.local
```

### Step 5: Start the Frontend

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and you should see the airdrop claiming interface.

### Step 6: Claim Your Airdrop

1. **Open the app** - Go to http://localhost:3000
2. **Click "Claim Airdrop"** - The button should be enabled for your wallet
3. **Watch the process** - You'll see status updates and success confirmation

## 🔧 Manual Commands (Advanced)

If you need more control over the process:

```bash
# Fix program ID mismatches
pnpm deploy-setup:fix

# Extract wallet information  
pnpm extract-wallet

# Type checking
pnpm type-check        # Frontend
pnpm type-check:node   # Scripts

# Anchor operations
pnpm anchor:build
pnpm anchor:deploy  
pnpm anchor:test
```

## 🐛 Common Issues

**Error: `Address not eligible for this airdrop`**
- Make sure the private key in `.env.local` corresponds to one of the recipients in `anchor/test-wallets.json`

**Error: `Insufficient SOL balance`** 
- Your wallet needs SOL for transaction fees: `solana airdrop 1 <your-public-key> --url devnet`

**Error: `Program ID not found`**
- Restart your dev server to pick up new environment variables
- Verify `NEXT_PUBLIC_PROGRAM_ID` is set in `.env.local`

**Error: `Transaction simulation failed`**
- Re-run the initialization: `pnpm airdrop:init`

## 📁 Project Structure

```ascii
├── anchor/                        # Solana program and deployment scripts
│   ├── programs/solana-distributor/ # The airdrop Solana program
│   ├── scripts/                   # Deployment and management scripts
│   │   ├── deploy-setup.ts        # 🌟 Main setup script
│   │   ├── initialize-airdrop.ts  # Initialize on-chain airdrop state
│   │   ├── claim-airdrop.ts       # Command-line claiming tool
│   │   └── generate-merkle-tree.ts # Merkle tree utilities
│   ├── recipients.json            # Generated recipient data
│   └── test-wallets.json          # Generated test wallet info
├── src/
│   ├── app/                       # Next.js app router
│   ├── components/
│   │   └── claim-button.tsx       # Main claiming interface
│   └── lib/
│       ├── airdrop-client.ts      # Core claiming logic
│       ├── recipients.ts          # 🔄 Auto-updated recipient data
│       ├── config.ts              # Configuration management
│       └── merkle-tree.ts         # Merkle tree & proof generation
└── .env.local                     # 🔄 Auto-updated environment config
```

## 🤝 Contributing

Found an issue or want to improve the template?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

## 📄 License

This project is open source and available under the MIT License.

---

**Need help?** Check the error messages carefully - they often contain the exact solution! If you're stuck, the most common issues are covered in the troubleshooting section above.

Built with ❤️ using Next.js, TypeScript, Gill, and Solana
