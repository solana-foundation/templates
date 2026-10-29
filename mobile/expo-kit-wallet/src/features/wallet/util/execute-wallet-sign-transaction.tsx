import { Account, useMobileWallet } from '@wallet-ui/react-native-kit'
import type { SolanaClient } from '@/features/cluster/data-access/create-solana-client'
import {
  address,
  appendTransactionMessageInstruction,
  assertIsFullySignedTransaction,
  assertIsTransactionWithBlockhashLifetime,
  assertIsTransactionWithinSizeLimit,
  compileTransaction,
  compileTransactionMessage,
  createTransactionMessage,
  getBase64Decoder,
  getCompiledTransactionMessageEncoder,
  getSignatureFromTransaction,
  getTransactionCodec,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  type TransactionMessageBytesBase64,
} from '@solana/kit'
import { getAddMemoInstruction } from '@solana-program/memo'
import { assertCanPayTransactionFee } from './assert-can-pay-transaction-fee'

export async function executeWalletSignTransaction({
  account,
  client,
  signTransactions,
  text,
}: {
  account: Account
  client: SolanaClient
  signTransactions: ReturnType<typeof useMobileWallet>['signTransactions']
  text: string
}) {
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
  const feePayer = address(account.address)
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (transactionMessage) => setTransactionMessageFeePayer(feePayer, transactionMessage),
    (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
    (transactionMessage) =>
      appendTransactionMessageInstruction(getAddMemoInstruction({ memo: text }), transactionMessage),
  )
  const encodedMessage = getCompiledTransactionMessageEncoder().encode(compileTransactionMessage(message))
  const [{ value: balance }, { value: fee }] = await Promise.all([
    client.rpc.getBalance(feePayer, { commitment: 'confirmed' }).send(),
    client.rpc
      .getFeeForMessage(getBase64Decoder().decode(encodedMessage) as TransactionMessageBytesBase64, {
        commitment: 'confirmed',
      })
      .send(),
  ])

  assertCanPayTransactionFee({ balance, fee })

  const transaction = compileTransaction(message)
  const signedTransactionResult = await signTransactions(transaction)
  const transactionCodec = getTransactionCodec()
  const signedTransaction = Object.freeze({
    ...transactionCodec.decode(transactionCodec.encode(signedTransactionResult)),
    lifetimeConstraint: transaction.lifetimeConstraint,
  })

  assertIsFullySignedTransaction(signedTransaction)
  assertIsTransactionWithinSizeLimit(signedTransaction)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  const signature = getSignatureFromTransaction(signedTransaction)
  if (!signature) {
    throw new Error('Transaction signed but no signature was returned by the wallet adapter.')
  }

  return signature
}
