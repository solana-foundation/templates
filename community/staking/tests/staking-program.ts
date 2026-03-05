import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { StakingProgram } from '../target/types/staking_program'
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { createMint, createAccount, mintTo, getAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { assert } from 'chai'

describe('staking-program', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.stakingProgram as Program<StakingProgram>
  const admin = provider.wallet as anchor.Wallet

  let mint: PublicKey
  let userTokenAccount: PublicKey
  let outsiderTokenAccount: PublicKey
  let globalStatePda: PublicKey
  let vaultPda: PublicKey
  let rewardPoolPda: PublicKey
  let vaultAuthorityPda: PublicKey
  let rewardPoolAuthorityPda: PublicKey
  let stakerPda: PublicKey
  const outsider = Keypair.generate()

  const STAKE_AMOUNT = 100_000_000 // 100 tokens (with 6 decimals)
  const SECOND_STAKE_AMOUNT = 25_000_000 // 25 tokens
  const REWARD_AMOUNT = 50_000_000 // 50 tokens
  const REWARD_RATE = 1_000_000 // 1 token per second (6 decimals)

  before(async () => {
    // Fund outsider for fees
    const airdropSig = await provider.connection.requestAirdrop(outsider.publicKey, LAMPORTS_PER_SOL)
    await provider.connection.confirmTransaction(airdropSig, 'confirmed')

    // Create mint
    mint = await createMint(provider.connection, admin.payer, admin.publicKey, null, 6)

    // Create user token account and mint tokens
    userTokenAccount = await createAccount(provider.connection, admin.payer, mint, admin.publicKey)
    outsiderTokenAccount = await createAccount(provider.connection, admin.payer, mint, outsider.publicKey)

    await mintTo(
      provider.connection,
      admin.payer,
      mint,
      userTokenAccount,
      admin.publicKey,
      1_000_000_000, // 1000 tokens
    )

    await mintTo(
      provider.connection,
      admin.payer,
      mint,
      outsiderTokenAccount,
      admin.publicKey,
      200_000_000, // 200 tokens
    )

    // Derive PDAs
    ;[globalStatePda] = PublicKey.findProgramAddressSync([Buffer.from('global_state')], program.programId)
    ;[vaultPda] = PublicKey.findProgramAddressSync([Buffer.from('staking_vault')], program.programId)
    ;[rewardPoolPda] = PublicKey.findProgramAddressSync([Buffer.from('reward_pool')], program.programId)
    ;[vaultAuthorityPda] = PublicKey.findProgramAddressSync([Buffer.from('vault_authority')], program.programId)
    ;[rewardPoolAuthorityPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('reward_pool_authority')],
      program.programId,
    )
    ;[stakerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('staker'), admin.publicKey.toBuffer()],
      program.programId,
    )
  })

  it('Initializes the staking pool', async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        admin: admin.publicKey,
        vaultAuthority: vaultAuthorityPda,
        rewardPoolAuthority: rewardPoolAuthorityPda,
        mint: mint,
        globalState: globalStatePda,
        vault: vaultPda,
        rewardPool: rewardPoolPda,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc()

    console.log('Initialize tx:', tx)

    // Verify global state
    const globalState = await program.account.globalState.fetch(globalStatePda)
    assert.equal(globalState.admin.toBase58(), admin.publicKey.toBase58())
    assert.equal(globalState.stakingTokenMint.toBase58(), mint.toBase58())
    assert.equal(globalState.totalStaked.toNumber(), 0)
    assert.equal(globalState.rewardRate.toNumber(), 0)
    assert.equal(globalState.rewardPool.toNumber(), 0)
  })

  it('Stakes tokens', async () => {
    const tx = await program.methods
      .stake(new anchor.BN(STAKE_AMOUNT))
      .accounts({
        signer: admin.publicKey,
        userTokenAccount: userTokenAccount,
        vault: vaultPda,
        vaultAuthority: vaultAuthorityPda,
        staker: stakerPda,
        globalState: globalStatePda,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc()

    console.log('Stake tx:', tx)

    // Verify staker state
    const staker = await program.account.staker.fetch(stakerPda)
    assert.equal(staker.stakedAmount.toNumber(), STAKE_AMOUNT)

    // Verify global state
    const globalState = await program.account.globalState.fetch(globalStatePda)
    assert.equal(globalState.totalStaked.toNumber(), STAKE_AMOUNT)

    // Verify vault balance
    const vaultAccount = await getAccount(provider.connection, vaultPda)
    assert.equal(Number(vaultAccount.amount), STAKE_AMOUNT)
  })

  it('Accumulates stake over multiple deposits', async () => {
    const tx = await program.methods
      .stake(new anchor.BN(SECOND_STAKE_AMOUNT))
      .accounts({
        signer: admin.publicKey,
        userTokenAccount: userTokenAccount,
        vault: vaultPda,
        vaultAuthority: vaultAuthorityPda,
        staker: stakerPda,
        globalState: globalStatePda,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc()

    console.log('Second stake tx:', tx)

    const staker = await program.account.staker.fetch(stakerPda)
    assert.equal(staker.stakedAmount.toNumber(), STAKE_AMOUNT + SECOND_STAKE_AMOUNT)
  })

  it('Rejects non-admin reward funding', async () => {
    try {
      await program.methods
        .addRewards(new anchor.BN(REWARD_AMOUNT), new anchor.BN(REWARD_RATE))
        .accounts({
          admin: outsider.publicKey,
          adminTokenAccount: outsiderTokenAccount,
          globalState: globalStatePda,
          rewardPool: rewardPoolPda,
          rewardPoolAuthority: rewardPoolAuthorityPda,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([outsider])
        .rpc()
      assert.fail('Should have thrown an error')
    } catch (err) {
      assert.include(err.toString(), 'Unauthorized')
    }
  })

  it('Funds reward pool as admin', async () => {
    const tx = await program.methods
      .addRewards(new anchor.BN(REWARD_AMOUNT), new anchor.BN(REWARD_RATE))
      .accounts({
        admin: admin.publicKey,
        adminTokenAccount: userTokenAccount,
        globalState: globalStatePda,
        rewardPool: rewardPoolPda,
        rewardPoolAuthority: rewardPoolAuthorityPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    console.log('Add rewards tx:', tx)

    const globalState = await program.account.globalState.fetch(globalStatePda)
    assert.equal(globalState.rewardPool.toNumber(), REWARD_AMOUNT)
    assert.equal(globalState.rewardRate.toNumber(), REWARD_RATE)
  })

  it('Claims rewards to the user token account', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const beforeBalance = Number((await getAccount(provider.connection, userTokenAccount)).amount)

    const tx = await program.methods
      .claim()
      .accounts({
        signer: admin.publicKey,
        staker: stakerPda,
        globalState: globalStatePda,
        userRewardTokenAccount: userTokenAccount,
        rewardPool: rewardPoolPda,
        rewardPoolAuthority: rewardPoolAuthorityPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    console.log('Claim tx:', tx)

    const afterBalance = Number((await getAccount(provider.connection, userTokenAccount)).amount)
    assert.isAbove(afterBalance, beforeBalance)

    const staker = await program.account.staker.fetch(stakerPda)
    assert.isAbove(staker.rewardDebt.toNumber(), 0)

    const globalState = await program.account.globalState.fetch(globalStatePda)
    assert.isBelow(globalState.rewardPool.toNumber(), REWARD_AMOUNT)
  })

  it('Fails to unstake more than staked amount', async () => {
    const staker = await program.account.staker.fetch(stakerPda)
    const currentStake = staker.stakedAmount.toNumber()

    try {
      await program.methods
        .unstake(new anchor.BN(currentStake + 1))
        .accounts({
          signer: admin.publicKey,
          userTokenAccount: userTokenAccount,
          vault: vaultPda,
          staker: stakerPda,
          globalState: globalStatePda,
          vaultAuthority: vaultAuthorityPda,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()
      assert.fail('Should have thrown an error')
    } catch (err) {
      assert.include(err.toString(), 'InsufficientStake')
    }
  })

  it('Unstakes tokens', async () => {
    const stakerBefore = await program.account.staker.fetch(stakerPda)
    const unstakeAmount = Math.floor(stakerBefore.stakedAmount.toNumber() / 2)

    const tx = await program.methods
      .unstake(new anchor.BN(unstakeAmount))
      .accounts({
        signer: admin.publicKey,
        userTokenAccount: userTokenAccount,
        vault: vaultPda,
        staker: stakerPda,
        globalState: globalStatePda,
        vaultAuthority: vaultAuthorityPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    console.log('Unstake tx:', tx)

    // Verify staker state
    const staker = await program.account.staker.fetch(stakerPda)
    assert.equal(staker.stakedAmount.toNumber(), stakerBefore.stakedAmount.toNumber() - unstakeAmount)

    // Verify global state
    const globalState = await program.account.globalState.fetch(globalStatePda)
    assert.equal(globalState.totalStaked.toNumber(), stakerBefore.stakedAmount.toNumber() - unstakeAmount)
  })
})
