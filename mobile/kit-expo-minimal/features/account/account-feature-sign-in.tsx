import { Button, View } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { Account, useMobileWallet } from '@wallet-ui/react-native-kit'

export function AccountFeatureSignIn({ account }: { account?: Account }) {
  const { chain, identity, signIn } = useMobileWallet()
  async function submit() {
    try {
      await signIn({
        address: account?.address.toString(),
        chainId: chain,
        uri: identity.uri,
      })
      console.log('Signed in!')
    } catch (e) {
      console.log(`Error signing in: ${e}`)
    }
  }
  return (
    <View style={appStyles.stack}>
      <Button onPress={submit} title={`Sign In ${account ? `with ${account.label}` : 'and connect'}`} />
    </View>
  )
}
