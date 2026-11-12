import { fetchAllMaybeContributor, findContributorAccountPda, type Contributor } from '@project/anchor'
import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

export interface PotContributor {
  address: Address
  // The per-contributor tracking account, created on first contribution. A
  // contributor who was added but has not contributed yet has none.
  account: Contributor | null
}

// Contribution totals for every contributor of a pot, from the Contributor
// PDAs derived from the pot's contributor list.
export function usePotContributorsQuery({ contributors, pot }: { contributors: Address[]; pot: Address }) {
  const { chain, client } = useMobileWallet()

  return useQuery({
    queryKey: ['pot-contributors', chain, pot, contributors.length],
    queryFn: async (): Promise<PotContributor[]> => {
      const addresses = await Promise.all(
        contributors.map(async (contributor) => {
          const [address] = await findContributorAccountPda({ contributor, pot })
          return address
        }),
      )
      const accounts = await fetchAllMaybeContributor(client.rpc, addresses)
      return contributors.map((address, index) => {
        const account = accounts[index]
        return { address, account: account.exists ? account.data : null }
      })
    },
  })
}
