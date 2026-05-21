import { Address } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { fromUint8Array, useMobileWallet } from '@wallet-ui/react-native-kit'

import { getWalletErrorMessage } from './get-wallet-error-message'

export function useWalletSignMessageMutation(address: Address) {
  const { signMessages } = useMobileWallet()
  const mutation = useMutation({
    mutationFn: async () => {
      const message = `gm from kit-expo-privy: ${address}`
      const signatureBytes = await signMessages(new TextEncoder().encode(message))

      return fromUint8Array(signatureBytes)
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getWalletErrorMessage(mutation.error, 'Failed to sign message') : null,
    signature: mutation.data ?? null,
    signMessage: mutation.mutate,
  }
}
