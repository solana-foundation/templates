import { Address, airdropFactory, lamports } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'

import { useInvalidateGetBalanceQuery } from './use-invalidate-get-balance-query'
import { useInvalidateGetSignaturesQuery } from './use-invalidate-get-signatures-query'

export function useRequestAirdropMutation({ address }: { address: Address }) {
  const { client } = useWalletUi()
  const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address })
  const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address })
  const airdrop = airdropFactory(client)

  return useMutation({
    mutationFn: async (amount: number = 1) =>
      airdrop({
        commitment: 'confirmed',
        recipientAddress: address,
        lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
      }),
    onSuccess: async (tx) => {
      toastTx(tx)
      await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()])
    },
  })
}
