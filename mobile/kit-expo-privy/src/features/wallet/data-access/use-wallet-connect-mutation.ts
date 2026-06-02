import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

import { getWalletErrorMessage } from './get-wallet-error-message'

export function useWalletConnectMutation() {
  const { connect } = useMobileWallet()
  const mutation = useMutation({
    mutationFn: async () => {
      await connect()
    },
  })

  return {
    ...mutation,
    connectWallet: mutation.mutate,
    errorMessage: mutation.error ? getWalletErrorMessage(mutation.error, 'Failed to connect wallet') : null,
  }
}
