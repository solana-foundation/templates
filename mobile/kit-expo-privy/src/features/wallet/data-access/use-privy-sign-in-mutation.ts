import { useLoginWithSiws } from '@privy-io/expo'
import { Address } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { fromUint8Array, useMobileWallet } from '@wallet-ui/react-native-kit'

import { getWalletErrorMessage } from './get-wallet-error-message'

const siwsDomain = 'kit-expo-privy'
const siwsUri = 'kit-expo-privy://privy-login'

export function usePrivySignInMutation(address: Address) {
  const { generateMessage, login } = useLoginWithSiws()
  const { signMessages } = useMobileWallet()
  const mutation = useMutation({
    mutationFn: async () => {
      const { message } = await generateMessage({
        from: {
          domain: siwsDomain,
          uri: siwsUri,
        },
        wallet: {
          address: address.toString(),
        },
      })
      const signatureBytes = await signMessages(new TextEncoder().encode(message))
      const signature = fromUint8Array(signatureBytes)

      await login({
        message,
        signature,
      })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getWalletErrorMessage(mutation.error, 'Failed to sign in with Privy') : null,
    signInWithPrivy: mutation.mutate,
  }
}
