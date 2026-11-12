import type { SeekerConnectButton } from '@solana-mobile/seeker-connect-ui'
import { SeekerConnectWalletName } from '@solana-mobile/seeker-connect-wallet-standard'
import type { Lamports } from '@solana/kit'

import { CLUSTER_LABEL, getExplorerUrl, getFaucetUrl } from './cluster'
import { formatAddress } from './format-address'
import { formatSol } from './format-sol'
import type { SolanaWallet, WalletState } from './wallet-store'

/** Every action the interface can run. The names double as element id prefixes in `index.html`. */
export type ActionName = 'airdrop' | 'connect' | 'send-memo' | 'sign-message'

export type ActionState = {
  error: string | null
  isRunning: boolean
  /** What the action produced — a signature, usually. `null` before it has run. */
  result: string | null
}

export type AppState = {
  actions: Record<ActionName, ActionState>
  balance: { error: string | null; lamports: Lamports | null }
  wallet: WalletState
}

export const IDLE: ActionState = { error: null, isRunning: false, result: null }

function element<TElement extends HTMLElement>(id: string): TElement {
  const found = document.getElementById(id)
  if (!found) {
    throw new Error(`index.html is missing #${id}`)
  }
  return found as TElement
}

/**
 * Every element the app writes to, looked up once.
 *
 * `index.html` owns the markup, so this is the entire binding layer between it and the app. Doing
 * the lookups here rather than inside `render` matters: `getElementById` in a function that runs on
 * every state change is the one way a framework-free UI gets slow.
 */
export const elements = {
  accountAddress: element<HTMLAnchorElement>('account-address'),
  accountBalance: element('account-balance'),
  accountCard: element('account-card'),
  airdrop: element<HTMLButtonElement>('airdrop'),
  airdropError: element('airdrop-error'),
  airdropResult: element('airdrop-result'),
  airdropSignature: element<HTMLAnchorElement>('airdrop-signature'),
  balanceError: element('balance-error'),
  clusterLabel: element('cluster-label'),
  connectCard: element('connect-card'),
  connectDescription: element('connect-description'),
  connectError: element('connect-error'),
  disconnect: element<HTMLButtonElement>('disconnect'),
  faucetLink: element<HTMLAnchorElement>('faucet-link'),
  fundAccount: element('fund-account'),
  seekerConnect: element<SeekerConnectButton>('seeker-connect'),
  sendMemo: element<HTMLButtonElement>('send-memo'),
  sendMemoCard: element('send-memo-card'),
  sendMemoError: element('send-memo-error'),
  sendMemoInput: element<HTMLInputElement>('send-memo-input'),
  sendMemoResult: element('send-memo-result'),
  sendMemoSignature: element<HTMLAnchorElement>('send-memo-signature'),
  signMessage: element<HTMLButtonElement>('sign-message'),
  signMessageCard: element('sign-message-card'),
  signMessageError: element('sign-message-error'),
  signMessageInput: element<HTMLInputElement>('sign-message-input'),
  signMessageResult: element('sign-message-result'),
  walletList: element('wallet-list'),
}

/**
 * The connect card's text as `index.html` ships it, read before anything overwrites it.
 *
 * Keeping the prose in the markup and picking it back up here means it is written once. The
 * alternative — an empty element filled in by `render` — puts a paragraph of copy in a TypeScript
 * file and leaves the page blank if the script fails to load.
 */
const DEFAULT_CONNECT_DESCRIPTION = elements.connectDescription.textContent ?? ''

/** Sets an element's text, and hides it entirely when there is nothing to say. */
function setText(target: HTMLElement, text: string | null): void {
  target.textContent = text ?? ''
  target.hidden = !text
}

/**
 * Shows a transaction signature as a link to Solana Explorer, and hides the row without one.
 *
 * Both the airdrop and the memo transaction end in a signature, so both report it the same way.
 */
function setSignature(row: HTMLElement, link: HTMLAnchorElement, signature: string | null): void {
  row.hidden = !signature
  link.href = signature ? getExplorerUrl(`/tx/${signature}`) : ''
  link.textContent = signature ? `Signature: ${formatAddress(signature, 8)}` : ''
}

/**
 * The wallets the buttons were last built for.
 *
 * The only thing this module remembers between passes, and the reason is the one place `render`
 * replaces nodes instead of setting properties: rebuilding the buttons on every keystroke would
 * throw away the focus ring and the keyboard position along with them. Everything else is set
 * unconditionally, because assigning a property its current value costs nothing.
 */
