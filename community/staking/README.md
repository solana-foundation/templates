## Solana Staking dApp

A full-stack staking protocol built with **Anchor (Solana)** for the on-chain program and **Next.js + Tailwind CSS** for the frontend. Users stake SOL, earn reward tokens over time, and can claim/unstake via a modern dashboard UI.

---

## 1. Architecture Overview

- **On-chain program (`programs/staking`)**
  - **Entrypoint**: `lib.rs`
    - `initialize` – creates a per-user `StakeAccount` PDA and an SOL vault PDA.
    - `stake` – moves SOL into the vault and mints receipt tokens to the user.
    - `unstake` – burns receipt tokens and returns SOL from the vault.
    - `claim_reward` – converts accumulated "points" into reward tokens from a reward vault.
    - `initialize_pool` – sets global pool configuration (admin, reward mint, reward rate, reward vault PDA).
    - `fund_reward_vault` – moves reward tokens from the admin into the reward vault.
  - **State (`state.rs`)**
    - `PoolState`
      - `admin` – authority that can configure the pool and fund rewards.
      - `reward_mint` – SPL token mint used for rewards.
      - `reward_rate` – base points emission rate for the pool (points per second, see below).
    - `StakeAccount`
      - `signer` – owner of the stake.
      - `staked_amount` – amount of SOL currently staked.
      - `point` – accumulated reward "points".
      - `last_update_amount` – last timestamp when points were updated.
      - `bump` – PDA bump for replaying seeds.
  - **Utilities (`utils/mod.rs`)**
    - `update_point(stake_account, current_time)` – recomputes and accumulates reward points based on elapsed time and staked amount, then updates `last_update_amount`.
    - `calculate_point_earned(staked, time)` – pure math function that converts \(staked \times time\) into integer points using safe `u128` arithmetic and checked operations.
  - **Instructions**
    - `initialize_pool.rs` – derives `pool_state` PDA using seeds `[b"pool_state", reward_mint.key().as_ref()]`.
    - `admin_fund.rs` – funds the `reward_vault` PDA.
    - `initialize.rs` – derives per-user `StakeAccount` and SOL `vault` PDAs (e.g. seeds `["client1", user]`, `["vault", user]`) and initializes timestamps.
    - `stake.rs` – calls `update_point`, moves SOL into the vault, and mints receipt tokens via a mint-authority PDA.
    - `unstake.rs` – calls `update_point`, burns receipt tokens, and withdraws SOL from the vault.
    - `claim_rewards.rs` – calls `update_point`, calculates claimable reward tokens, transfers them from `reward_vault` to the user, and adjusts `point`.

- **Frontend (`frontend/`)**
  - **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS + `next-themes`.
  - **Key pieces**
    - `lib/anchor.ts` – sets up the Anchor `Program` client on the frontend using the compiled IDL.
    - `lib/config.ts` – hard-coded `REWARD_MINT` and `RECEIPT_MINT` public keys for the deployed instance.
    - `lib/pdas.ts` – PDA derivation helpers (pool, stake account, vaults, mint authority, reward vault).
    - Hooks:
      - `useAnchorProgram` – memoized Anchor program client bound to current wallet/connection.
      - `useStakeAccount` – fetches the user's `StakeAccount` PDA.
      - `usePoolState` – fetches global `PoolState`.
      - `useSolBalance` – fetches the wallet's SOL balance.
    - UI:
      - `app/layout.tsx` + `components/layout/layout-client.tsx` – root layout, wallet provider, theme provider, toasts.
      - `app/page.tsx` – staking dashboard route.
      - `components/staking/*` – main staking UI: dashboard, stake/unstake forms, rewards view, pool statistics.
    - The frontend talks directly to the Anchor program using the same PDAs and seeds as the Rust code and reflects on-chain state live in the dashboard.

---

## 1.1. Type definitions for program accounts and instructions

### On-chain accounts (Rust — `state/mod.rs`)

```rust
#[account]
pub struct StakeAccount {
    pub point: u64,              // Accumulated reward points (1,000,000 pts = 1 token)
    pub staked_amount: u64,      // Whole SOL currently staked
    pub signer: Pubkey,          // Owner wallet
    pub bump: u8,                // PDA bump
    pub last_update_amount: i64, // Unix timestamp of last point accrual
    pub seed: u64,               // Seed passed during initialization
}

#[account]
pub struct PoolState {
    pub admin: Pubkey,       // Authority for pool config & funding
    pub reward_mint: Pubkey, // SPL token mint used for rewards
    pub reward_rate: u64,    // Reserved for future emission scaling (not used in current formula)
    pub total_staked: u64,   // Total SOL staked across all users
    pub is_paused: bool,     // Emergency kill-switch
    pub bump: u8,            // PDA bump
}
```

