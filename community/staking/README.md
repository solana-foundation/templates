# SOL Staking Program

An Anchor-based Solana program that lets users stake SOL, receive SPL receipt tokens, and earn time-based rewards. Includes a **Next.js + Tailwind** frontend with wallet integration via [`@solana/react-hooks`](https://github.com/anza-xyz/solana-web3.js).

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                    Program (lib.rs)                     │
│  initialize_pool · stake · unstake · claim             │
└────────┬──────────┬──────────┬──────────┬──────────────┘
         │          │          │          │
         ▼          ▼          ▼          ▼
   ┌──────────┐ ┌───────┐ ┌────────┐ ┌───────┐
   │ InitPool │ │ Stake │ │Unstake │ │ Claim │  ← instructions/
   └────┬─────┘ └───┬───┘ └───┬────┘ └───┬───┘
        │           │         │           │
        ▼           ▼         ▼           ▼
   ┌─────────────────────────────────────────┐
   │              State (PDAs)               │  ← state/
   │  StakeConfig · UserAccount · StakeAcct  │
   └─────────────────────────────────────────┘
```

### PDAs & Seeds

| Account        | Seeds                          | Purpose                              |
| -------------- | ------------------------------ | ------------------------------------ |
| `StakeConfig`  | `"config"`                     | Global pool params (one per prog)    |
| `Vault`        | `"vault"`                      | SOL escrow (SystemAccount PDA)       |
| `TokenMint`    | `"token_mint"`                 | SPL receipt/reward mint              |
| `UserAccount`  | `"user"` + wallet pubkey       | Per-user lifetime totals             |
| `StakeAccount` | `"stake"` + wallet pubkey + id | Per-stake record (closed on unstake) |

### Flow

1. **initialize_pool** - Admin creates the config, mint, and funds the vault with rent-exempt SOL.
2. **stake(amount, id)** - User sends SOL to vault, gets receipt tokens minted 1:1. A `StakeAccount` is created per stake.
3. **unstake(id)** - After the freeze period, burns receipt tokens, returns SOL, calculates `rewards = amount × rewards_per_stake × elapsed_seconds`, and credits `UserAccount.accumulated_rewards`. Closes the `StakeAccount`.
4. **claim(amount)** - Transfers earned rewards from vault to user.

## Quick Start

```bash
# Install dependencies
npm install

# Build the program and generate the TypeScript client
anchor build
npm gen-client

# Run the full test suite
anchor test

# Start the frontend
cd web && npm dev
```

## Testing

Tests live in `tests/staking.ts` and exercise the complete program lifecycle:

| #   | Suite           | What it covers                                                  |
| --- | --------------- | --------------------------------------------------------------- |
| 1   | Initialize Pool | Admin creates config, reward mint, and rent-funded SOL vault    |
| 2   | Stake           | First stake, repeat stake, and zero-amount rejection            |
| 3   | Unstake         | Burns receipt tokens, returns SOL, credits rewards, closes PDA  |
| 4   | Claim           | Admin seeds the vault with reward funds, user withdraws rewards |

Tests are **sequential** - each suite depends on state created by the one before it.

**Stack:** [`node:test`](https://nodejs.org/api/test.html) · [`solana-kite`](https://github.com/nicklascook/solana-kite) · [`@solana/kit`](https://github.com/anza-xyz/solana-web3.js) · [Codama](https://github.com/codama-idl/codama)-generated client · [tsx](https://github.com/privatenumber/tsx)

```bash
# Run tests directly (without anchor build)
npm test
```

## Project Layout

```
programs/staking/src/
├── lib.rs                  # entrypoint - thin ix wrappers
├── errors.rs               # custom error codes
├── instructions/
│   ├── initialize_pool.rs  # pool setup (admin-only)
│   ├── stake.rs            # lock SOL + mint receipt tokens
│   ├── unstake.rs          # unlock SOL + burn + accrue rewards
│   └── claim.rs            # withdraw earned rewards
└── state/
    ├── stake_config.rs     # global config PDA
    ├── user_account.rs     # per-user aggregate state
    └── stake_account.rs    # per-stake lock record

tests/
└── staking.ts              # integration tests (node:test + solana-kite)

web/                        # Next.js + Tailwind frontend
├── app/
│   ├── components/         # UI components (stake form, dashboard, etc.)
│   ├── hooks/              # useStaking() hook - fetches on-chain state
│   └── lib/                # formatting helpers
└── client/vault/           # Codama-generated TypeScript client
```

## Security

### Arithmetic Safety

- All reward calculations in `unstake` use `checked_mul` to prevent silent overflow. If the product exceeds `u64::MAX`, the instruction returns a `RewardOverflow` error instead of wrapping.
- A zero-amount guard (`ZeroStakeAmount`) prevents users from creating empty stake accounts that would accumulate time-based rewards for free.

### Authority & Ownership

- **Mint authority** - The reward mint's authority is the `config` PDA. The `mint()` helper signs with the config PDA seeds so only the program can issue receipt tokens; no user can mint on their own.
- **Vault PDA signer** - Both `unstake` and `claim` sign vault transfers with `CpiContext::new_with_signer` using the vault PDA seeds. Without this, the vault (a PDA) can't authorize outgoing SOL transfers.
- **Owner constraints** - `unstake` enforces `stake_account.owner == user.key()` and `user_account.owner == user.key()` as explicit constraints, on top of PDA seed derivation.
- **Claim owner check** - `claim()` verifies `user_account.owner == user.key()` before releasing any funds.

### State Integrity

- **Accurate stake tracking** - `user_account.amount_staked` is incremented on every `stake()` call (not just the first), so the `max_stake` cap stays enforced across multiple concurrent stakes.
- **Instruction args match PDA seeds** - `stake` and `unstake` both accept an `id` parameter that flows through `#[instruction(id: u64)]` into the `StakeAccount` PDA seeds, ensuring each stake is uniquely addressable.
- **Stake account closed on unstake** - The `close = user` constraint zeroes the account and returns rent, preventing double-unstake.
- **Single-init pool** - The `init` constraint on the config PDA means `initialize_pool` can only succeed once per program deployment.

### Freeze Period

- `unstake` computes `clock.unix_timestamp - staked_at` and rejects if less than `freeze_period`, preventing early withdrawal.

## **Relevant documentation:**

- [Anchor Framework](https://www.anchor-lang.com/docs) - Program development framework
- [@solana/kit](https://www.solanakit.com/docs) - TypeScript client library
- [solana-kite](https://solanakite.org/docs) - Typescript client helper library
- [Codama](https://github.com/codama-idl/codama) - IDL → TypeScript client generation
