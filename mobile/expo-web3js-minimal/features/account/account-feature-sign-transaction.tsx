import { PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { createMemoInstruction } from '@solana/spl-memo'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppActionButton } from '@/components/app-action-button'

export function AccountFeatureSignTransaction({ address }: { address: PublicKey }) {
  const { connection, signAndSendTransactions } = useMobileWallet()

  return (
    <AppActionButton
      onPress={async () => {
        const {
          context: { slot: minContextSlot },
          value: latestBlockhash,
        } = await connection.getLatestBlockhashAndContext()

        const message = new TransactionMessage({
          payerKey: address,
          recentBlockhash: latestBlockhash.blockhash,
          instructions: [
            // You can add more instructions here
            createMemoInstruction('Hello from Mobile Wallet Adapter'),
          ],
        }).compileToLegacyMessage()

        const transaction = new VersionedTransaction(message)

        const signature = await signAndSendTransactions(transaction, minContextSlot)

        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        return { description: `Signature: ${signature}`, status: 'success', title: 'Send transaction' } as const
      }}
      title="Send transaction"
    />
  )
}
