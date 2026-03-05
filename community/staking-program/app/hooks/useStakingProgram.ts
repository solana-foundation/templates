'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import idlJson from '@/types/staking_program.json'

const PROGRAM_ID = new PublicKey('55UVMV1TKf7qMeY66xffEeTzom9BSt6oeaoVQMZkZXCp')

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export interface PoolStats {
  totalStaked: number
  rewardRate: number
  rewardPool: number
  lastRewardTime: number
  admin: string
  mint: string
  vault: string
  initialized: boolean
}

export interface UserPosition {
  stakedAmount: number
  rewardDebt: number
  address: string
  exists: boolean
}

// PDA derivation helpers
function getGlobalStatePda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('global_state')], PROGRAM_ID)[0]
}

function getVaultPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('staking_vault')], PROGRAM_ID)[0]
}

function getVaultAuthorityPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('vault_authority')], PROGRAM_ID)[0]
}

function getRewardPoolPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('reward_pool')], PROGRAM_ID)[0]
}

function getRewardPoolAuthorityPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('reward_pool_authority')], PROGRAM_ID)[0]
}

function getStakerPda(wallet: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('staker'), wallet.toBuffer()], PROGRAM_ID)[0]
}

export function useStakingProgram() {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const { publicKey, connected } = useWallet()
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null)
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null)
  const [poolLoading, setPoolLoading] = useState(true)
  const [userLoading, setUserLoading] = useState(false)

  // Refs to stabilize callback identity and prevent re-render loops
  const connectionRef = React.useRef(connection)
  const publicKeyRef = React.useRef(publicKey)
  connectionRef.current = connection
  publicKeyRef.current = publicKey

  // Create Anchor program instance
  const getProgram = useCallback(() => {
    if (!wallet) return null
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    })
    return new anchor.Program(idlJson as anchor.Idl, provider)
  }, [connection, wallet])

  // Fetch pool data
  const fetchPoolData = useCallback(async () => {
    try {
      const globalStatePda = getGlobalStatePda()
      const accountInfo = await connectionRef.current.getAccountInfo(globalStatePda)

      if (accountInfo) {
        const data = accountInfo.data.slice(8)
        const admin = new PublicKey(data.slice(0, 32))
        const mint = new PublicKey(data.slice(32, 64))
        const vault = new PublicKey(data.slice(64, 96))
        const totalStaked = new anchor.BN(data.slice(96, 104), 'le')
        const rewardRate = new anchor.BN(data.slice(104, 112), 'le')
        const lastRewardTime = new anchor.BN(data.slice(112, 120), 'le')
        const rewardPool = new anchor.BN(data.slice(120, 128), 'le')

        setPoolStats({
          totalStaked: totalStaked.toNumber() / 1e6,
          rewardRate: rewardRate.toNumber(),
          rewardPool: rewardPool.toNumber() / 1e6,
          lastRewardTime: lastRewardTime.toNumber(),
          admin: admin.toBase58(),
          mint: mint.toBase58(),
          vault: vault.toBase58(),
          initialized: true,
        })
      } else {
        setPoolStats(null)
      }
    } catch {
      setPoolStats(null)
    } finally {
      setPoolLoading(false)
    }
  }, []) // stable — uses ref

  // Fetch user position
  const fetchUserPosition = useCallback(async (showLoading = false) => {
    const pk = publicKeyRef.current
    if (!pk) {
      setUserPosition(null)
      return
    }

    if (showLoading) setUserLoading(true)
    try {
      const stakerPda = getStakerPda(pk)
      const accountInfo = await connectionRef.current.getAccountInfo(stakerPda)

      if (accountInfo) {
        const data = accountInfo.data.slice(8)
        const address = new PublicKey(data.slice(0, 32))
        const stakedAmount = new anchor.BN(data.slice(32, 40), 'le')
        const rewardDebt = new anchor.BN(data.slice(40, 48), 'le')

        setUserPosition({
          stakedAmount: stakedAmount.toNumber() / 1e6,
          rewardDebt: rewardDebt.toNumber() / 1e6,
          address: address.toBase58(),
          exists: true,
        })
      } else {
        setUserPosition({
          stakedAmount: 0,
          rewardDebt: 0,
          address: pk.toBase58(),
          exists: false,
        })
      }
    } catch {
      setUserPosition(null)
    } finally {
      setUserLoading(false)
    }
  }, []) // stable — uses ref

  // ─── Transaction Methods ───

  const stake = useCallback(
    async (amount: number): Promise<string> => {
      const program = getProgram()
      if (!program || !publicKey) throw new Error('Wallet not connected')

      const amountBN = new anchor.BN(amount * 1e6)

      // Get user's associated token account for the staking mint
      const globalState = getGlobalStatePda()
      const vault = getVaultPda()
      const vaultAuthority = getVaultAuthorityPda()
      const stakerPda = getStakerPda(publicKey)

      // We need to find the user's token account — fetch globalState to get the mint
      const gsInfo = await connection.getAccountInfo(globalState)
      if (!gsInfo) throw new Error('Pool not initialized. Admin must call initialize first.')

      const mint = new PublicKey(gsInfo.data.slice(8 + 32, 8 + 64))

      // Find user's ATA
      const { getAssociatedTokenAddressSync } = await import('@solana/spl-token')
      const userTokenAccount = getAssociatedTokenAddressSync(mint, publicKey)

      const tx = await program.methods
        .stake(amountBN)
        .accounts({
          signer: publicKey,
          userTokenAccount: userTokenAccount,
          vault: vault,
          vaultAuthority: vaultAuthority,
          staker: stakerPda,
          globalState: globalState,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc()

      // Refresh data
      await fetchPoolData()
      await fetchUserPosition()

      return tx
    },
    [getProgram, publicKey, connection, fetchPoolData, fetchUserPosition],
  )

  const unstake = useCallback(
    async (amount: number): Promise<string> => {
      const program = getProgram()
      if (!program || !publicKey) throw new Error('Wallet not connected')

      const amountBN = new anchor.BN(amount * 1e6)
      const globalState = getGlobalStatePda()
      const vault = getVaultPda()
      const vaultAuthority = getVaultAuthorityPda()
      const stakerPda = getStakerPda(publicKey)

      const gsInfo = await connection.getAccountInfo(globalState)
      if (!gsInfo) throw new Error('Pool not initialized')

      const mint = new PublicKey(gsInfo.data.slice(8 + 32, 8 + 64))
      const { getAssociatedTokenAddressSync } = await import('@solana/spl-token')
      const userTokenAccount = getAssociatedTokenAddressSync(mint, publicKey)

      const tx = await program.methods
        .unstake(amountBN)
        .accounts({
          signer: publicKey,
          userTokenAccount: userTokenAccount,
          vault: vault,
          staker: stakerPda,
          globalState: globalState,
          vaultAuthority: vaultAuthority,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()

      await fetchPoolData()
      await fetchUserPosition()

      return tx
    },
    [getProgram, publicKey, connection, fetchPoolData, fetchUserPosition],
  )

  const claim = useCallback(async (): Promise<string> => {
    const program = getProgram()
    if (!program || !publicKey) throw new Error('Wallet not connected')

    const globalState = getGlobalStatePda()
    const rewardPool = getRewardPoolPda()
    const rewardPoolAuthority = getRewardPoolAuthorityPda()
    const stakerPda = getStakerPda(publicKey)
    const gsInfo = await connection.getAccountInfo(globalState)
    if (!gsInfo) throw new Error('Pool not initialized')

    const mint = new PublicKey(gsInfo.data.slice(8 + 32, 8 + 64))
    const { getAssociatedTokenAddressSync } = await import('@solana/spl-token')
    const userRewardTokenAccount = getAssociatedTokenAddressSync(mint, publicKey)

    const tx = await program.methods
      .claim()
      .accounts({
        signer: publicKey,
        staker: stakerPda,
        globalState: globalState,
        userRewardTokenAccount: userRewardTokenAccount,
        rewardPool: rewardPool,
        rewardPoolAuthority: rewardPoolAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    await fetchPoolData()
    await fetchUserPosition()

    return tx
  }, [getProgram, publicKey, connection, fetchPoolData, fetchUserPosition])

  // Poll data
  useEffect(() => {
    fetchPoolData()
    const interval = setInterval(fetchPoolData, 8000)
    return () => clearInterval(interval)
  }, [fetchPoolData])

  useEffect(() => {
    if (connected) {
      fetchUserPosition(true) // show skeleton on first load
      const interval = setInterval(() => fetchUserPosition(false), 8000) // silent polls
      return () => clearInterval(interval)
    } else {
      setUserPosition(null)
    }
  }, [connected, fetchUserPosition])

  return {
    poolStats,
    userPosition,
    poolLoading,
    userLoading,
    refetchPool: fetchPoolData,
    refetchUser: fetchUserPosition,
    stake,
    unstake,
    claim,
    connected,
    publicKey,
    programId: PROGRAM_ID,
  }
}
