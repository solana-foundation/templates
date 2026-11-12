import { SeekerConnectWalletName } from '@solana-mobile/seeker-connect-wallet-standard'
import { address, lamports } from '@solana/kit'

import { trackBalance } from './balance'
import { formatError } from './format-error'
import { registerMobileWalletAdapter } from './register-mwa'
import { registerSeekerConnectWallet } from './register-seeker-connect'
import { client } from './rpc'
import { elements, IDLE, render, type ActionName, type ActionState, type AppState } from './view'
import { sendMemo, signMessage } from './wallet-actions'
import { createWalletStore, type SolanaWallet, type WalletState } from './wallet-store'

import './global.css'

const ONE_SOL = lamports(1_000_000_000n)

// Wallets have to join the wallet-standard registry before anything reads from it.
registerMobileWalletAdapter()
registerSeekerConnectWallet()

const store = createWalletStore()

const state: AppState = {
  actions: { airdrop: IDLE, connect: IDLE, 'send-memo': IDLE, 'sign-message': IDLE },
  balance: { error: null, lamports: null },
  wallet: store.getState(),
}

function update(changes: Partial<AppState>): void {
  Object.assign(state, changes)
  render(state)
}

function setAction(name: ActionName, changes: Partial<ActionState>): void {
  update({ actions: { ...state.actions, [name]: { ...state.actions[name], ...changes } } })
}

function requireConnection(): NonNullable<WalletState['connected']> {
  const { connected } = state.wallet
  if (!connected) {
    throw new Error('No wallet is connected.')
  }
  return connected
}

/** Bumped whenever the connected account changes, so a result started for the previous one is dropped. */
let accountGeneration = 0

/**
 * Runs one action and reports its lifecycle into the state the render pass reads.
 *
 * This is the whole of what a mutation hook does for you: flip a flag, await, keep the result or
 * the error, render. Written out once it is a dozen lines, and every button shares it. `connect` is
 * the one action that changes the account itself, so it always reports.
 */
async function run(name: ActionName, action: () => Promise<string | null>): Promise<void> {
  const generation = accountGeneration
  const isCurrent = () => name === 'connect' || generation === accountGeneration
  setAction(name, { error: null, isRunning: true, result: null })
  try {
    const result = await action()
    if (isCurrent()) {
      setAction(name, { isRunning: false, result })
    }
  } catch (error) {
    if (isCurrent()) {
      setAction(name, { error: formatError(error), isRunning: false })
    }
  }
}

/** The stream feeding the balance, so aborting it closes the socket along with it. */
let balanceWatch: AbortController | undefined

function watchBalance(connected: WalletState['connected']): void {
  balanceWatch?.abort()
  balanceWatch = undefined

  if (!connected) {
    return
  }

  const controller = new AbortController()
  balanceWatch = controller

  trackBalance({
    abortSignal: controller.signal,
    address: address(connected.account.address),
    onBalance: (value) => update({ balance: { error: null, lamports: value } }),
  }).catch((error: unknown) => {
    // Aborting is how this loop is meant to end, so the rejection that raises is not a failure.
    if (!controller.signal.aborted) {
      update({ balance: { ...state.balance, error: formatError(error, 'Could not read the balance.') } })
    }
  })
}

store.subscribe((wallet) => {
  if (wallet.connected?.account.address === state.wallet.connected?.account.address) {
    update({ wallet })
    return
  }
  // A different account means a different balance, and a stale set of results from the old one.
  accountGeneration++
  update({
    actions: { ...state.actions, airdrop: IDLE, 'send-memo': IDLE, 'sign-message': IDLE },
    balance: { error: null, lamports: null },
    wallet,
  })
  watchBalance(wallet.connected)
})

function connectTo(wallet: SolanaWallet): Promise<void> {
  return run('connect', async () => {
    await store.connect(wallet)
    return null
  })
}

// One delegated listener for the whole wallet list, so rebuilding it attaches nothing new.
elements.walletList.addEventListener('click', (event) => {
  const name = (event.target as HTMLElement).closest<HTMLElement>('[data-wallet]')?.dataset.wallet
  const wallet = state.wallet.wallets.find((candidate) => candidate.name === name)
  if (wallet) {
    void connectTo(wallet)
  }
})

// The branded Seeker button connects the wallet that `registerSeekerConnectWallet` put in the
// registry, so it is the same `store.connect` the list above runs — Seeker Connect's own progress
// overlay and error dialog appear on top of it either way.
elements.seekerConnect.addEventListener('click', () => {
  const seeker = state.wallet.wallets.find(({ name }) => name === SeekerConnectWalletName)
  if (seeker) {
    void connectTo(seeker)
  }
})

elements.disconnect.addEventListener('click', () => {
  void store.disconnect()
})

elements.airdrop.addEventListener('click', () => {
  void run('airdrop', async () => {
    const { account } = requireConnection()
    // Resolves once the airdrop has confirmed, so the balance above has already followed along by
    // the time this returns.
    return (await client.airdrop(address(account.address), ONE_SOL)) ?? null
  })
})

elements.signMessage.addEventListener('click', () => {
  void run('sign-message', async () => {
    const signature = await signMessage(requireConnection(), elements.signMessageInput.value)
    return `Signature: ${signature}`
  })
})

elements.sendMemo.addEventListener('click', () => {
  void run('send-memo', () => sendMemo(requireConnection(), elements.sendMemoInput.value))
})

// The buttons next to a text input follow what is typed, so a keystroke is a render too.
elements.sendMemoInput.addEventListener('input', () => render(state))
elements.signMessageInput.addEventListener('input', () => render(state))

update({ wallet: store.getState() })
