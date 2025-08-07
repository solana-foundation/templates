# Solana Merkle Distributor - Modern Implementation

A complete Solana program for efficient token airdrops using Merkle trees, built with **Gill + Codama** for modern, type-safe development. Distribute SOL to thousands of recipients while storing only a 32-byte Merkle root on-chain.

## 🎯 What This Project Does

This is a **merkle tree-based airdrop system** that allows you to:

1. **Create** a list of recipients and amounts
2. **Generate** a merkle tree representing all recipients  
3. **Deploy** a Solana program that stores only the merkle root
4. **Initialize** the airdrop with funded SOL
5. **Allow recipients** to claim their SOL using cryptographic proofs

**Why Merkle Trees?** Instead of storing thousands of recipient addresses on-chain (expensive), we store just one 32-byte hash that represents the entire list. Recipients prove they're eligible using merkle proofs.

## 🏗️ Architecture Overview

This project uses **modern Solana tooling** for enhanced developer experience:

```ascii
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Recipients    │    │   Merkle Tree    │    │  Solana Program │
│     List        │───▶│   Generation     │───▶│   (Root Only)   │
│ • Alice: 0.1 SOL│    │                  │    │                 │
│ • Bob: 0.2 SOL  │    │ Root: 0x1a2b3c...│    │ Root: 0x1a2b3c..│
│ • Carol: 0.1 SOL│    │                  │    │ SOL: 0.4 Total  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌──────────────────┐             │
│   Alice Claims  │    │  Generate Proof  │             │
│                 │◀───│  for Alice       │◀────────────┘
│ ✓ Proof Valid   │    │                  │
│ ✓ Receives SOL  │    │ Proof: [0x4d,    │
│                 │    │        0x9f, ...]│
└─────────────────┘    └──────────────────┘
```

### 🆕 Modern Technology Stack

- **🦀 Anchor Framework**: Rust program development
- **⚡ Gill (@solana/kit)**: Modern Solana JavaScript SDK (web3.js v2 replacement)
- **🔧 Codama**: Automatic client generation from Anchor IDL
- **📦 TypeScript**: Full type safety throughout
- **🧪 Vitest**: Modern testing framework

## 📋 Prerequisites

Before starting, install:

- **Rust 1.88.0+** - `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Solana CLI 2.2.20+** - `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`
- **Anchor CLI 0.31.1** - `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.31.1`
- **Node.js 22+** with pnpm

Verify installations:
```bash
rustc --version    # Should be 1.88.0+
solana --version   # Should be 2.2.20+
anchor --version   # Should be 0.31.1
node --version     # Should be 22+
```

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd airdrop-claim-template
pnpm install
```

### 2. Setup Development Environment

```bash
# Set network to devnet
solana config set --url https://api.devnet.solana.com
solana config set --commitment confirmed

# Create deployment wallet
solana-keygen new --outfile anchor/deploy-wallet.json --no-bip39-passphrase

# Fund with devnet SOL (need ~2 SOL for deployment)
solana airdrop 2 $(solana address -k anchor/deploy-wallet.json)
```

### 3. Build and Generate Client

```bash
# Build the Anchor program and generate Codama client
npm run codama:build-and-generate
```

**What happens:**
- Compiles the Rust program with Anchor
- Generates TypeScript client using Codama
- Creates `anchor/generated/clients/ts/` directory with type-safe client

### 4. Deploy the Program

```bash
# Interactive deployment setup
npm run airdrop:setup
```

**What the setup does:**
- 🔧 Builds and deploys the Solana program
- 📝 Updates program ID references
- 💰 Funds deployment wallet if needed
- 🌳 Generates merkle tree from recipients
- ✅ Validates all configurations

### 5. Initialize the Airdrop

```bash
# Initialize the on-chain airdrop state
npm run airdrop:init
```

**What happens:**
- Creates airdrop state PDA with merkle root
- Transfers SOL to fund the airdrop vault
- Makes airdrop live and ready for claims

### 6. Test Claims

```bash
# List available test wallets
npm run airdrop:extract

# Run comprehensive tests
npm test
```

## 🏛️ Project Structure

