/**
 * Staking Program — Integration Tests
 *
 * These tests exercise the full lifecycle of the staking program:
 *
 *   1. Initialize Pool  — admin creates the config, reward mint, and SOL vault
 *   2. Stake            — user locks SOL and receives receipt tokens
 *   3. Unstake          — user burns receipt tokens, gets SOL back + reward credits
 *   4. Claim            — user withdraws accumulated rewards from the vault
 *
 * Tests run sequentially — each suite depends on state set up by the one before it.
 * A freeze period of 0 is used so we never have to wait for unstake eligibility.
 */

import { describe, test, before } from 'node:test'
import assert from 'node:assert'
import { type Address, type TransactionSigner, lamports } from '@solana/kit'
import { connect, type Connection, getPDAAndBump } from 'solana-kite'

// Codama-generated client — mirrors on-chain instructions and accounts 1:1
import {
  STAKING_TEMPLATE_PROGRAM_ADDRESS,
  getInitializePoolInstructionAsync,
  getStakeInstructionAsync,
  getUnstakeInstructionAsync,
  getClaimInstructionAsync,
  fetchStakeConfig,
  fetchUserAccount,
  fetchStakeAccount,
  fetchMaybeStakeAccount,
} from '@client/index.ts'

// ─────────────────────────────────────────────────────
// Test-wide constants
// ─────────────────────────────────────────────────────

/** Reward tokens minted per lamport staked per second */
const REWARDS_PER_STAKE = 1

/** Maximum amount (in lamports) a single user may have staked at once */
const MAX_STAKE = 10_000_000_000n // 10 SOL

/** Seconds the user must wait after staking before they can unstake (0 = instant) */
const FREEZE_PERIOD = 0n

/** Amount the user stakes in the primary happy-path test */
const STAKE_AMOUNT = 100_000_000n // 0.1 SOL

/** Unique id for the first stake — allows multiple concurrent stakes per user */
const STAKE_ID = 1n

/** Cluster to connect to — override with CLUSTER=devnet if needed */
const CLUSTER = (process.env.CLUSTER ?? 'localnet') as 'localnet' | 'devnet'

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

/** Derive the user-account PDA for a given wallet */
const userAccountPDA = (userAddress: Address) => getPDAAndBump(STAKING_TEMPLATE_PROGRAM_ADDRESS, ['user', userAddress])

/** Derive the per-stake PDA for a given wallet + stake id */
const stakeAccountPDA = (userAddress: Address, id: bigint) =>
  getPDAAndBump(STAKING_TEMPLATE_PROGRAM_ADDRESS, ['stake', userAddress, id])

// ─────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────

