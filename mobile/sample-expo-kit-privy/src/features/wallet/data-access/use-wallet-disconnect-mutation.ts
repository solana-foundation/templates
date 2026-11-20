import { usePrivy } from '@privy-io/expo'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

import { getWalletErrorMessage } from './get-wallet-error-message'

export function useWalletDisconnectMutation() {
  const { logout } = usePrivy()
  const { disconnect } = useMobileWallet()
  const mutation = useMutation({
    mutationFn: async () => {
      await logout()
      await disconnect()
    },
  })

  return {
    ...mutation,
    disconnectWallet: mutation.mutate,
    errorMessage: mutation.error ? getWalletErrorMessage(mutation.error, 'Failed to disconnect') : null,
  }
}
