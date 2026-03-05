# Solana Staking Template

A full-featured SPL token staking application built with **Anchor** and **Next.js**, demonstrating pool initialization, staking, unstaking, reward distribution, and an admin reward management system.

> Scaffoldable via `pnpm create solana-dapp --template staking`

---

## Architecture Overview

```
community/staking/
├── programs/staking-program/   # Anchor smart contract
│   └── src/
│       ├── lib.rs              # Program entrypoints
│       ├── state/              # Account data structures
│       │   ├── global_state.rs # Pool configuration & totals
│       │   └── staker.rs       # Per-user staking position
│       ├── instructions/       # Business logic handlers
│       │   ├── initialize.rs   # Pool setup
│       │   ├── stake.rs        # Deposit tokens
│       │   ├── unstake.rs      # Withdraw tokens
│       │   ├── claim.rs        # Claim rewards
│       │   └── add_rewards.rs  # Admin: fund reward pool
│       ├── accounts_context/   # Account validation structs
│       └── error.rs            # Custom error codes
├── tests/                      # Anchor integration tests
├── app/                        # Next.js 16 frontend
│   ├── app/                    # App router pages
│   └── components/             # React components
│       ├── WalletContextProvider.tsx
│       └── StakingDashboard.tsx
└── Anchor.toml
```

### On-Chain Accounts

| Account       | Type          | Seeds                     | Description                                          |
| ------------- | ------------- | ------------------------- | ---------------------------------------------------- |
| `GlobalState` | PDA           | `["global_state"]`        | Pool config: admin, mint, vault, totals, reward rate |
| `Staker`      | PDA           | `["staker", user_pubkey]` | Per-user: staked amount, reward debt                 |
| `Vault`       | Token Account | `["staking_vault"]`       | Holds staked SPL tokens                              |
| `RewardPool`  | Token Account | `["reward_pool"]`         | Holds reward tokens for distribution                 |

### Instructions

| Instruction                 | Signer | Description                                   |
| --------------------------- | ------ | --------------------------------------------- |
| `initialize`                | Admin  | Creates pool, vault, and reward pool accounts |
| `stake(amount)`             | User   | Transfers tokens from user to vault           |
| `unstake(amount)`           | User   | Transfers tokens from vault back to user      |
| `claim`                     | User   | Calculates rewards and transfers to user token account |
| `add_rewards(amount, rate)` | Admin  | Funds reward pool and sets emission rate      |

### Frontend Features

- Stake input and submit flow
- Unstake flow for existing positions
- Reward claim action
- User dashboard with current position and claimed rewards
- Pool statistics for total staked, reward pool, and reward rate
- Devnet faucet route for minting test staking tokens to connected wallets

---

## Deployment & Initialization

### Prerequisites

- [Solana CLI](https://docs.solana.com/cli/install) v1.18+
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) v0.30+
- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Quick Start (Devnet)

This is the recommended reviewer/demo flow.

```bash
# 1. Install dependencies
pnpm install

# 2. Sync the generated program keypair into Rust, Anchor.toml, app types, and app/.env.local
node scripts/sync-program-id.js

# 3. Deploy the synced program to devnet
anchor deploy --provider.cluster devnet

# 4. Create a staking mint on devnet
spl-token --url https://api.devnet.solana.com create-token --decimals 6

# 5. Initialize the staking pool on devnet with that mint
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com node scripts/initialize-pool.js --mint <TOKEN_MINT_ADDRESS>

# 6. Fund the reward pool and set a reward rate
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com node scripts/add-rewards.js --amount 1000 --rate 1

# 7. Install frontend dependencies and start the app
cd app
pnpm install
pnpm dev
```

### Program ID and Environment Sync

```bash
# Sync the generated program keypair into Rust, Anchor.toml, app types, and app/.env.local
node scripts/sync-program-id.js

# Optional: switch the frontend/app defaults to localnet instead of devnet
node scripts/sync-program-id.js --network localnet
```