### Frontend TypeScript mirrors (`lib/types.ts`)

```ts
interface StakeAccount {
  point: BN;
  stakedAmount: BN;
  signer: PublicKey;
  bump: number;
  lastUpdateAmount: BN;
  seed: BN;
}

interface PoolState {
  admin: PublicKey;
  rewardMint: PublicKey;
  rewardRate: BN;
  totalStaked: BN;
  isPaused: boolean;
  bump: number;
}

const POINTS_PER_TOKEN = 1_000_000;
```

### PDA seeds

| PDA | Seeds | Description |
|-----|-------|-------------|
| `pool_state` | `["pool_state", reward_mint]` | Global pool configuration |
| `reward_vault` | `["reward_vault", reward_mint]` | Token account holding reward tokens |
| `stake_account` | `["client1", user]` | Per-user staking state |
| `vault` | `["vault", user]` | Per-user SOL vault (holds staked lamports) |
| `mint_authority` | `["mint_authority"]` | PDA with authority to mint receipt tokens |

### Instructions

| Instruction | Args | Key Accounts | Description |
|-------------|------|--------------|-------------|
| `initialize(seed: u64)` | `seed` | `signer`, `stake_account` (init), `vault`, `system_program` | Creates a per-user `StakeAccount` PDA and SOL vault |
| `stake(amount: u64)` | Whole SOL amount | `signer`, `stake_account`, `pool_state`, `reward_mint`, `mint_account` (receipt), `associated_token_account`, `vault`, `mint_authority` | Transfers `amount × LAMPORTS_PER_SOL` to vault, mints receipt tokens, accrues points, updates `total_staked` |
| `unstake(amount: u64)` | Whole SOL amount | `signer`, `stake_account`, `pool_state`, `reward_mint`, `mint_account` (receipt), `associated_token_account`, `vault` | Burns receipt tokens, returns SOL from vault, accrues points, updates `total_staked` |
| `claim_reward()` | — | `signer`, `stake_account`, `reward_mint`, `user_reward_account`, `reward_vault` | Accrues points, converts `points / 1,000,000` to reward tokens, transfers from `reward_vault` |
| `initialize_pool(reward_rate: u64)` | `reward_rate` | `admin` (MASTER_ADMIN), `pool_state` (init), `reward_mint`, `reward_vault` (init) | Creates global pool state and reward vault; admin-only |
| `fund_reward_vault(amount: u64)` | Token amount | `admin`, `pool_state`, `reward_mint`, `admin_token_account`, `reward_vault` | Transfers reward tokens from admin into the vault; admin-only |

### Error codes (`error/mod.rs`)

| Variant | Message |
|---------|---------|
| `InvalidAmount` | Invalid amount |
| `InvalidTimestamp` | Invalid timestamp |
| `Unauthorized` | Unauthorized |
| `Overflow` | Math overflow or underflow occurred |

### Helper functions (`lib/types.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `pointsToTokens` | `(points: BN) → number` | `points / 1,000,000` (fractional) |
| `claimableTokens` | `(points: BN) → number` | `floor(points / 1,000,000)` (whole tokens claimable) |
| `shortAddress` | `(addr: PublicKey \| string) → string` | Truncates to `xxxx...xxxx` |
| `parseAnchorError` | `(err: unknown) → string` | Maps on-chain error variants to user-friendly messages |

### Anchor-generated types

- **`target/types/staking.ts`** — Generated by `anchor build`. Provides a strongly-typed `Program<Staking>` with typed `program.methods.*` and `program.account.*`.
- **`target/idl/staking.json`** — IDL consumed by the frontend (vendored at `frontend/idl/staking.json`).

Example (tests):

```ts
import { Program } from "@coral-xyz/anchor";
import { Staking } from "../target/types/staking";

const program = anchor.workspace.Staking as Program<Staking>;

// Typed instruction call
await program.methods
  .stake(new anchor.BN(1))
  .accountsStrict({ /* ... */ })
  .rpc();

// Typed account fetch
const stakeAccount = await program.account.stakeAccount.fetch(stakeAccountPda);
```

When you change on-chain account fields or instruction accounts/args:

- Run `anchor build` to regenerate `target/idl/staking.json` and `target/types/staking.ts`.
- Copy the IDL into the frontend (`frontend/idl/staking.json`) if your frontend is vendoring the IDL.
- Update `frontend/lib/types.ts` and any PDA derivations in `frontend/lib/pdas.ts` if seeds changed.

---

## 2. Deployment & Initialization

### 2.1. Prerequisites

- Rust + Cargo
- Solana CLI (configured for `devnet`)
- Anchor CLI
- Node.js (LTS) + `yarn` or `npm`

