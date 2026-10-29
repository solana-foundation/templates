import { PublicKey } from '@solana/web3.js'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppActionButton } from '@/components/app-action-button'
import { AppConfig } from '@/constants/app-config'

export function AccountFeatureSignIn({ address }: { address: PublicKey }) {
  const { signIn } = useMobileWallet()

  return (
    <AppActionButton
      onPress={async () => {
        await signIn({ address: address.toString(), uri: AppConfig.uri })
        return { description: `Signed in with ${address.toString()}`, status: 'success', title: 'Sign In' } as const
      }}
      title="Sign In"
    />
  )
}
