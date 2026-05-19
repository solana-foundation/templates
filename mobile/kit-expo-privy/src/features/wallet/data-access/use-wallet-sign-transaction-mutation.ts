import { getAddMemoInstruction } from '@solana-program/memo'
import { Address, Instruction } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

import { getWalletErrorMessage } from './get-wallet-error-message'

export function useWalletSignTransactionMutation(address: Address) {
  const { sendTransactions } = useMobileWallet()
  const mutation = useMutation({
    mutationFn: async () => {
      const instructions: Instruction[] = [getAddMemoInstruction({ memo: `gm from kit-expo-privy: ${address}` })]

      return await sendTransactions(instructions)
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getWalletErrorMessage(mutation.error, 'Failed to sign transaction') : null,
    signTransaction: mutation.mutate,
    transactionSignature: mutation.data ?? null,
  }
}
