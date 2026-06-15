/**
 * Turn a raw error message into a short, accurate hint.
 *
 * The Ika flow surfaces errors from several layers (the Sui wallet, dapp-kit,
 * the Ika SDK, the network), and a single static "you're underfunded" hint is
 * usually wrong. This maps the common cases to guidance that actually helps.
 */
export function hintForError(message: string): string {
  const m = message.toLowerCase()

  if (m.includes('incorrect password') || m.includes('locked') || m.includes('unlock')) {
    return 'Your Sui wallet looks locked or the approval was cancelled. Unlock the wallet and approve the transaction when it pops up.'
  }
  if (m.includes('reject') || m.includes('denied') || m.includes('user cancel')) {
    return 'The wallet request was rejected. Try again and approve it in your Sui wallet.'
  }
  if (m.includes('sender must be set')) {
    return 'Connect the Sui operator wallet before running this step.'
  }
  if (m.includes('insufficient') || m.includes('no valid coins') || m.includes('gas') || m.includes('balance')) {
    return 'The Sui operator looks underfunded. It needs about 0.5 IKA + 0.05 SUI per operation. Use the faucet buttons, then retry.'
  }
  if (m.includes('coinwithbalance') || m.includes('unusedvalue') || m.includes('commandargument')) {
    return 'Transaction build error. This is usually a transient resolver issue. Retry, and if it persists check the operator has both SUI and IKA.'
  }
  if (m.includes('timeout') || m.includes('timed out')) {
    return 'The Ika network took too long to respond. It can be slow on testnet. Wait a moment and retry.'
  }
  if (m.includes('fetch') || m.includes('network') || m.includes('rpc')) {
    return 'A network request failed. Check your connection / RPC endpoints and retry.'
  }
  return 'Make sure the Sui operator is connected and funded (about 0.5 IKA + 0.05 SUI per op), then retry.'
}
