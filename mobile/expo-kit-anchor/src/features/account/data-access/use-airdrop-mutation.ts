import { airdropFactory, lamports, type GetSignatureStatusesApi, type RequestAirdropApi, type Rpc } from '@solana/kit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

// Requests an airdrop for the connected wallet. Only works on clusters with a
// faucet, like localnet.
export function useAirdropMutation() {
  const { account, chain, client } = useMobileWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('Wallet not connected')
      }
      // requestAirdrop only exists on test clusters, which the client type can't know statically.
      const rpc = client.rpc as unknown as Rpc<GetSignatureStatusesApi & RequestAirdropApi>
      return airdropFactory({ rpc, rpcSubscriptions: client.rpcSubscriptions })({
        commitment: 'confirmed',
        lamports: lamports(1_000_000_000n),
        recipientAddress: account.address,
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['balance', chain, account?.address] }),
  })
}