```
anchor/
├── programs/solana-distributor/     # Rust program source
│   └── src/lib.rs                  # Program logic
├── lib/                            # Gill-based utilities (functional)
│   ├── types.ts                    # Gill/Solana Kit types
│   ├── wallet-manager.ts          # Wallet operations
│   ├── program-manager.ts          # Program deployment
│   ├── merkle-tree-manager.ts      # Merkle tree generation
│   ├── file-manager.ts             # File I/O operations
│   ├── build-coordinator.ts        # Build orchestration
│   └── airdrop-initializer.ts      # Airdrop initialization
├── scripts/                        # CLI scripts
│   ├── index.ts                    # Main CLI interface
│   ├── deploy-setup.ts             # Interactive setup
│   ├── initialize-airdrop.ts       # Airdrop initialization
│   └── extract-wallet.ts           # Wallet management
├── tests/                          # Test suite
│   └── solana-distributor-comprehensive.test.ts  # Full E2E tests
├── generated/                      # Codama-generated client
│   └── clients/ts/                 # TypeScript client
│       ├── instructions/           # Instruction builders
│       ├── accounts/              # Account fetchers
│       └── programs/              # Program constants
├── migrations/                     # Deployment scripts
│   └── deploy.ts                   # Gill-based deployment
├── codama.config.ts               # Codama configuration
├── recipients.json                # Airdrop recipients data
└── test-wallets.json              # Test wallet data
```

## 🔧 Modern Implementation Details

### Gill (@solana/kit) Integration

Our implementation uses **Gill** instead of legacy `@solana/web3.js` for:

- **🚀 Better Performance**: Smaller bundle size and faster execution
- **🎯 Explicit APIs**: No implicit behaviors or hidden state
- **📘 Enhanced TypeScript**: Native BigInt and better type inference
- **🧩 Composable Design**: Functional programming approach

**Example - Creating a transaction:**
```typescript
import { createSolanaClient, createTransaction, sendAndConfirmTransaction } from 'gill'

const client = createSolanaClient({ urlOrMoniker: 'devnet' })
const { rpc, sendAndConfirmTransaction } = client

const transaction = createTransaction({
  version: 'legacy',
  feePayer: signer,
  instructions: [instruction],
  latestBlockhash: await rpc.getLatestBlockhash().send()
})

const signature = await sendAndConfirmTransaction(transaction)
```

### Codama Client Generation

**Codama** automatically generates a type-safe TypeScript client from our Anchor IDL:

```typescript
// Generated instruction builders
import { getInitializeAirdropInstruction } from '../generated/clients/ts/instructions/initializeAirdrop'
import { getClaimAirdropInstruction } from '../generated/clients/ts/instructions/claimAirdrop'

// Generated account fetchers  
import { fetchAirdropState } from '../generated/clients/ts/accounts/airdropState'
import { fetchClaimStatus } from '../generated/clients/ts/accounts/claimStatus'

// Program constants
import { SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS } from '../generated/clients/ts/programs'
```

**Configuration (`codama.config.ts`):**
```typescript
import { rootNodeFromAnchor } from 'codama'
import { createFromRoot } from '@codama-idl/renderers-js-umi'

// Read Anchor IDL
const node = rootNodeFromAnchor(require('./target/idl/solana_distributor.json'))

// Generate TypeScript client
const jsClient = createFromRoot(node, {
  outDir: path.join(__dirname, 'generated', 'clients', 'ts'),
  renderParentInstructions: true
})

await jsClient.render()
```

### Functional Programming Architecture

All utilities are implemented as **pure functions** instead of classes:

```typescript
// ✅ Modern functional approach
export async function initializeGillAirdrop(
  recipientsFile: string = 'recipients.json',
  config: GillInitializerConfig = {}
): Promise<GillInitializationResult> {
  // Pure function logic
}

// ❌ Old class-based approach (removed)
// class AirdropInitializer { ... }
```

## 🧪 Testing Suite

Our comprehensive test suite uses **Vitest** and covers:

```typescript
// Full end-to-end testing with Gill + Codama
describe('Solana Distributor (Comprehensive Gill + Codama)', () => {
  test('Initialize airdrop with Merkle tree', async () => {
    const initializeInstruction = getInitializeAirdropInstruction({
      airdropState: airdropStatePda,
      authority: authority,
      merkleRoot: new Uint8Array(merkleTreeResult.merkleTree.root),
      amount: BigInt(totalAmount)
    })
    // ... transaction creation and verification
  })

  test('Claim SOL with proof verification', async () => {
    const claimInstruction = getClaimAirdropInstruction({
      airdropState: airdropStatePda,
      userClaim: address(claimStatusPda),
      signer: recipient,
      proof: proofResult.proof.map(p => new Uint8Array(Buffer.from(p.slice(2), 'hex'))),
      amount: BigInt(recipientAmount),
      leafIndex: 0
    })
    // ... claim verification
  })

  test('Prevent double-claims', async () => {
    // Verify double-claim protection works
  })
})
```