`sync-program-id.js` does four things:

1. Reads the generated deploy keypair from `target/deploy/staking_program-keypair.json`
2. Syncs that program ID into `programs/staking-program/src/lib.rs`
3. Syncs the same ID into `Anchor.toml` and copied frontend IDL/types
4. Writes `app/.env.local` so the frontend points at the correct cluster and program ID

Default `app/.env.local` after sync:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<synced program id>
```

If you want localnet instead, rerun:

```bash
node scripts/sync-program-id.js --network localnet
```

That rewrites `app/.env.local` to use:

- `NEXT_PUBLIC_SOLANA_NETWORK=localnet`
- `NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8899`
- `NEXT_PUBLIC_PROGRAM_ID=<your local deploy program id>`

### Deploy the Program

```bash
anchor deploy --provider.cluster devnet
```

### Initialize the Pool

After deployment, create an SPL mint on devnet with the same admin keypair you will use for the app faucet and pool initialization:

```bash
# Create a mint on devnet
spl-token --url https://api.devnet.solana.com create-token --decimals 6

# Initialize the pool on devnet
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com node scripts/initialize-pool.js --mint <TOKEN_MINT_ADDRESS>
```

The initializer derives and creates:

- `global_state`
- `staking_vault`
- `reward_pool`

If the pool is already initialized, the script exits safely after printing the derived addresses.

### Reward Funding

Pool initialization creates the reward pool account, but it does **not** fund rewards by itself.

To make `claim` meaningful, the admin must call `add_rewards(amount, reward_rate)` after initialization:

- `amount`: how many reward tokens to deposit into the reward pool
- `reward_rate`: tokens emitted per second, using the mint's base units

Recommended helper command on devnet:

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com node scripts/add-rewards.js --amount 1000 --rate 1
```

What `add-rewards.js` does:

1. Reads the staking mint from `global_state`
2. Ensures the current wallet is the pool admin
3. Creates the admin associated token account for the staking mint if needed
4. Mints reward tokens to the admin wallet by default
5. Calls the on-chain `add_rewards` instruction to transfer those tokens into the reward pool and set the reward rate

