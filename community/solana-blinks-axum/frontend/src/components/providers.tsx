'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useWallets, getWalletFeature } from '@wallet-standard/react'
import type { UiWallet } from '@wallet-standard/react'
import type { WalletAccount } from '@wallet-standard/base'
import { SOLANA_CHAIN } from '@/lib/constants'

// Feature name constants (must satisfy `${string}:${string}`)
const CONNECT = 'standard:connect' as const
const DISCONNECT = 'standard:disconnect' as const
const EVENTS = 'standard:events' as const

// Minimal feature shapes for type-safe casts
type ConnectFn = {
  connect(input?: { silent?: boolean }): Promise<{ accounts: readonly WalletAccount[] }>
}
type DisconnectFn = { disconnect(): Promise<void> }
type EventsFn = {
  on(event: 'change', cb: (props: { accounts?: readonly WalletAccount[] }) => void): () => void
}

// ---- Context value ----
interface WalletContextValue {
  wallets: readonly UiWallet[]
  wallet: UiWallet | null
  account: WalletAccount | null
  connected: boolean
  connect: (wallet: UiWallet) => Promise<void>
  disconnect: () => Promise<void>
}

const WalletCtx = createContext<WalletContextValue>({
  wallets: [],
  wallet: null,
  account: null,
  connected: false,
  connect: async () => {},
  disconnect: async () => {},
})

export const useWallet = () => useContext(WalletCtx)

// Re-export types other components need
export type { UiWallet, WalletAccount }

function WalletContextProvider({ children }: { children: ReactNode }) {
  const allWallets = useWallets()
  const [wallet, setWallet] = useState<UiWallet | null>(null)
  const [account, setAccount] = useState<WalletAccount | null>(null)

  // Only show wallets supporting our Solana chain
  const wallets = useMemo(() => allWallets.filter((w) => w.chains.some((c) => c === SOLANA_CHAIN)), [allWallets])

  const connect = useCallback(async (w: UiWallet) => {
    const feat = getWalletFeature(w, CONNECT) as ConnectFn
    const { accounts } = await feat.connect()
    if (accounts.length === 0) throw new Error('No accounts returned')
    setWallet(w)
    setAccount(accounts[0])
    try {
      localStorage.setItem('wallet-name', w.name)
    } catch {}
  }, [])

  const disconnect = useCallback(async () => {
    if (wallet && wallet.features.includes(DISCONNECT)) {
      try {
        const feat = getWalletFeature(wallet, DISCONNECT) as DisconnectFn
        await feat.disconnect()
      } catch {}
    }
    setWallet(null)
    setAccount(null)
    try {
      localStorage.removeItem('wallet-name')
    } catch {}
  }, [wallet])

  // Auto-connect to last-used wallet
  useEffect(() => {
    if (wallet || wallets.length === 0) return
    let savedName: string | null = null
    try {
      savedName = localStorage.getItem('wallet-name')
    } catch {}
    if (!savedName) return
    const w = wallets.find((w) => w.name === savedName)
    if (!w || !w.features.includes(CONNECT)) return
    const feat = getWalletFeature(w, CONNECT) as ConnectFn
    feat
      .connect({ silent: true })
      .then(({ accounts }) => {
        if (accounts.length > 0) {
          setWallet(w)
          setAccount(accounts[0])
        }
      })
      .catch(() => {})
  }, [wallets, wallet])

  // Listen for account changes on the connected wallet
  useEffect(() => {
    if (!wallet || !wallet.features.includes(EVENTS)) return
    const feat = getWalletFeature(wallet, EVENTS) as EventsFn
    return feat.on('change', ({ accounts }) => {
      if (!accounts) return
      if (accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        setAccount(null)
        setWallet(null)
        try {
          localStorage.removeItem('wallet-name')
        } catch {}
      }
    })
  }, [wallet])

  return (
    <WalletCtx.Provider value={{ wallets, wallet, account, connected: account !== null, connect, disconnect }}>
      {children}
    </WalletCtx.Provider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>
}