let renderedWallets: readonly SolanaWallet[] = []

/**
 * Rebuilds the wallet buttons, which are the only markup built in JavaScript — the list is not
 * known until wallets register themselves.
 *
 * Each button carries the wallet's name in `data-wallet` and nothing else: one delegated listener
 * on the container reads it back, so rebuilding the list cannot leak listeners the way attaching
 * one per button would.
 */
function renderWallets(wallets: readonly SolanaWallet[], disabled: boolean): void {
  if (wallets !== renderedWallets) {
    renderedWallets = wallets
    elements.walletList.replaceChildren(
      ...wallets.map((wallet) => {
        const button = document.createElement('button')
        button.className = 'button button-secondary'
        button.dataset.wallet = wallet.name
        button.type = 'button'

        const icon = document.createElement('img')
        icon.alt = ''
        icon.src = wallet.icon
        button.append(icon, wallet.name)

        return button
      }),
    )
  }

  for (const button of elements.walletList.querySelectorAll('button')) {
    button.disabled = disabled
  }
}

/**
 * Paints the whole interface from the state it is handed.
 *
 * State in, DOM out, with no memory of the previous pass: the browser skips an assignment that
 * changes nothing, so there is nothing to diff at this size. What a framework would buy here is not
 * speed but the discipline of writing this function — every element the app can change is set on
 * every pass, so no branch can leave one behind showing a value that is no longer true.
 */
export function render(state: AppState): void {
  const { actions, balance, wallet } = state
  const { connected, status, wallets } = wallet
  const busy = status === 'connecting' || status === 'reconnecting'

  elements.clusterLabel.textContent = CLUSTER_LABEL
  elements.disconnect.hidden = !connected
  elements.disconnect.disabled = busy

  // Connect card
  elements.connectCard.hidden = Boolean(connected)
  renderWallets(wallets, busy)
  setText(elements.connectError, actions.connect.error)
  // Lit applies properties assigned before the element upgrades, so this is safe on the first pass.
  elements.seekerConnect.disabled = busy || !wallets.some(({ name }) => name === SeekerConnectWalletName)
  elements.connectDescription.textContent =
    status === 'reconnecting'
      ? 'Reconnecting to the wallet you used last time…'
      : wallets.length === 0
        ? `No wallet found that supports ${CLUSTER_LABEL}. Install a browser wallet, or open this page in Chrome on Android or a Solana Mobile web shell to reach a wallet installed on the device over Mobile Wallet Adapter.`
        : DEFAULT_CONNECT_DESCRIPTION

  // Account card
  elements.accountCard.hidden = !connected
  elements.signMessageCard.hidden = !connected
  elements.sendMemoCard.hidden = !connected
  if (!connected) {
    return
  }

  const { address } = connected.account
  elements.accountAddress.href = getExplorerUrl(`/address/${address}`)
  elements.accountAddress.textContent = address
  elements.accountBalance.textContent = balance.lamports === null ? '—' : formatSol(balance.lamports)
  setText(elements.balanceError, balance.error)

  // Funding is offered while the balance is known to be empty, and only then: a permanent faucet
  // control implies the app is about faucets.
  elements.fundAccount.hidden = balance.lamports !== 0n
  elements.faucetLink.href = getFaucetUrl(address)
  elements.airdrop.disabled = actions.airdrop.isRunning
  elements.airdrop.textContent = actions.airdrop.isRunning ? 'Requesting…' : 'Airdrop 1 SOL'
  setSignature(elements.airdropResult, elements.airdropSignature, actions.airdrop.result)
  setText(elements.airdropError, actions.airdrop.error)

  // Sign a message
  elements.signMessage.disabled = actions['sign-message'].isRunning || elements.signMessageInput.value.length === 0
  elements.signMessage.textContent = actions['sign-message'].isRunning ? 'Waiting for wallet…' : 'Sign message'
  setText(elements.signMessageResult, actions['sign-message'].result)
  setText(elements.signMessageError, actions['sign-message'].error)

  // Send a transaction
  elements.sendMemo.disabled = actions['send-memo'].isRunning || elements.sendMemoInput.value.length === 0
  elements.sendMemo.textContent = actions['send-memo'].isRunning ? 'Sending…' : 'Send memo'
  setSignature(elements.sendMemoResult, elements.sendMemoSignature, actions['send-memo'].result)
  setText(elements.sendMemoError, actions['send-memo'].error)
}
