import { Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useQuery } from '@tanstack/react-query'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from 'gill/programs/token'

import { getTokenAccountsByOwner } from './get-token-accounts-by-owner'

export function useGetTokenAccountsQuery({ address }: { address: Address }) {
  const { client, cluster } = useWalletUi()

  return useQuery({
    queryKey: ['get-token-accounts', { cluster, address }],
    queryFn: async () =>
      Promise.all([
        getTokenAccountsByOwner(client.rpc, { address, programId: TOKEN_PROGRAM_ADDRESS }),
        getTokenAccountsByOwner(client.rpc, { address, programId: TOKEN_2022_PROGRAM_ADDRESS }),
      ]).then(([tokenAccounts, token2022Accounts]) => [...tokenAccounts, ...token2022Accounts]),
  })
}
