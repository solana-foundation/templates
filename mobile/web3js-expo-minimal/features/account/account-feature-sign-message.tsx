import { PublicKey } from '@solana/web3.js'
import { Button, View } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { toUint8Array, useMobileWallet } from '@wallet-ui/react-native-web3js'

export function AccountFeatureSignMessage({ address }: { address: PublicKey }) {
  const { signMessage } = useMobileWallet()
  async function submit() {
    try {
      await signMessage(toUint8Array(`Signing a message with ${address.toString()}`))
      console.log('Message signed!')
    } catch (e) {
      console.log(`Error signing message: ${e}`)
    }
  }
  return (
    <View style={appStyles.stack}>
      <Button onPress={submit} title="Sign Message" />
    </View>
  )
}
