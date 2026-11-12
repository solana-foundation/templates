import { getWallets } from '@wallet-standard/app'
import type { IdentifierString, Wallet, WalletAccount } from '@wallet-standard/base'
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
  type StandardConnectFeature,
  type StandardDisconnectFeature,
  type StandardEventsFeature,
} from '@wallet-standard/features'

import { CHAIN } from './cluster'

const STORAGE_KEY = 'typescript-kit-minimal:wallet'

/**
 * How long to wait for a remembered wallet to register itself before giving up on reconnecting.
 *
 * Browser extensions announce themselves whenever they finish loading, which can be after this
 * script runs, so the registry is not complete on the first tick. Without a deadline a page opened
 * after the wallet was uninstalled would sit on "Reconnecting…" forever.
 */
const RECONNECT_TIMEOUT_MS = 1_000

/**
 * A wallet this app can connect to: one that advertises {@link CHAIN} and implements
 * `standard:connect`.
 *
 * Nothing beyond connecting is required here on purpose. A wallet that cannot sign transactions is
 * still listed, and the action that needs the missing feature is the one that says so — a wallet
 * silently absent from the list reads as a bug rather than as an answer.
 */
export type SolanaWallet = Wallet & { features: StandardConnectFeature }

export type WalletStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting'

export type WalletState = {
  /** The active connection, or `null` when nothing is connected. */
  connected: { account: WalletAccount; wallet: SolanaWallet } | null
  status: WalletStatus
  /** Every discovered wallet that can serve {@link CHAIN}, sorted by name. */
  wallets: readonly SolanaWallet[]
}

export type WalletStore = {
  connect: (wallet: SolanaWallet) => Promise<void>
  disconnect: () => Promise<void>
  getState: () => WalletState
  /** Registers a listener for every state change. Returns the function that removes it. */
  subscribe: (listener: (state: WalletState) => void) => () => void
}

/**
 * Reads one optional wallet-standard feature, typed.
 *
 * `Wallet.features` is an `IdentifierRecord<unknown>` — the standard makes no promise about what a
 * given wallet implements, so every feature is a runtime check before it is a method call. This is
 * the one place the cast that follows such a check lives.
 */
export function getWalletFeature<TFeature>(wallet: Wallet, name: IdentifierString): TFeature | undefined {
  return name in wallet.features ? (wallet.features[name] as TFeature) : undefined
}

function isSolanaWallet(wallet: Wallet): wallet is SolanaWallet {
  return wallet.chains.includes(CHAIN) && StandardConnect in wallet.features
}

function supportsChain(account: WalletAccount): boolean {
  return account.chains.includes(CHAIN)
}

function byName(a: Wallet, b: Wallet) {
  return a.name.localeCompare(b.name)
}

/** Every access is guarded because `localStorage` throws, rather than returning `null`, when a
 * browser blocks storage — in a private window or an embedded frame. A remembered wallet is never
 * worth breaking the app over. */
function loadWalletName(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveWalletName(name: string | null): void {
  try {
    if (name === null) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, name)
    }
  } catch {
    /* Storage is unavailable — the connection lives for this page load only. */
  }
}

/**
 * The whole wallet-standard integration: discovery, the connection lifecycle, and the state the
 * interface reads.
 *
 * The store is a `getState` / `subscribe` pair, which is all a UI needs to stay in step with it —
 * React's `useSyncExternalStore` wants exactly this shape, and so does the `render` call in
 * `src/main.ts`. Nothing here is framework-specific, and nothing here is React-shaped either.
 */
