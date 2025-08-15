import { getBasicProgramId, getGreetInstruction } from '@project/anchor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { useWalletUi } from '@wallet-ui/react'
import { toastTx } from '@/components/toast-tx'
import { useWalletTransactionSignAndSend } from '@/components/solana/use-wallet-transaction-sign-and-send'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'

export function useBasicProgramId() {
  const { cluster } = useWalletUi()

  return useMemo(() => getBasicProgramId(cluster.id), [cluster])
}

export function useGetProgramAccountQuery() {
  const { client, cluster } = useWalletUi()

  return useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => client.rpc.getAccountInfo(getBasicProgramId(cluster.id)).send(),
  })
}

export function useGreetMutation() {
  const programAddress = useBasicProgramId()
  const txSigner = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getGreetInstruction({ programAddress }), txSigner)
    },
    onSuccess: (signature) => {
      toastTx(signature)
    },
    onError: () => toast.error('Failed to run program'),
  })
}
