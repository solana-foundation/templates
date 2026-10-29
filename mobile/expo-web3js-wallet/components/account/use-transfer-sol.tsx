import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { createTransaction } from './create-transaction'
import { useGetBalanceInvalidate } from './use-get-balance'

export function useTransferSol({ address }: { address: PublicKey }) {
  const { connection, signAndSendTransactions } = useMobileWallet()
  const invalidateBalance = useGetBalanceInvalidate({ address })

  return useMutation({
    mutationKey: ['transfer-sol', { endpoint: connection.rpcEndpoint, address }],
    // Let failures reject so the mutation lands in its error state and the UI can
    // show it. Swallowing here made a failed transfer look like a successful one.
    mutationFn: async (input: { destination: PublicKey; amount: number }) => {
      const { transaction, latestBlockhash, minContextSlot } = await createTransaction({
        address,
        destination: input.destination,
        amount: input.amount,
        connection,
      })

      // Send transaction and await for signature
      const signature = await signAndSendTransactions(transaction, minContextSlot)

      // Await for the transaction to be confirmed
      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

      return signature
    },
    onSuccess: async () => {
      await invalidateBalance()
    },
  })
}
