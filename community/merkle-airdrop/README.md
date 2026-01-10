## Solana Merkle Airdrop Distributor (Codama + Anchor)

A modern, script-driven Solana airdrop template that distributes SOL to many recipients efficiently using a Merkle tree. Only the 32‑byte Merkle root is stored on-chain. The project uses Anchor for the on-chain program, Codama for a generated TypeScript client, and the @solana/kit for transactions. This README focuses on how the program works and how to use it through the provided scripts.

### Table of Contents

- [Solana Merkle Airdrop Distributor (Codama + Anchor)](#solana-merkle-airdrop-distributor-codama--anchor)
  - [Table of Contents](#table-of-contents)
- [Prerequisites](#prerequisites)
  - [Quick Installation (Recommended)](#quick-installation-recommended)
  - [Manual Installation](#manual-installation)
    - [1. Install Rust](#1-install-rust)
    - [2. Install Solana CLI](#2-install-solana-cli)
    - [3. Install Anchor CLI](#3-install-anchor-cli)
    - [4. Install Node.js and Yarn](#4-install-nodejs-and-yarn)
  - [Verify Installation](#verify-installation)
  - [Solana CLI Basics](#solana-cli-basics)
    - [Configure Solana CLI](#configure-solana-cli)
    - [Create a Wallet](#create-a-wallet)
    - [Fund Your Wallet](#fund-your-wallet)
  - [Quick Setup](#quick-setup)
    - [Initialize the on-chain airdrop state and makes it ready for claiming:](#initialize-the-on-chain-airdrop-state-and-makes-it-ready-for-claiming)
  - [Architecture Overview](#architecture-overview)
  - [Merkle Airdrop Model](#merkle-airdrop-model)
    - [Why Merkle (root-only on-chain)](#why-merkle-root-only-on-chain)
    - [Proof format and verification flow](#proof-format-and-verification-flow)
  - [On-Chain Design](#on-chain-design)
    - [Accounts](#accounts)
    - [Instructions](#instructions)
    - [State transitions and funds flow](#state-transitions-and-funds-flow)
  - [Program Interactions](#program-interactions)
  - [Security and Safety](#security-and-safety)
  - [Testing and Validation](#testing-and-validation)
  - [Version and Compatibility Notes](#version-and-compatibility-notes)
  - [Using the Scripts](#using-the-scripts)
  - [FAQ](#faq)
  - [Glossary](#glossary)
  - [Gaps and Suggestions](#gaps-and-suggestions)
- [🎓 Key Technologies](#-key-technologies)

---

## Prerequisites

Before you can build and deploy Solana programs with this template, you need to install Rust, Solana CLI, and Anchor CLI on your system.

### Quick Installation (Recommended)

On Mac and Linux, run this single command to install all dependencies:

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

**Windows Users:** You must first install WSL (Windows Subsystem for Linux). Then run the command above in the Ubuntu (Linux) terminal.

After installation, you should see output similar to:

```
Installed Versions:
Rust: rustc 1.85.0 (4d91de4e4 2025-02-17)
Solana CLI: solana-cli 2.1.15 (src:53545685; feat:3271415109, client:Agave)
Anchor CLI: anchor-cli 0.31.1
Node.js: v23.9.0
Yarn: 1.22.1

Installation complete. Please restart your terminal to apply all changes.
```

If the quick installation works, skip to [Verify Installation](#verify-installation). If it doesn't work, follow the manual installation steps below.

### Manual Installation

#### 1. Install Rust

Solana programs are written in Rust. Install it using rustup:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
```

Reload your PATH environment variable:

```bash
. "$HOME/.cargo/env"
```

#### 2. Install Solana CLI

Install the Solana CLI tool suite:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Add Solana to your PATH (if prompted):

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

#### 3. Install Anchor CLI

Install Anchor Version Manager (AVM) for managing Anchor versions:

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --force
```

Install the latest Anchor CLI:

```bash
avm install latest
avm use latest
```

#### 4. Install Node.js and Yarn

Node.js and Yarn are required for running TypeScript tests and the frontend:

**Node.js:**

- Visit [nodejs.org](https://nodejs.org/) and install the LTS version
- Or use a version manager like `nvm`: `nvm install --lts && nvm use --lts`

**Yarn:**

```bash
npm install -g yarn
```

### Verify Installation

Check that all tools are installed correctly:

```bash
# Check Rust
rustc --version
# Expected: rustc 1.84.1+

# Check Solana CLI
solana --version
# Expected: solana-cli 2.0.26+

# Check Anchor CLI
anchor --version
# Expected: anchor-cli 0.31.1

# Check Node.js
node --version
# Expected: v22.0.0+

# Check Yarn
yarn --version
# Expected: 1.22.1+
```

### Solana CLI Basics

#### Configure Solana CLI

Set your cluster to devnet for development:

```bash
solana config set --url devnet
```

Check your current configuration:

```bash
solana config get
```

#### Create a Wallet

Generate a new keypair for development:

```bash
solana-keygen new
```

Get your wallet address:

```bash
solana address
```

#### Fund Your Wallet

Request devnet SOL for testing:

```bash
solana airdrop 2
```

Check your balance:

```bash
solana balance
```

**Note:** The airdrop command is limited to 5 SOL per request and may have rate limits. Alternatively, use the [Solana Web Faucet](https://faucet.solana.com/).

---

### Quick Setup

```bash
pnpm create solana-dapp@latest -t gh:solana-foundation/templates/community/merkle-airdrop
```

```bash
cd <your-project>
pnpm install
```

Generates the necessary TypeScript types and client code from the Solana program:

```bash
pnpm codama:generate
```

Then set up the program:

```bash
pnpm airdrop:setup
```

This single command will:

- ✅ Create deployment wallet and fund it with SOL
- ✅ Generate test wallets for airdrop recipients
- ✅ Build and deploy the Solana program
- ✅ Update all configuration files
- ✅ Generate the Merkle tree for airdrop distribution

#### Initialize the on-chain airdrop state and makes it ready for claiming:

```bash
pnpm airdrop:init
```

```bash
pnpm dev
```

---

### Architecture Overview

Airdrop distribution is reduced to a single on-chain commitment (the Merkle root), with off-chain generated proofs enabling recipients to claim their exact allocation. The template provides scripts to deploy, initialize, and claim using a type-safe, generated client.

```ascii
┌──────────────────────────────────────────────────────────┐
│                   Off-chain Preparation                  │
│  recipients.json  →  Merkle Tree  →  Root + Proofs       │
└───────────────┬───────────────────────┬──────────────────┘
                │                       │
  initialize(root, totalAmount)     claim(proof, amount, index)
                │                       │
        ┌───────▼─────────┐       ┌─────▼────────────────┐
        │  Airdrop State  │       │  Claim Status (PDA)  │
        │  (root stored)  │       │  per recipient       │
        └───────┬─────────┘       └──────────┬───────────┘
                │                            │
                │ funds                      │ prevent double-claim
                │                            │
           ┌────▼──────────┐            ┌────▼──────────┐
           │ Vault (PDA)   │ ───SOL──▶  │ Recipient     │
           └───────────────┘            └───────────────┘
```

---

### Merkle Airdrop Model

#### Why Merkle (root-only on-chain)

- Storing each recipient on-chain is expensive. A Merkle tree commits to the entire set with a single 32‑byte root.
- Each recipient proves inclusion with a logarithmic-size proof. On-chain verifies the proof against the stored root.
- Benefits: smaller state, predictable compute cost, scalable to large recipient sets.

#### Proof format and verification flow

- Leaf: hash of recipient data, typically `H(pubkey || amount)`. The exact encoding must match what the generator uses.
- Proof: ordered array of sibling hashes along the path to the root.
- Verification (simplified):
  1. Compute `leaf = H(pubkey || amount)` matching the off-chain generator’s format.
  2. Fold siblings: for each proof node, `hash = H(order(left, right))` using the known left/right order (often guided by `leafIndex`).
  3. Compare computed hash to the stored Merkle root; if equal, the claim is valid.

Gotcha: Proof order and the leaf encoding must match exactly. Any mismatch yields “invalid proof.”

---

### On-Chain Design

#### Accounts

- Airdrop State PDA
  - Purpose: Stores immutable Merkle root and global airdrop parameters.
  - Example seeds: ["airdrop", authority, airdropId]
  - Data (typical):
    - `authority: Pubkey` — entity initializing the airdrop
    - `merkleRoot: [u8; 32]`
    - `totalAmount: u64` — total lamports allocated
    - `claimedAmount: u64` — cumulative claimed lamports
    - `bump: u8`
  - Space: `8 (discriminator) + 32 + 32 + 8 + 8 + 1` ≈ 89 bytes; allocate with headroom (e.g., 128 bytes)

- Vault PDA (System Account owned by program)
  - Purpose: Holds SOL to be distributed.
  - Example seeds: ["vault", airdropState]
  - Data: lamports only; no data account needed if purely a System Account
  - Property: Only the program can move lamports from this PDA.

- Claim Status PDA (per recipient)
  - Purpose: Prevents double-claim.
  - Example seeds: ["claim", airdropState, recipientPubkey]
  - Data (typical):
    - `claimed: bool`
    - `amount: u64` (optional bookkeeping of claimed amount)
    - `bump: u8`
  - Space: `8 + 1 + 8 + 1` ≈ 18 bytes; allocate with headroom (e.g., 64 bytes)

Gotcha: Seeds shown are representative. Use the seeds compiled into your program and generated client.

#### Instructions

- initializeAirdrop
  - Inputs: `merkleRoot: [u8; 32]`, `totalAmount: u64`
  - Accounts: `authority (signer)`, `airdropState (PDA)`, `vault (PDA)`, `systemProgram`
  - Effects:
    - Creates/initializes `airdropState`
    - Optionally creates `vault`
    - Records the Merkle root and total allocation
    - May assert that sufficient SOL is present or transferred to `vault`

- claimAirdrop
  - Inputs: `amount: u64`, `leafIndex: u32|u64`, `proof: [[u8; 32]]`
  - Accounts: `signer (recipient)`, `airdropState`, `claimStatus (PDA)`, `vault (PDA)`, `systemProgram`
  - Effects:
    - Verifies the Merkle proof matches `(recipient, amount, index)`
    - Ensures `claimStatus` indicates not yet claimed
    - Marks as claimed and transfers `amount` lamports from `vault` to `signer`
    - Updates `claimedAmount`

Safeguards:

- Double-claim protection via `Claim Status` PDA.
- Root immutability: once set, the airdrop membership is fixed.
- Program-owned vault: only program logic moves funds.

#### State transitions and funds flow

- Initialize: `airdropState` is created with root and totals; `vault` is established and funded for the airdrop.
- Claim: Upon proof verification, lamports flow from `vault` to the claimant; `claimStatus` is created and marked to prevent reuse.
- Completion: When `claimedAmount == totalAmount`, distribution is complete. Any remainder handling (e.g., sweep/close) depends on program design.

---

### Program Interactions

Below are concise TypeScript examples using the generated Codama client. These snippets assume the scripts have already generated and wired the client paths. Use @solana/kit to create and send transactions.

Initialize airdrop:

```ts
import { getInitializeAirdropInstruction } from './anchor/generated/clients/ts/instructions/initializeAirdrop'
import { address } from '@solana/kit' // Solana Kit address helpers
// import your client, RPC, and wallet abstractions from your app’s runtime

const initIx = getInitializeAirdropInstruction({
  airdropState: airdropStatePda, // PDA derived by client/helpers
  authority: authorityPubkey, // wallet pubkey
  merkleRoot: new Uint8Array(root32), // 32-byte root
  amount: BigInt(totalLamports), // u64
})

// Use your Solana Kit transaction helpers to send:
// await sendInstructions([initIx], { payer: authority, rpc });
```

Claim airdrop:

```ts
import { getClaimAirdropInstruction } from './anchor/generated/clients/ts/instructions/claimAirdrop'
import { address } from '@solana/kit'

const proofBytes = proofHexArray.map((h) => new Uint8Array(Buffer.from(h.slice(2), 'hex')))

const claimIx = getClaimAirdropInstruction({
  airdropState: airdropStatePda,
  userClaim: claimStatusPda, // PDA for this recipient
  signer: recipientPubkey, // claimant wallet
  proof: proofBytes, // [[u8; 32]]
  amount: BigInt(recipientLamports),
  leafIndex: recipientIndex,
})

// await sendInstructions([claimIx], { payer: recipient, rpc });
```

Gotcha: Ensure the proof, amount, and index fed to the instruction are exactly those used by the Merkle generator that produced the root.

---

### Security and Safety

- Common pitfalls
  - Proof mismatch: Using a different hashing or encoding than the generator yields “invalid proof.”
  - Program ID mismatch: If the deployed ID differs from what the client expects, instruction builders point to the wrong program.
  - Replay/double-claim: Prevented by `Claim Status` PDA; if missing or mismatched seeds, a second claim may slip through in theory—stick to the generated client and canonical seeds.

- Upgrade authority and immutability
  - Keep the upgrade authority secure. Consider making the program immutable after thorough testing.
  - If upgradable, document any migration strategy for vault and state.

- Limits
  - Compute budget: Proof depth increases compute cost (~O(log n)). Very deep trees need budget tuning.
  - Account sizes: Reserve adequate space for PDAs (Anchor discriminator adds 8 bytes).
  - Transaction size: Large proofs or multiple instructions may approach limits; use single-claim per transaction.

Gotcha: Root immutability means membership is fixed. Changing recipients requires a new root and a new airdrop state.

---

### Testing and Validation

The test suite validates:

- Initialization creates PDAs and records the Merkle root
- Happy-path claim transfers lamports and marks the claim
- Double-claim is rejected via `Claim Status` PDA
- Incorrect proof or wrong amount fails verification
- Aggregate `claimedAmount` reflects actual transfers

See `anchor/tests/solana-distributor-comprehensive.test.ts` for end‑to‑end coverage using the generated client and Solana Kit helpers.

---

### Version and Compatibility Notes

- Anchor CLI: 0.31.1
- Solana CLI: 2.2.20+ (2.2.x)
- Rust: 1.88.0+
- Node.js: 22+

The template and generated client target these versions for consistent behavior and type compatibility.

---

### Using the Scripts

- Run the provided scripts in order to generate the client, deploy, and initialize the airdrop; then use the app or scripts to claim.
- Environment, program IDs, recipients, and Merkle artifacts are auto-managed by the scripts and committed to the expected paths.

---

### FAQ

- Why does my claim say “Address not eligible for this airdrop”?
  - The wallet is not in the recipients set used to produce the current Merkle root, or the proof/amount/index don’t match.

- I see “Program ID mismatch.” What now?
  - Ensure your generated client and scripts reference the deployed program ID. Re-run the script that fixes IDs and regenerates the client.

- Claims fail with “invalid proof.”
  - Ensure the generator and on-chain hashing agree on leaf encoding and sibling order. Regenerate proofs after any recipients change.

- Can someone claim twice with the same wallet?
  - No. The claim creates a `Claim Status` PDA keyed by `(airdropState, recipient)`. Second attempts are rejected.

- What if the vault runs out of SOL?
  - Claims will fail. Replenishment behavior depends on your program’s design. This template expects sufficient initial funding during initialization.

- Can I rotate the authority?
  - Not by default. Authority primarily matters at initialization. Changing authorities typically requires explicit program support and migration.

---

### Glossary

- Merkle root: A 32‑byte commitment to a set. Verifies inclusion with minimal proofs.
- Merkle proof: A sequence of sibling hashes used to reconstruct the root from a leaf.
- PDA (Program Derived Address): Deterministic, program-owned address derived from seeds, not signable by a private key.
- Lamports: Smallest unit of SOL (1 SOL = 1,000,000,000 lamports).
- Discriminator: Anchor’s 8‑byte account type prefix stored in every account it manages.
- Authority: The signer that initializes the airdrop; typically controls setup, not claims.
- Vault: Program-owned System Account holding the lamports to distribute.

---

### Gaps and Suggestions

- Explicit seeds and data layouts: Document the exact PDA seeds and account layouts as compiled, including endianness and serialization formats, in `anchor/README.md` alongside the IDL.
- Hashing details: Add a dedicated note specifying the leaf encoding and hash function, including byte order and any domain separators, to eliminate proof mismatches.
- Vault lifecycle: Clarify whether the vault can be topped up, swept, or closed, and under what authority or conditions.
- Compute guidance: Provide recommended compute budget and proof depth limits for large distributions, plus tips for splitting claims if needed.
- Error catalog: Include a short table mapping common on-chain error codes to actionable fixes to speed up debugging.
- Post-initialize governance: If upgrades remain enabled, document upgrade procedures and how they affect the client and deployed state; if not, state immutability explicitly.

---

## Key Technologies

- **[@solana/kit](https://github.com/anza-xyz/kit)**: Modern Solana JavaScript SDK
- **[@solana/react-hooks](https://www.npmjs.com/package/@solana/react-hooks)**: React hooks for Solana
- **[Codama](https://github.com/codama-idl/codama)**: Automatic client generation
- **[Anchor Framework](https://www.anchor-lang.com/)**: Solana program development
- **[Vitest](https://vitest.dev/)**: Fast unit testing framework

---
