import { PublicKey } from '@solana/web3.js'
import { useConnection } from '@/components/solana/solana-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'

export function useGetTokenAccountsQueryKey({ address, endpoint }: { address: PublicKey; endpoint: string }) {
  return ['get-token-accounts', { endpoint, address }]
}

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  const connection = useConnection()
  const queryKey = useGetTokenAccountsQueryKey({ address, endpoint: connection.rpcEndpoint })

  return useQuery({
    queryKey,
    queryFn: async () => {
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_PROGRAM_ID,
        }),
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_2022_PROGRAM_ID,
        }),
      ])
      return [...tokenAccounts.value, ...token2022Accounts.value]
    },
  })
}

export function useGetTokenAccountsInvalidate({ address }: { address: PublicKey }) {
  const connection = useConnection()
  const queryKey = useGetTokenAccountsQueryKey({ address, endpoint: connection.rpcEndpoint })
  const client = useQueryClient()

  return () => client.invalidateQueries({ queryKey })
}