### 2.2. Build & deploy the program

From the repo root (`staking/`):

```bash
anchor build
anchor deploy
```

Deployment will:

- Compile the on-chain program.
- Deploy to the configured cluster (see `Anchor.toml`).
- Update the IDL and program ID under `target/`.

If you change the program ID, also update:

- `programs/staking/src/lib.rs` – `declare_id!("...")`
- Frontend `frontend/lib/anchor.ts` – the program ID used by the client.

Copy the generated IDL into the frontend if needed:

```bash
cp target/idl/staking.json frontend/idl/staking.json
```

### 2.3. Create reward & receipt mints

On devnet (example using `spl-token` CLI):

```bash
solana config set --url https://api.devnet.solana.com

# Admin keypair (fund with airdrop first)
solana-keygen new -o admin.json
solana airdrop 2 "$(solana-keygen pubkey admin.json)"

# Reward token mint (e.g. 6 decimals)
spl-token create-token --decimals 6 --fee-payer admin.json
# -> reward mint address: <REWARD_MINT>

# Receipt token mint (e.g. 9 decimals, mint authority = program mint_authority PDA)
# For development it's often convenient to mint via the admin and then move authority,
# or follow the pattern used in `tests/staking.ts` to derive the mint authority PDA.
```

Set the mint addresses in the frontend:

- `frontend/lib/config.ts`

```ts
export const REWARD_MINT = new PublicKey("<REWARD_MINT>");
export const RECEIPT_MINT = new PublicKey("<RECEIPT_MINT>");
```

### 2.4. Initialize pool & fund rewards

You must run the two admin instructions at least once:

1. **`initialize_pool`**
   - Inputs:
     - `admin` – admin wallet.
     - `reward_mint` – SPL mint created above.
     - `reward_rate` – base emission rate (see reward section below).
   - Accounts:
     - `pool_state` PDA: `["pool_state", reward_mint]`.
     - `reward_vault` PDA: `["reward_vault", reward_mint]`.

2. **`fund_reward_vault`**
   - Moves reward tokens from an admin-owned token account into the `reward_vault` PDA.

You can use the existing `tests/staking.ts` as a reference for how to:

- Derive PDAs.
- Create SPL token mints and accounts.
- Call `initializePool` and `fundRewardVault`.

For a quick end-to-end verification:

```bash
anchor test
```

This runs the full suite:

- Initialize pool
- Fund reward vault
- Initialize user stake account
- Stake
- Wait
- Claim rewards
- Unstake

---

## 3. Reward Calculation Mechanism

The protocol uses an intermediate **points** system to avoid floating‑point math on-chain and to support flexible emission rates.

- **Core constants** (in `utils/mod.rs`)
  - `POINTS = 1_000_000` — scaling factor (1 reward token = 1,000,000 points)
  - `SECONDS = 3_600` — time divisor (1 hour in seconds)

- **Point accrual (`update_point`)**
  - On any action that affects rewards (`stake`, `unstake`, `claim_reward`), the program:
    1. Reads the current timestamp (`Clock::get()?.unix_timestamp`).
    2. Computes `time = current_time - last_update_amount`.
    3. If `time > 0` and `staked_amount > 0`, it calls `calculate_point_earned(staked_amount, time)`.
    4. Adds the new points to `stake_account.point`.
    5. Sets `stake_account.last_update_amount = current_time`.
  - This means rewards are **continuous over time** and independent of how often the user interacts, as long as they perform an action to trigger `update_point`.

- **Point formula (`calculate_point_earned`)**
  - Internally uses `u128` and checked operations:
    $$\text{points} = \frac{\text{staked\_amount} \times \text{time} \times POINTS}{SECONDS} = \frac{\text{staked\_amount} \times \text{time} \times 1{,}000{,}000}{3{,}600}$$
  - Interpreting the constants:
    - `staked_amount` is in **whole SOL units** (the program stores and operates on whole numbers, not lamports).
    - `time` is in seconds.
    - The `POINTS / SECONDS` ratio means: **1 SOL staked for 1 hour (3,600 s) earns exactly 1,000,000 points = 1 reward token**.

- **Concrete emission rates**
  | Staked | Duration | Points earned | Reward tokens |
  |--------|----------|---------------|---------------|
  | 1 SOL  | 1 hour   | 1,000,000     | 1             |
  | 1 SOL  | 1 day    | 24,000,000    | 24            |
  | 1 SOL  | 1 year   | 8,760,000,000 | 8,760         |
  | 2 SOL  | 1 hour   | 2,000,000     | 2             |
  | 5 SOL  | 1 day    | 120,000,000   | 120           |

