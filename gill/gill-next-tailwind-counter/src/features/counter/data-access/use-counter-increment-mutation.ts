import { CounterAccount, getIncrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { useWalletTransactionSignAndSend } from '@/components/solana/use-wallet-transaction-sign-and-send'
import { useCounterAccountsInvalidate } from './use-counter-accounts-invalidate'

export function useCounterIncrementMutation({ counter }: { counter: CounterAccount }) {
  const invalidateAccounts = useCounterAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ counter: counter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