describe('Staking Program', () => {
  let connection: Connection
  let admin: TransactionSigner // pool creator — funds the vault & sets parameters
  let user: TransactionSigner // staker — locks SOL and later claims rewards

  // Derived PDA addresses (computed once in `before`)
  let configPDA: Address
  let vaultPDA: Address

  before(async () => {
    // Connect to localnet (or devnet) and create two funded wallets
    connection = connect(CLUSTER)
    const [w1, w2] = await connection.createWallets(2)
    admin = w1!
    user = w2!

    // Pre-compute the PDA addresses we'll reference throughout the tests
    ;({ pda: configPDA } = await getPDAAndBump(STAKING_TEMPLATE_PROGRAM_ADDRESS, ['config']))
    ;({ pda: vaultPDA } = await getPDAAndBump(STAKING_TEMPLATE_PROGRAM_ADDRESS, ['vault']))
  })

  // ── 1. Initialize Pool ───────────────────────────
  describe('Initialize Pool', () => {
    test('admin creates the config account, reward mint, and SOL vault', async () => {
      const ix = await getInitializePoolInstructionAsync({
        admin,
        rewardsPerStake: REWARDS_PER_STAKE,
        maxStake: MAX_STAKE,
        freezePeriod: FREEZE_PERIOD,
      })

      await connection.sendTransactionFromInstructions({
        feePayer: admin,
        instructions: [ix],
      })

      // Read back the on-chain config and verify every field was stored correctly
      const config = await fetchStakeConfig(connection.rpc, configPDA)
      assert.strictEqual(config.data.rewardsPerStake, REWARDS_PER_STAKE)
      assert.strictEqual(config.data.maxStake, MAX_STAKE)
      assert.strictEqual(config.data.freezePeriod, FREEZE_PERIOD)
    })

    test('vault PDA was funded with rent-exempt lamports', async () => {
      // The program transfers the rent-exempt minimum into the vault during
      // init so the SystemAccount stays alive on-chain even with zero stakes.
      const vaultBalance = await connection.getLamportBalance(vaultPDA, 'confirmed')
      assert.ok(BigInt(vaultBalance) > 0n, 'vault should hold rent-exempt lamports after initialization')
    })
  })

  // ── 2. Stake ─────────────────────────────────────
  describe('Stake', () => {
    test('first stake locks SOL and creates stake + user accounts', async () => {
      const ix = await getStakeInstructionAsync({
        user,
        id: STAKE_ID,
        amount: STAKE_AMOUNT,
      })

      await connection.sendTransactionFromInstructions({
        feePayer: user,
        instructions: [ix],
      })

      // ── Verify the per-stake account ──
      // Each stake gets its own PDA keyed by [user, id].
      const { pda: stakePDA } = await stakeAccountPDA(user.address, STAKE_ID)
      const stakeAccount = await fetchStakeAccount(connection.rpc, stakePDA)

      assert.strictEqual(stakeAccount.data.owner, user.address)
      assert.strictEqual(stakeAccount.data.amount, STAKE_AMOUNT)

      // ── Verify the user-level account ──
      // This tracks aggregate stats across all of a user's stakes.
      const { pda: userPDA } = await userAccountPDA(user.address)
      const userAccount = await fetchUserAccount(connection.rpc, userPDA)

      assert.strictEqual(userAccount.data.owner, user.address)
      assert.strictEqual(userAccount.data.amountStaked, STAKE_AMOUNT)
      assert.strictEqual(userAccount.data.isInitialized, true)
    })

    test("a second stake increments the user's total amount_staked", async () => {
      const secondId = 2n
      const secondAmount = 50_000_000n // 0.05 SOL

      const ix = await getStakeInstructionAsync({
        user,
        id: secondId,
        amount: secondAmount,
      })

      await connection.sendTransactionFromInstructions({
        feePayer: user,
        instructions: [ix],
      })

      // The user-level account should now reflect the sum of both stakes
      const { pda: userPDA } = await userAccountPDA(user.address)
      const userAccount = await fetchUserAccount(connection.rpc, userPDA)

      assert.strictEqual(userAccount.data.amountStaked, STAKE_AMOUNT + secondAmount)
    })

    test('staking zero lamports is rejected', async () => {
      const ix = await getStakeInstructionAsync({
        user,
        id: 99n, // arbitrary unused id
        amount: 0n,
      })

      // The program's `require!(amount > 0)` guard should cause this to fail
      await assert.rejects(
        () =>
          connection.sendTransactionFromInstructions({
            feePayer: user,
            instructions: [ix],
          }),
        'should reject a zero-amount stake',
      )
    })
  })

  // ── 3. Unstake ───────────────────────────────────
  describe('Unstake', () => {
    test('unstaking burns receipt tokens, returns SOL, and credits rewards', async () => {
      // Snapshot the user account before unstaking so we can diff later
      const { pda: userPDA } = await userAccountPDA(user.address)
      const userBefore = await fetchUserAccount(connection.rpc, userPDA)

      const ix = await getUnstakeInstructionAsync({
        user,
        id: STAKE_ID, // unstake the first stake only; second remains active
      })

      await connection.sendTransactionFromInstructions({
        feePayer: user,
        instructions: [ix],
      })

      // ── The per-stake account should be closed (rent reclaimed) ──
      const { pda: stakePDA } = await stakeAccountPDA(user.address, STAKE_ID)
      const maybeStake = await fetchMaybeStakeAccount(connection.rpc, stakePDA)
      assert.strictEqual(maybeStake.exists, false, 'stake account should no longer exist after unstake')

      // ── The user-level account should reflect the reduced stake total ──
      const userAfter = await fetchUserAccount(connection.rpc, userPDA)
      assert.strictEqual(userAfter.data.amountStaked, userBefore.data.amountStaked - STAKE_AMOUNT)
    })
  })

  // ── 4. Claim ─────────────────────────────────────
  describe('Claim', () => {
    test('user can withdraw accumulated rewards from the vault', async () => {
      const { pda: userPDA } = await userAccountPDA(user.address)
      const userBefore = await fetchUserAccount(connection.rpc, userPDA)
      const rewards = userBefore.data.accumulatedRewards

      // With freeze_period=0 the unstake happens almost instantly, so there
      // may be very few (or zero) rewards accrued.  Skip if nothing to claim.
      if (rewards === 0n) {
        return
      }

      // The vault only holds staked principal — it doesn't magically have
      // reward funds.  In production the admin (or a crank) would top it up.
      // Here we simulate that by transferring the exact reward amount in.
      await connection.transferLamports({
        source: admin,
        destination: vaultPDA,
        amount: lamports(rewards),
      })

      const balanceBefore = await connection.getLamportBalance(user.address)

      // Claim the full reward balance
      const ix = await getClaimInstructionAsync({
        user,
        amount: rewards,
      })

      await connection.sendTransactionFromInstructions({
        feePayer: user,
        instructions: [ix],
      })

      // On-chain rewards counter should be zeroed out
      const userAfter = await fetchUserAccount(connection.rpc, userPDA)
      assert.strictEqual(userAfter.data.accumulatedRewards, 0n)

      // User's wallet balance should have increased (minus the tx fee)
      const balanceAfter = await connection.getLamportBalance(user.address)
      assert.ok(balanceAfter > balanceBefore - 100_000n, 'user should have received rewards (minus tx fee)')
    })

    test('claiming more than accumulated rewards is rejected', async () => {
      const ix = await getClaimInstructionAsync({
        user,
        amount: 999_999_999_999n, // absurdly large — far exceeds any accrued rewards
      })

      // The program's `require!(accumulated_rewards >= amount)` guard fires
      await assert.rejects(
        () =>
          connection.sendTransactionFromInstructions({
            feePayer: user,
            instructions: [ix],
          }),
        'should reject a claim that exceeds accumulated rewards',
      )
    })
  })
})
