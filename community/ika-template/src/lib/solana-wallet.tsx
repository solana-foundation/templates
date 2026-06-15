import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getWallets } from '@wallet-standard/app'
import type { Wallet, WalletAccount } from '@wallet-standard/base'
import {
  SolanaSignAndSendTransaction,
  type SolanaSignAndSendTransactionFeature,
} from '@solana/wallet-standard-features'

/**
 * A tiny Wallet-Standard connector for the user's Solana wallet (Phantom and
 * friends). This is the human's own wallet. It receives funds from the
 * dWallet and is the on-screen Solana identity. It does NOT control the
 * dWallet (the MPC network + the local user share do).
 *
 * We keep this deliberately small: discover Solana wallets, connect, expose the
 * address. We don't need the wallet to sign anything for the core demo (the
 * dWallet does the signing), so a full wallet-adapter stack would be overkill.
 */

const SOLANA_DEVNET_CHAIN = 'solana:devnet'

function isSolanaWallet(wallet: Wallet): boolean {
  return wallet.chains.some((chain) => chain.startsWith('solana:')) && SolanaSignAndSendTransaction in wallet.features
}

interface SolanaWalletContextValue {
  wallets: Wallet[]
  wallet: Wallet | null
  account: WalletAccount | null
  address: string | null
  connecting: boolean
  connect: (walletName: string) => Promise<void>
  disconnect: () => void
}

const SolanaWalletContext = createContext<SolanaWalletContextValue | null>(null)

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [connecting, setConnecting] = useState(false)

  // Discover installed wallets and keep the list fresh as they register.
  useEffect(() => {
    const { get, on } = getWallets()
    const refresh = () => setWallets(get().filter(isSolanaWallet))
    refresh()
    const offRegister = on('register', refresh)
    const offUnregister = on('unregister', refresh)
    return () => {
      offRegister()
      offUnregister()
    }
  }, [])

  const connect = useCallback(
    async (walletName: string) => {
      const target = wallets.find((w) => w.name === walletName)
      if (!target) throw new Error(`Wallet "${walletName}" not found`)

      setConnecting(true)
      try {
        const connectFeature = target.features['standard:connect'] as
          | { connect: () => Promise<{ accounts: readonly WalletAccount[] }> }
          | undefined
        if (!connectFeature) throw new Error(`${walletName} does not support standard:connect`)

        const { accounts } = await connectFeature.connect()
        const solAccount = accounts.find((a) => a.chains.includes(SOLANA_DEVNET_CHAIN)) ?? accounts[0] ?? null

        setWallet(target)
        setAccount(solAccount)
      } finally {
        setConnecting(false)
      }
    },
    [wallets],
  )

  const disconnect = useCallback(() => {
    const disconnectFeature = wallet?.features['standard:disconnect'] as { disconnect: () => Promise<void> } | undefined
    void disconnectFeature?.disconnect?.()
    setWallet(null)
    setAccount(null)
  }, [wallet])

  const value = useMemo<SolanaWalletContextValue>(
    () => ({
      wallets,
      wallet,
      account,
      address: account?.address ?? null,
      connecting,
      connect,
      disconnect,
    }),
    [wallets, wallet, account, connecting, connect, disconnect],
  )

  return <SolanaWalletContext.Provider value={value}>{children}</SolanaWalletContext.Provider>
}

export function useSolanaWallet(): SolanaWalletContextValue {
  const ctx = useContext(SolanaWalletContext)
  if (!ctx) throw new Error('useSolanaWallet must be used within <SolanaWalletProvider>')
  return ctx
}

// Re-export so callers don't need a second import for the feature flag.
export type { SolanaSignAndSendTransactionFeature }
