import { getIncrementInstructionAsync, getInitializeInstructionAsync } from '@project/anchor'
import {
  appendTransactionMessageInstruction,
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { AppState } from 'react-native'
import {
  createRecentSignatureConfirmationPromiseFactory,
  getTimeoutPromise,
  waitForRecentTransactionConfirmationUntilTimeout,
} from '@solana/transaction-confirmation'

// Sends instructions from the generated program client through the wallet with
// Mobile Wallet Adapter. The wallet's sending signer must be the only signer in
// the transaction, so the same instance is used as fee payer and passed to the
// instruction builders.
export function useCounterProgram() {
  const { account, chain, client, getTransactionSigner } = useMobileWallet()
  const queryClient = useQueryClient()

  async function sendInstruction(createInstruction: (signer: TransactionSigner) => Promise<Instruction>) {
    if (!account) {
      throw new Error('Wallet not connected')
    }
    const {
      context: { slot: minContextSlot },
      value: latestBlockhash,
    } = await client.rpc.getLatestBlockhash().send()

    const signer = getTransactionSigner(account.address, minContextSlot)
    const instruction = await createInstruction(signer)

    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (message) => setTransactionMessageFeePayerSigner(signer, message),
      (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
      (message) => appendTransactionMessageInstruction(instruction, message),
    )
    assertIsTransactionMessageWithSingleSendingSigner(message)

    const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
    const transactionSignature = signature(getBase58Decoder().decode(signatureBytes))

    // Android blocks network access while the wallet is in front, so wait until this app is back.
    if (AppState.currentState !== 'active') {
      await new Promise<void>((resolve) => {
        const subscription = AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            subscription.remove()
            resolve()
          }
        })
      })
    }
    // The wallet submits the transaction, so wait until the cluster confirms it.
    await waitForRecentTransactionConfirmationUntilTimeout({
      commitment: 'confirmed',
      getRecentSignatureConfirmationPromise: createRecentSignatureConfirmationPromiseFactory(client),
      getTimeoutPromise,
      signature: transactionSignature,
    })
    return transactionSignature
  }

  // Refresh the counter even when a mutation fails: the wallet may have
  // submitted the transaction after the app stopped waiting for it.
  const onSettled = () => queryClient.invalidateQueries({ queryKey: ['counter', chain, account?.address] })

  return {
    incrementMutation: useMutation({
      mutationFn: () => sendInstruction((authority) => getIncrementInstructionAsync({ authority })),
      onSettled,
    }),
    initializeMutation: useMutation({
      mutationFn: () => sendInstruction((payer) => getInitializeInstructionAsync({ payer })),
      onSettled,
    }),
  }
}
