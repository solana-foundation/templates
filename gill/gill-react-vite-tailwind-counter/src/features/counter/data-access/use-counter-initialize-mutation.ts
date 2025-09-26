import { useSolana } from '@/components/solana/use-solana'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'
import { generateKeyPairSigner } from 'gill'
import { getInitializeInstruction } from '@project/anchor'
import { toastTx } from '@/components/toast-tx'
import { toast } from 'sonner'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useCounterInitializeMutation({ account }: { account: UiWalletAccount }) {
  const { cluster } = useSolana()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const counter = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, counter }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['counter', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}
