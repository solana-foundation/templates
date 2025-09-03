import { CounterAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { useWalletTransactionSignAndSend } from '@/components/solana/use-wallet-transaction-sign-and-send'
import { toastTx } from '@/components/toast-tx'
import { useCounterAccountsInvalidate } from './use-counter-accounts-invalidate'

export function useCounterDecrementMutation({ counter }: { counter: CounterAccount }) {
  const invalidateAccounts = useCounterAccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ counter: counter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
