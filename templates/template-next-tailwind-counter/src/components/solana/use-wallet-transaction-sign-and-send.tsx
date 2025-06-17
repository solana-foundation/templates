import { useWalletUi } from '@wallet-ui/react'
import {
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  getBase58Decoder,
  IInstruction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  TransactionSendingSigner,
} from 'gill'

export function useWalletTransactionSignAndSend() {
  const { client } = useWalletUi()

  return async (ix: IInstruction, signer: TransactionSendingSigner) => {
    const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(signer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstruction(ix, tx),
    )

    assertIsTransactionMessageWithSingleSendingSigner(message)

    const signature = await signAndSendTransactionMessageWithSigners(message)

    return getBase58Decoder().decode(signature)
  }
}
