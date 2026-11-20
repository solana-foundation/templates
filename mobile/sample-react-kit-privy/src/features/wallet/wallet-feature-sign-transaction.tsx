import { getAddMemoInstruction } from '@solana-program/memo'
import {
  appendTransactionMessageInstruction,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { useAction, useWalletAccountTransactionSigner } from '@solana/react'
import type { UiWalletAccount } from '@wallet-standard/ui'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppClient } from '@/features/core/data-access/use-app-client'
import { WalletUiActionCard } from '@/features/wallet/ui/wallet-ui-action-card'
import { WalletUiUnsupportedCard } from '@/features/wallet/ui/wallet-ui-unsupported-card'

const SIGN_TRANSACTION_FEATURE = 'solana:signTransaction'

export function WalletFeatureSignTransaction({
  account,
  walletName,
}: {
  account: UiWalletAccount
  walletName: string
}) {
  // Plenty of wallets implement `solana:signAndSendTransaction` and nothing else, because they want
  // to own submission. For those this card cannot work, and saying so beats a confusing failure.
  if (!account.features.includes(SIGN_TRANSACTION_FEATURE)) {
    return (
      <WalletUiUnsupportedCard feature={SIGN_TRANSACTION_FEATURE} title="Sign transaction" walletName={walletName} />
    )
  }
  return <SignTransaction account={account} />
}

/**
 * Signs a transaction without submitting it.
 *
 * The counterpart to the send card, and the path to copy when something else owns submission — a
 * relayer, a sponsor paying the fee, or a multi-signature flow collecting signatures before anyone
 * broadcasts. It builds the message by hand rather than through the client's `sendTransaction`
 * convenience, because stopping after the signature is exactly what that convenience skips past.
 *
 * Nothing here reaches the network except the blockhash lookup. The signature is real and the
 * transaction would be valid if submitted; it simply never is.
 */
function SignTransaction({ account }: { account: UiWalletAccount }) {
  const client = useAppClient()
  const signer = useWalletAccountTransactionSigner(account, client.chain)
  const [memo, setMemo] = useState('Signed, not sent')

  const { data, dispatch, error, isRunning } = useAction(async (_abortSignal, text: string) => {
    const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (draft) => setTransactionMessageFeePayerSigner(signer, draft),
      (draft) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, draft),
      (draft) => appendTransactionMessageInstruction(getAddMemoInstruction({ memo: text }), draft),
    )
    const signedTransaction = await signTransactionMessageWithSigners(message)
    return getSignatureFromTransaction(signedTransaction)
  })

  return (
    <WalletUiActionCard
      description="Signs a Memo Program transaction and stops there. Nothing is submitted, so no fee is paid."
      error={error}
      result={data}
      title="Sign transaction"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input onChange={(event) => setMemo(event.target.value)} placeholder="Memo text" value={memo} />
        <Button disabled={isRunning || memo.length === 0} onClick={() => dispatch(memo)} variant="outline">
          {isRunning ? 'Waiting for wallet…' : 'Sign transaction'}
        </Button>
      </div>
    </WalletUiActionCard>
  )
}
