import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useConnection } from '@/components/solana/solana-provider'
import { useMutation } from '@tanstack/react-query'
import { useGetBalanceInvalidate } from './use-get-balance'

export function useRequestAirdrop({ address }: { address: PublicKey }) {
  const connection = useConnection()
  const invalidateBalance = useGetBalanceInvalidate({ address })

  return useMutation({
    mutationKey: ['airdrop', { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (amount: number = 1) => {
      const [latestBlockhash, signature] = await Promise.all([
        connection.getLatestBlockhash(),
        connection.requestAirdrop(address, amount * LAMPORTS_PER_SOL),
      ])

      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')
      return signature
    },
    onSuccess: async () => {
      await invalidateBalance()
    },
    retry: false,
  })
}
