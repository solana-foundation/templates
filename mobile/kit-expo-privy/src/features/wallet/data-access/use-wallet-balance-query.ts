import { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

import { getWalletErrorMessage } from './get-wallet-error-message'

function lamportsToSol(lamports: bigint) {
  const sol = Number(lamports) / 1_000_000_000

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 9,
    minimumFractionDigits: 0,
  }).format(sol)
}

export function useWalletBalanceQuery(address: Address) {
  const { chain, client } = useMobileWallet()
  const query = useQuery({
    queryFn: async () => {
      const result = await client.rpc.getBalance(address).send()

      return `${lamportsToSol(result.value)} SOL`
    },
    queryKey: ['wallet-balance', chain, address.toString()],
  })

  return {
    ...query,
    balance: query.data ?? null,
    errorMessage: query.error ? getWalletErrorMessage(query.error, 'Failed to load balance') : null,
    refreshBalance: query.refetch,
  }
}
