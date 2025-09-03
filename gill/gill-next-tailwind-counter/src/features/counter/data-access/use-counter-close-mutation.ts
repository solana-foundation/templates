import { CounterAccount, getCloseInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { useWalletTransactionSignAndSend } from '@/components/solana/use-wallet-transaction-sign-and-send'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { toastTx } from '@/components/toast-tx'
import { useCounterAccountsInvalidate } from './use-counter-accounts-invalidate'

export function useCounterCloseMutation({ counter }: { counter: CounterAccount }) {
  const invalidateAccounts = useCounterAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, counter: counter.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
