import { lamports, type RequestAirdropApi, type Rpc } from '@solana/kit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { waitForConfirmation } from '../../../utils/wait-for-confirmation'

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
      const rpc = client.rpc as unknown as Rpc<RequestAirdropApi>
      const signature = await rpc.requestAirdrop(account.address, lamports(1_000_000_000n)).send()
      await waitForConfirmation(client.rpc, signature)
      return signature
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['balance', chain, account?.address] }),
  })
}
