'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import idlJson from '@/types/staking_program.json'
import { STAKING_PROGRAM_ID } from '@/lib/staking-config'

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
const GLOBAL_STATE_DISCRIMINATOR = Buffer.from([163, 46, 74, 168, 216, 123, 133, 98])

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

interface ParsedGlobalState {
  admin: PublicKey
  mint: PublicKey
  vault: PublicKey
  totalStaked: anchor.BN
  rewardRate: anchor.BN
  lastRewardTime: anchor.BN
  rewardPool: anchor.BN
}

function parseGlobalState(accountData: Buffer): ParsedGlobalState | null {
  if (accountData.length < 136) return null
  if (!accountData.subarray(0, 8).equals(GLOBAL_STATE_DISCRIMINATOR)) return null

  const data = accountData.subarray(8)
  return {
    admin: new PublicKey(data.subarray(0, 32)),
    mint: new PublicKey(data.subarray(32, 64)),
    vault: new PublicKey(data.subarray(64, 96)),
    totalStaked: new anchor.BN(data.subarray(96, 104), 'le'),
    rewardRate: new anchor.BN(data.subarray(104, 112), 'le'),
    lastRewardTime: new anchor.BN(data.subarray(112, 120), 'le'),
    rewardPool: new anchor.BN(data.subarray(120, 128), 'le'),
  }
}

// PDA derivation helpers
function getGlobalStatePda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('global_state')], STAKING_PROGRAM_ID)[0]
}

function getVaultPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('staking_vault')], STAKING_PROGRAM_ID)[0]
}

function getVaultAuthorityPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('vault_authority')], STAKING_PROGRAM_ID)[0]
}

function getRewardPoolPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('reward_pool')], STAKING_PROGRAM_ID)[0]
}

function getRewardPoolAuthorityPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('reward_pool_authority')], STAKING_PROGRAM_ID)[0]
}

function getStakerPda(wallet: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from('staker'), wallet.toBuffer()], STAKING_PROGRAM_ID)[0]
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
    return new anchor.Program({ ...idlJson, address: STAKING_PROGRAM_ID.toBase58() } as anchor.Idl, provider)
  }, [connection, wallet])

  // Fetch pool data
  const fetchPoolData = useCallback(async () => {
    try {
      const globalStatePda = getGlobalStatePda()
      const accountInfo = await connectionRef.current.getAccountInfo(globalStatePda)

      if (accountInfo) {
        const parsed = parseGlobalState(accountInfo.data)
        if (!parsed) {
          setPoolStats(null)
          return
        }

        setPoolStats({
          totalStaked: parsed.totalStaked.toNumber() / 1e6,
          rewardRate: parsed.rewardRate.toNumber(),
          rewardPool: parsed.rewardPool.toNumber() / 1e6,
          lastRewardTime: parsed.lastRewardTime.toNumber(),
          admin: parsed.admin.toBase58(),
          mint: parsed.mint.toBase58(),
          vault: parsed.vault.toBase58(),
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
      const parsed = parseGlobalState(gsInfo.data)
      if (!parsed) {
        throw new Error(
          'Invalid pool state at the staking PDA. Initialize the pool for this program ID before staking.',
        )
      }

      // Find user's ATA
      const { getAssociatedTokenAddressSync } = await import('@solana/spl-token')
      const userTokenAccount = getAssociatedTokenAddressSync(parsed.mint, publicKey)

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
      const parsed = parseGlobalState(gsInfo.data)
      if (!parsed) {
        throw new Error(
          'Invalid pool state at the staking PDA. Initialize the pool for this program ID before unstaking.',
        )
      }
      const { getAssociatedTokenAddressSync } = await import('@solana/spl-token')
      const userTokenAccount = getAssociatedTokenAddressSync(parsed.mint, publicKey)

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
    const parsed = parseGlobalState(gsInfo.data)
    if (!parsed) {
      throw new Error('Invalid pool state at the staking PDA. Initialize the pool for this program ID before claiming.')
    }
    const { getAssociatedTokenAddressSync } = await import('@solana/spl-token')
    const userRewardTokenAccount = getAssociatedTokenAddressSync(parsed.mint, publicKey)

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
    programId: STAKING_PROGRAM_ID,
  }
}