**Run tests:**
```bash
npm test                    # Run full test suite
npm run test:watch         # Watch mode for development
```

## 📦 Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `npm run codama:generate` | Generate TypeScript client from IDL | After program changes |
| `npm run codama:build-and-generate` | Build program + generate client | Full rebuild |
| `npm run airdrop:setup` | Interactive deployment setup | Initial setup |
| `npm run airdrop:init` | Initialize airdrop on-chain | After deployment |
| `npm run airdrop:extract` | List/extract wallet information | Wallet management |
| `npm test` | Run comprehensive test suite | Testing |
| `npm run test:watch` | Run tests in watch mode | Development |

## 🔍 How Merkle Proofs Work

```
Merkle Tree Example (4 recipients):

                    ROOT
                 /        \
            H(AB)              H(CD)  
           /    \             /    \
       H(A)    H(B)       H(C)    H(D)
        |       |          |       |
    Alice    Bob      Carol    Dave

To prove Alice is in the tree:
1. Provide H(B), H(CD) as proof
2. Program computes: H(H(A) + H(B)) + H(CD) = ROOT  
3. If computed ROOT matches stored ROOT → Alice is valid ✅
```

**Benefits:**
- **Efficient**: Proof size is O(log n), not O(n)
- **Secure**: Cryptographically impossible to fake
- **Scalable**: Works for millions of recipients

## 🛠️ Development Workflow

### 1. Modify Recipients

Edit `recipients.json` with your airdrop recipients:

```json
{
  "airdropId": "my-awesome-airdrop-2024",
  "description": "Community airdrop for early supporters",
  "totalAmount": "300000000",
  "network": "devnet",
  "recipients": [
    {
      "publicKey": "HcCcKydEcuGMbBso7jciQrFpBw1XQrKHKFckGSAxXXQG",
      "amount": "100000000",
      "description": "Early supporter #1"
    }
  ]
}
```

### 2. Regenerate After Changes

```bash
# After modifying program code
npm run codama:build-and-generate

# After modifying recipients
npm run airdrop:setup
```

### 3. Test Your Changes

```bash
# Run full test suite
npm test

# Test specific functionality
npm run airdrop:init
npm run airdrop:extract
```

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module" errors**
```bash
# Regenerate Codama client
npm run codama:generate
```

**"Program ID mismatch"**
```bash
# Redeploy with consistent program ID
npm run airdrop:setup
```

**"Account not found"**
```bash
# Ensure program is deployed and initialized
npm run airdrop:setup
npm run airdrop:init
```

**"Invalid Merkle proof"**
```bash
# Regenerate merkle tree if recipients changed
npm run airdrop:setup
```

**PostCSS errors in tests**
- This is a known Vitest configuration issue
- Tests compile and work correctly
- The error doesn't affect functionality

### Development Tips

1. **Always regenerate client** after program changes
2. **Use TypeScript** - the generated client provides full type safety
3. **Test on devnet** before mainnet deployment
4. **Check balances** before and after operations
5. **Use the comprehensive test suite** to verify functionality

## 🚨 Production Deployment

For mainnet deployment:

```bash
# 1. Switch to mainnet
solana config set --url https://api.mainnet-beta.solana.com

# 2. Update recipients.json
{
  "network": "mainnet",
  // ... your real recipients
}

# 3. Deploy (same commands work)
npm run airdrop:setup
npm run airdrop:init
```

**⚠️ Security Checklist:**
- [ ] Verify all recipient addresses are correct
- [ ] Double-check all amounts (in lamports)
- [ ] Test completely on devnet first
- [ ] Secure your program upgrade authority
- [ ] Consider making program immutable after deployment

## 🎓 Key Technologies

- **[Gill (@solana/kit)](https://github.com/solana-labs/solana-web3.js/tree/master/packages/kit)**: Modern Solana JavaScript SDK
- **[Codama](https://github.com/codama-idl/codama)**: Automatic client generation
- **[Anchor Framework](https://www.anchor-lang.com/)**: Solana program development
- **[Vitest](https://vitest.dev/)**: Fast unit testing framework

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Test on devnet thoroughly: `npm test`
4. Submit pull request

---

**Built with modern Solana tooling for enhanced developer experience** 🚀