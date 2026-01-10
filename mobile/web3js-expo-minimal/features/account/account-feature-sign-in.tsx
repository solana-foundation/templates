import { PublicKey } from '@solana/web3.js'
import { Button, View } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppConfig } from '@/constants/app-config'

export function AccountFeatureSignIn({ publicKey }: { publicKey: PublicKey }) {
  const { signIn } = useMobileWallet()
  async function submit() {
    try {
      await signIn({ address: publicKey.toString(), uri: AppConfig.uri })
      console.log('Signed in!')
    } catch (e) {
      console.log(`Error signing in: ${e}`)
    }
  }
  return (
    <View style={appStyles.stack}>
      <Button onPress={submit} title="Sign In" />
    </View>
  )
}