export function createWalletStore(): WalletStore {
  // The first call to `getWallets()` announces that this app is ready, which is what prompts wallets
  // already loaded in the page to register themselves.
  const registry = getWallets()
  const listeners = new Set<(state: WalletState) => void>()

  let state: WalletState = {
    connected: null,
    status: loadWalletName() ? 'reconnecting' : 'disconnected',
    wallets: registry.get().filter(isSolanaWallet).sort(byName),
  }

  /** Removes the `standard:events` listener for the wallet currently connected. */
  let stopWatchingWallet: (() => void) | undefined

  /**
   * Set once the remembered wallet has been found and asked to reconnect, so a `register` event
   * that arrives while that request is in flight does not start a second one.
   */
  let reconnectStarted = false

  /**
   * Bumped by every connection attempt and by the reconnect deadline, so a request that has been
   * overtaken — a silent reconnect that answers after the user picked a wallet — changes nothing.
   */
  let attempt = 0

  function setState(changes: Partial<WalletState>): void {
    state = { ...state, ...changes }
    for (const listener of listeners) {
      listener(state)
    }
  }

  function setConnected(wallet: SolanaWallet, accounts: readonly WalletAccount[]): void {
    // A multi-chain wallet can authorize accounts for other chains first; only one for CHAIN can sign here.
    const account = accounts.find(supportsChain)
    if (!account) {
      // A wallet can resolve `connect` having authorized nothing, which is a refusal in all but name.
      throw new Error(`${wallet.name} authorized no ${CHAIN} accounts.`)
    }
    saveWalletName(wallet.name)
    watchWallet(wallet)
    setState({ connected: { account, wallet }, status: 'connected' })
  }

  function clearConnection(): void {
    stopWatchingWallet?.()
    stopWatchingWallet = undefined
    saveWalletName(null)
    setState({ connected: null, status: 'disconnected' })
  }

  /**
   * Follows the connected wallet's own `change` events.
   *
   * A wallet can switch accounts, or revoke this app's authorization, entirely on its own — from
   * its extension popup, or on the phone. Without this the app would go on showing an address the
   * wallet has stopped signing for.
   */
  function watchWallet(wallet: SolanaWallet): void {
    stopWatchingWallet?.()
    const events = getWalletFeature<StandardEventsFeature[typeof StandardEvents]>(wallet, StandardEvents)
    stopWatchingWallet = events?.on('change', ({ accounts }) => {
      if (!accounts || state.connected?.wallet !== wallet) {
        return
      }
      const active = state.connected.account
      const usable = accounts.filter(supportsChain)
      const account = usable.find((candidate) => candidate.address === active.address) ?? usable[0]
      if (account) {
        setState({ connected: { account, wallet } })
      } else {
        clearConnection()
      }
    })
  }

  async function connect(wallet: SolanaWallet): Promise<void> {
    const current = ++attempt
    setState({ status: 'connecting' })
    try {
      const { accounts } = await wallet.features[StandardConnect].connect()
      if (current === attempt) {
        setConnected(wallet, accounts)
      }
    } catch (error) {
      if (current !== attempt) {
        return
      }
      // Leave any existing connection in place: a declined prompt on a second wallet should not
      // throw away a working one.
      setState({ status: state.connected ? 'connected' : 'disconnected' })
      throw error
    }
  }

  async function disconnect(): Promise<void> {
    const wallet = state.connected?.wallet
    clearConnection()
    if (!wallet) {
      return
    }
    const feature = getWalletFeature<StandardDisconnectFeature[typeof StandardDisconnect]>(wallet, StandardDisconnect)
    // `standard:disconnect` is optional and only asks the wallet to clean up; the app is already
    // disconnected as far as its own state goes, so a wallet that fails here changes nothing.
    await feature?.disconnect().catch(() => undefined)
  }

  /**
   * Reconnects to the remembered wallet without prompting, at most once.
   *
   * `silent: true` asks for the accounts this app is already authorized to use and nothing more, so
   * a returning visitor never sees a prompt they did not ask for. A wallet may ignore the flag, and
   * one that returns no accounts simply is not authorized any more.
   */
  async function reconnect(): Promise<void> {
    if (reconnectStarted || state.status !== 'reconnecting') {
      return
    }
    const name = loadWalletName()
    const wallet = state.wallets.find((candidate) => candidate.name === name)
    if (!wallet) {
      return
    }
    reconnectStarted = true
    const current = ++attempt
    try {
      const { accounts } = await wallet.features[StandardConnect].connect({ silent: true })
      if (current === attempt) {
        setConnected(wallet, accounts)
      }
    } catch {
      if (current === attempt) {
        clearConnection()
      }
    }
  }

  function refreshWallets(): void {
    setState({ wallets: registry.get().filter(isSolanaWallet).sort(byName) })
    if (state.connected && !state.wallets.includes(state.connected.wallet)) {
      // The connected wallet was unregistered — the extension was disabled, or the tab it lived in
      // went away. There is nothing left to sign with.
      clearConnection()
    }
    void reconnect()
  }

  registry.on('register', refreshWallets)
  registry.on('unregister', refreshWallets)

  void reconnect()

  // Only the status is given up on, not the remembered name: a wallet that loads slowly today is
  // still the one to reconnect to on the next page load.
  window.setTimeout(() => {
    if (state.status === 'reconnecting') {
      attempt++
      setState({ status: 'disconnected' })
    }
  }, RECONNECT_TIMEOUT_MS)

  return {
    connect,
    disconnect,
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
