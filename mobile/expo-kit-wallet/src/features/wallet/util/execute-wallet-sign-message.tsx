import { getBase64Decoder } from '@solana/kit'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

export async function executeWalletSignMessage({
  text,
  signMessages,
}: {
  text: string
  signMessages: ReturnType<typeof useMobileWallet>['signMessages']
}) {
  const signedPayload = await signMessages(new TextEncoder().encode(text))

  if (!signedPayload) {
    throw new Error('Message signed but no signed payload was returned by the wallet adapter.')
  }

  return getBase64Decoder().decode(signedPayload)
}
