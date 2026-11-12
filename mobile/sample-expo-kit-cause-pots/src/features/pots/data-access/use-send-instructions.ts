import {
  appendTransactionMessageInstructions,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  signature,
  type Instruction,
  type TransactionSigner,
} from '@solana/kit'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { waitForConfirmation } from '../../../utils/wait-for-confirmation'

// Sends instructions from the generated program client through the wallet with
// Mobile Wallet Adapter. The wallet's sending signer must be the only signer in
// the transaction, so the same instance is used as fee payer and passed to the
// instruction builders.
export function useSendInstructions() {
  const { account, client, getTransactionSigner } = useMobileWallet()

  return async function sendInstructions(createInstructions: (signer: TransactionSigner) => Promise<Instruction[]>) {
    if (!account) {
      throw new Error('Wallet not connected')
    }
    const {
      context: { slot: minContextSlot },
      value: latestBlockhash,
    } = await client.rpc.getLatestBlockhash().send()

    const signer = getTransactionSigner(account.address, minContextSlot)
    const instructions = await createInstructions(signer)

    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (message) => setTransactionMessageFeePayerSigner(signer, message),
      (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
      (message) => appendTransactionMessageInstructions(instructions, message),
    )
    assertIsTransactionMessageWithSingleSendingSigner(message)

    const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
    const transactionSignature = signature(getBase58Decoder().decode(signatureBytes))

    // The wallet submits the transaction, so poll until the cluster confirms it.
    await waitForConfirmation(client.rpc, transactionSignature)
    return transactionSignature
  }
}