If you already minted tokens to the admin wallet manually, you can skip the mint step:

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com node scripts/add-rewards.js --amount 1000 --rate 1 --skip-mint
```

### Run the Frontend

```bash
cd app
pnpm install
pnpm dev
```

The frontend reads its RPC endpoint and program ID from `app/.env.local`. Do not rely on a shared devnet deployment unless your `NEXT_PUBLIC_PROGRAM_ID` matches a program you deployed from this workspace.

### Demo Flow in the UI

1. Connect a wallet on devnet
2. Ensure the wallet has devnet SOL for transaction fees
3. Click `Get test tokens` to mint staking tokens to the connected wallet
4. Stake tokens into the vault
5. Unstake part or all of the position
6. Claim rewards after the reward pool has been funded by the admin

Notes:

- `Get test tokens` mints staking tokens to the connected wallet; it does not fund the reward pool
- A fresh wallet still needs devnet SOL for account creation and transaction fees
- If the UI shows `Pool not initialized`, run `initialize-pool.js` for the same cluster and program ID the app is using

---

## Reward Calculation Mechanism

Rewards are distributed proportionally based on each staker's share of the total staked amount:

1. **Admin sets reward rate** via `add_rewards(amount, reward_rate)` — deposits tokens into the reward pool and sets tokens-per-second emission rate.

2. **Time-based accrual** — When a user calls `claim`, the program calculates:

   ```
   time_elapsed = current_time - last_reward_time
   rewards_to_distribute = time_elapsed × reward_rate
   rewards = min(rewards_to_distribute, reward_pool_balance)
   ```

3. **Proportional share** — Each staker receives:

   ```
   staker_share = (staker.staked_amount / global.total_staked) × rewards
   ```

4. **Reward debt tracking** — `staker.reward_debt` accumulates total claimed rewards per user.

5. **State updates after claim** — The program updates `last_reward_time`, decrements `reward_pool`, and increments user `reward_debt` after a successful claim.

### Current Reward Model Notes

- Rewards are distributed only when `claim` is called
- The template keeps reward accounting intentionally simple for clarity
- Integer division can round down small claims
- This design is appropriate for a template/demo, but production staking systems typically use a more robust accumulated-reward-per-share model

---

## Security Considerations

### PDA Authority Pattern

- The staking vault uses a `vault_authority` PDA as its token authority, ensuring only the program can sign transfers out of the vault.
- The reward pool uses a separate `reward_pool_authority` PDA, isolating reward funds from staked funds.

### Input Validation & Access Control

- **Insufficient stake check** — `unstake` validates `staker.staked_amount >= amount` before processing, preventing underflow.
- **Reward pool bounds** — `claim` caps distributed rewards at `min(calculated_rewards, reward_pool_balance)`.
- **Admin-only reward management** — `add_rewards` enforces `signer == global_state.admin`.
- **Canonical PDA constraints** — vault and reward pool token accounts are constrained to the expected PDA seeds and authorities.

### Known Limitations & Production Hardening

- **Overflow protection** — Reward calculations use checked arithmetic and `u128` intermediates where appropriate.
- **Reward precision** — Integer math can round down very small reward shares; precision scaling can be increased for production.
- **Rent exemption** — All PDA accounts are initialized with rent-exempt balances.
- **Template reward model** — Rewards are updated on claim, not continuously persisted per user on every state transition.

### Audit Recommendations

- Add a `pause` mechanism for emergency stops
- Implement time-lock on admin operations
- Add maximum stake/unstake limits
- Add a production-grade accumulated reward-per-share accounting model
- Add explicit admin tooling/UI for reward funding and pool management

---

## Troubleshooting

### `Pool not initialized`

You have not run `initialize-pool.js` for the same cluster and program ID the frontend is using.

Check:

- `app/.env.local`
- the output of `node scripts/sync-program-id.js`
- the mint cluster used in `spl-token create-token`

### `Mint ... does not exist or is not an SPL token mint`

The mint was created on a different cluster than the one passed to `initialize-pool.js`.

Example mismatch:

- `spl-token create-token` used your Solana CLI default cluster
- `initialize-pool.js` used `ANCHOR_PROVIDER_URL=https://api.devnet.solana.com`

Fix by explicitly using the same cluster for both commands.

### Staking wallet has no SOL

`Get test tokens` only mints SPL tokens. The connected wallet still needs devnet SOL to create accounts and pay transaction fees.

### Rewards cannot be claimed

The admin has not yet funded the reward pool with `add_rewards`, or the configured reward rate and elapsed time have not produced a positive claimable amount yet.

If you see:

```text
EmptyRewardPool
```

run:

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com node scripts/add-rewards.js --amount 1000 --rate 1
```

---

## Testing

```bash
# Run the Anchor test suite
anchor test

# Tests cover:
# ✓ Pool initialization (verifies all GlobalState fields)
# ✓ Staking tokens (verifies vault balance, staker state, global totals)
# ✓ Repeated stake accumulation (no state reset on second stake)
# ✓ Admin-only reward funding (`add_rewards`)
# ✓ Reward claim flow (tokens transferred to user token account)
# ✓ Unstake validation (InsufficientStake error on over-withdrawal)
# ✓ Partial unstake (balance reconciliation)
```

`anchor test` uses the Anchor local validator flow and is separate from the app's default devnet demo flow.

---

## Tech Stack

| Layer          | Technology                                              |
| -------------- | ------------------------------------------------------- |
| Smart Contract | Anchor 0.32.1, Rust                                     |
| Frontend       | Next.js 16, React 19, TypeScript                        |
| Styling        | Tailwind CSS 4                                          |
| Wallet         | Solana Wallet Adapter                                   |
| Token Standard | SPL Token (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) |

---

## License

ISC
