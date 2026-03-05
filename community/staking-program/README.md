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
| `claim`                     | User   | Calculates and transfers proportional rewards |
| `add_rewards(amount, rate)` | Admin  | Funds reward pool and sets emission rate      |

---

## Deployment & Initialization

### Prerequisites

- [Solana CLI](https://docs.solana.com/cli/install) v1.18+
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) v0.30+
- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Deploy the Program

```bash
# Build the program
anchor build

# Deploy to localnet (start validator first: solana-test-validator)
anchor deploy

# Or deploy to devnet
anchor deploy --provider.cluster devnet
```

### Initialize the Pool

After deployment, the admin must call `initialize` with the SPL token mint to create the staking pool:

```typescript
await program.methods
  .initialize()
  .accounts({
    admin: adminPublicKey,
    mint: tokenMintAddress,
    // Other PDA accounts are derived automatically
  })
  .rpc()
```

### Run the Frontend

```bash
cd app
pnpm install
pnpm dev
```

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

> **Note:** The current implementation calculates rewards at claim time based on the snapshot of `last_reward_time`. For production use, consider implementing an accumulator-based model (reward per token stored) to avoid race conditions between multiple claimants.

---

## Security Considerations

### PDA Authority Pattern

- The staking vault uses a `vault_authority` PDA as its token authority, ensuring only the program can sign transfers out of the vault.
- The reward pool uses a separate `reward_pool_authority` PDA, isolating reward funds from staked funds.

### Input Validation

- **Insufficient stake check** — `unstake` validates `staker.staked_amount >= amount` before processing, preventing underflow.
- **Reward pool bounds** — `claim` caps distributed rewards at `min(calculated_rewards, reward_pool_balance)`.

### Known Limitations & Production Hardening

- **Admin access control** — The `add_rewards` instruction should verify `signer == global_state.admin` for production deployments.
- **Overflow protection** — Reward calculations use `u128` intermediate arithmetic to prevent overflow on large values.
- **Reentrancy** — Anchor's account deserialization provides baseline protection; state mutations happen after CPI calls should be reordered for defense-in-depth.
- **Rent exemption** — All PDA accounts are initialized with rent-exempt balances.

### Audit Recommendations

- Add a `pause` mechanism for emergency stops
- Implement time-lock on admin operations
- Add maximum stake/unstake limits
- Consider using `checked_sub` / `checked_add` for all arithmetic

---

## Testing

```bash
# Run the Anchor test suite
anchor test

# Tests cover:
# ✓ Pool initialization (verifies all GlobalState fields)
# ✓ Staking tokens (verifies vault balance, staker state, global totals)
# ✓ Unstake validation (InsufficientStake error on over-withdrawal)
# ✓ Partial unstake (balance reconciliation)
```

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
