import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

export function AccountUiButtons() {
  const router = useRouter()
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
      <Button mode="contained-tonal" onPressIn={() => router.navigate('/(tabs)/account/airdrop')}>
        Airdrop
      </Button>
      <Button mode="contained-tonal" onPressIn={() => router.navigate('/(tabs)/account/send')}>
        Send
      </Button>
      <Button mode="contained-tonal" onPressIn={() => router.navigate('/(tabs)/account/receive')}>
        Receive
      </Button>
    </View>
  )
}