- **Claiming rewards (`claim_rewards.rs`)**
  - First, `update_point` is called to settle points up to "now".
  - Claimable reward tokens:

    ```rust
    let mut claimable_amount = stake_account
        .point
        .checked_div(1_000_000)
        .ok_or(StakeError::Overflow)?;

    if claimable_amount == 0 && stake_account.point > 0 {
        claimable_amount = 1;
    }
    ```

    - **1,000,000 points = 1 reward token unit** (respecting mint decimals).
    - If integer division would give 0 but the user has a non-zero point balance, they receive 1 minimum unit.

  - After transferring tokens from `reward_vault` to `user_reward_account`, points are reduced in a **saturating** manner:

    ```rust
    let points_deducted = claimable_amount
        .saturating_mul(1_000_000)
        .min(stake_account.point);
    stake_account.point = stake_account.point.saturating_sub(points_deducted);
    ```

    - Prevents underflow in edge cases where rounding up gave the user 1 unit with slightly fewer than `1_000_000` points.
    - Leftover fractional points stay on the account for future claims.

- **High-level intuition**
  - Points grow **linearly** with both **staked amount** and **time**.
  - The exchange rate is fixed: **1,000,000 points = 1 reward token**.
  - Effective yield: **1 token per SOL per hour** → **24 tokens/SOL/day** → **8,760 tokens/SOL/year**.
  - The global `reward_rate` in `PoolState` is stored for future extensibility (e.g. admin-adjustable emission scaling) but the current `calculate_point_earned` formula does not use it — the rate is fully determined by the `POINTS` and `SECONDS` constants.

---

## 4. Security Considerations

This project is a template / reference implementation. Before mainnet use, **get a professional audit**. Important points:

- **Authority & access control**
  - PDAs and `has_one` constraints enforce ownership:
    - `StakeAccount` PDA: seeds include the user pubkey and `has_one = signer` to ensure only the owner can stake/unstake/claim.
    - `PoolState` PDA: stores `admin`; only this admin can call `initialize_pool` and `fund_reward_vault`.
    - `reward_vault` PDA: derived from `["reward_vault", reward_mint]` and only controlled via program CPI with signer seeds.
  - Always ensure the **program ID and seeds** match exactly between your frontend, tests, and deployed program.

- **Overflow / underflow protection**
  - All arithmetic in `calculate_point_earned` uses:
    - `checked_mul`, `checked_div` with `Result` erroring to `StakeError::Overflow` on failure.
  - `update_point` validates timestamps:
    - Uses `checked_sub` for `current_time - last_update_amount`, failing with `StakeError::InvalidTimestamp` if it underflows.
  - `claim_reward` uses `saturating_mul` and `saturating_sub` to avoid underflow when burning points after rounding up.

- **Time manipulation**
  - Rewards depend on `Clock::get()?.unix_timestamp`.
  - While Solana validators can skew timestamps slightly, the protocol assumes typical Solana behavior (bounded drift). For adversarial environments, additional bounds or rate limits may be added.

- **Token vaults & PDAs**
  - Reward tokens reside in a **vault PDA**, not in a plain admin-owned account:
    - Only the program, with the correct seeds, can move funds out.
  - SOL is stored in a vault PDA per user; only authorized instructions can withdraw it.
  - When modifying seeds, update:
    - Rust account constraints.
    - PDA derivation helpers in the frontend (`lib/pdas.ts`).
    - Tests (`tests/staking.ts`).

- **Frontend considerations**
  - Client-side validation:
    - Stake/unstake forms only accept **whole SOL amounts** and check balance/staked limits before sending transactions.
  - Wallet connection:
    - Uses `@solana/wallet-adapter-react` with explicit checks for `publicKey` and `signTransaction`.
  - Theme / UI:
    - Dark mode is purely cosmetic (no impact on security) but uses semantic CSS variables to keep contrast and readability high.

- **Keys & tests**
  - `tests/staking.ts` contains **hard-coded private keys** for admin and user **for local/devnet testing only**.
  - Never reuse these keys or this pattern for production deployments.
  - For real deployments:
    - Use hardware wallets or secure key management.
    - Remove hard-coded secrets from the codebase.

---

## 5. Running Locally

From repo root:

```bash
# 1) Program side
anchor build
anchor test   # optional: runs full e2e test suite

# 2) Frontend
cd frontend
yarn install   # or npm install
yarn dev       # or npm run dev
```

Then open `http://localhost:3000` and connect a devnet wallet. Make sure:

- Your wallet is on **devnet**.
- The program is deployed to devnet and the frontend `PROGRAM_ID`, `REWARD_MINT`, and `RECEIPT_MINT` match the deployed configuration.

