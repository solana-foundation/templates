import { PublicKey } from '@solana/web3.js'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppActionButton } from '@/components/app-action-button'

export function AccountFeatureSignMessage({ address }: { address: PublicKey }) {
  const { signMessages } = useMobileWallet()

  return (
    <AppActionButton
      onPress={async () => {
        await signMessages(new TextEncoder().encode(`Signing a message with ${address.toString()}`))
        return {
          description: `Signed a message with ${address.toString()}`,
          status: 'success',
          title: 'Sign Message',
        } as const
      }}
      title="Sign Message"
    />
  )
}
