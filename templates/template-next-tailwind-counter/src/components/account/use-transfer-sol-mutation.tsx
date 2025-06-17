import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { Address } from 'gill'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'

import { createTransferSolTransaction } from './create-transfer-sol-transaction'
import { useInvalidateGetBalanceQuery } from './use-invalidate-get-balance-query'
import { useInvalidateGetSignaturesQuery } from './use-invalidate-get-signatures-query'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'

export function useTransferSolMutation({ address }: { address: Address }) {
  const { client } = useWalletUi()
  const txSigner = useWalletUiSigner()
  const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address })
  const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address })

  return useMutation({
    mutationFn: async (input: { destination: Address; amount: number }) => {
      try {
        const { signature } = await createTransferSolTransaction({
          txSigner,
          destination: input.destination,
          amount: input.amount,
          client,
        })
        return signature
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`)
        return
      }
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()])
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}
