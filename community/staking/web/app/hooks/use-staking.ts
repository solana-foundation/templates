'use client'

/**
 * useStaking — custom hook that fetches and caches staking program state.
 *
 * Reads the on-chain StakeConfig, UserAccount, and active StakeAccounts
 * for the connected wallet using the Codama-generated client functions
 * and the RPC provided by @solana/react-hooks.
 *
 * All data is fetched via `fetchMaybe*` so missing accounts (user hasn't
 * staked yet) return null instead of throwing.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSolanaClient, useWalletSession } from '@solana/react-hooks'
import { type Address, getProgramDerivedAddress, getAddressEncoder, getBytesEncoder, getU64Encoder } from '@solana/kit'

import {
  STAKING_TEMPLATE_PROGRAM_ADDRESS,
  fetchMaybeStakeConfig,
  fetchMaybeUserAccount,
  fetchMaybeStakeAccount,
  type StakeConfig,
  type UserAccount,
  type StakeAccount,
} from '@/client/vault/index'

// ── Types ───────────────────────────────────────────

export type PoolInfo = StakeConfig

export type UserInfo = UserAccount

export type StakeEntry = StakeAccount & { id: bigint; pda: Address }

export type StakingState = {
  /** Global pool config — null if not initialized */
  pool: PoolInfo | null
  /** Connected user's aggregate account — null if never staked */
  user: UserInfo | null
  /** All active stake entries for the connected user */
  stakes: StakeEntry[]
  /** Derived PDA addresses */
  pdas: {
    config: Address
    vault: Address
    tokenMint: Address
  } | null
  loading: boolean
  /** Call to re-fetch everything */
  refresh: () => Promise<void>
}

// ── PDA helpers ─────────────────────────────────────

const addressEncoder = getAddressEncoder()
const bytesEncoder = getBytesEncoder()
const u64Encoder = getU64Encoder()

async function deriveConfigPDA() {
  return getProgramDerivedAddress({
    programAddress: STAKING_TEMPLATE_PROGRAM_ADDRESS,
    seeds: [bytesEncoder.encode(new TextEncoder().encode('config'))],
  })
}

async function deriveVaultPDA() {
  return getProgramDerivedAddress({
    programAddress: STAKING_TEMPLATE_PROGRAM_ADDRESS,
    seeds: [bytesEncoder.encode(new TextEncoder().encode('vault'))],
  })
}

async function deriveTokenMintPDA() {
  return getProgramDerivedAddress({
    programAddress: STAKING_TEMPLATE_PROGRAM_ADDRESS,
    seeds: [bytesEncoder.encode(new TextEncoder().encode('token_mint'))],
  })
}

async function deriveUserAccountPDA(wallet: Address) {
  return getProgramDerivedAddress({
    programAddress: STAKING_TEMPLATE_PROGRAM_ADDRESS,
    seeds: [bytesEncoder.encode(new TextEncoder().encode('user')), addressEncoder.encode(wallet)],
  })
}

async function deriveStakeAccountPDA(wallet: Address, id: bigint) {
  return getProgramDerivedAddress({
    programAddress: STAKING_TEMPLATE_PROGRAM_ADDRESS,
    seeds: [
      bytesEncoder.encode(new TextEncoder().encode('stake')),
      addressEncoder.encode(wallet),
      u64Encoder.encode(id),
    ],
  })
}

// ── Hook ────────────────────────────────────────────

/** Maximum stake IDs we'll scan for active entries */
const MAX_SCAN_IDS = 20

export function useStaking(): StakingState {
  const client = useSolanaClient()
  const session = useWalletSession()

  const [pool, setPool] = useState<PoolInfo | null>(null)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [stakes, setStakes] = useState<StakeEntry[]>([])
  const [pdas, setPDAs] = useState<StakingState['pdas']>(null)
  const [loading, setLoading] = useState(true)
  const initialLoadDone = useRef(false)

  const refresh = useCallback(async () => {
    if (!client) return
    const rpc = client.runtime.rpc
    // Only show the loading spinner on the very first fetch.
    // Subsequent refreshes update state in-place without blanking the UI.
    if (!initialLoadDone.current) setLoading(true)

    try {
      // 1. Derive global PDAs (cheap, no RPC)
      const [configAddr] = await deriveConfigPDA()
      const [vaultAddr] = await deriveVaultPDA()
      const [tokenMintAddr] = await deriveTokenMintPDA()

      setPDAs({ config: configAddr, vault: vaultAddr, tokenMint: tokenMintAddr })

      // 2. Fetch pool config
      const maybeConfig = await fetchMaybeStakeConfig(rpc, configAddr)
      setPool(maybeConfig.exists ? maybeConfig.data : null)

      // 3. If wallet connected, fetch user account and scan for stakes
      const walletAddress = session?.account?.address
      if (walletAddress) {
        const [userAccountAddr] = await deriveUserAccountPDA(walletAddress as Address)
        const maybeUser = await fetchMaybeUserAccount(rpc, userAccountAddr)
        setUser(maybeUser.exists ? maybeUser.data : null)

        // Derive all stake PDAs then fetch in parallel
        const stakePromises = Array.from({ length: MAX_SCAN_IDS }, async (_, i) => {
          const id = BigInt(i + 1)
          const [stakePDA] = await deriveStakeAccountPDA(walletAddress as Address, id)
          const maybeStake = await fetchMaybeStakeAccount(rpc, stakePDA)
          return maybeStake.exists ? ({ ...maybeStake.data, id, pda: stakePDA } as StakeEntry) : null
        })

        const results = await Promise.all(stakePromises)
        setStakes(results.filter((s): s is StakeEntry => s !== null))
      } else {
        setUser(null)
        setStakes([])
      }
    } catch (err) {
      console.error('Failed to fetch staking state:', err)
    } finally {
      setLoading(false)
      initialLoadDone.current = true
    }
  }, [client, session?.account?.address])

  // Auto-fetch on mount and when wallet changes
  useEffect(() => {
    refresh()
  }, [refresh])

  return { pool, user, stakes, pdas, loading, refresh }
}
