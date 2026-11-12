import { AppButton } from '@/components/app-button'
import { useRouter } from 'expo-router'
import { View } from 'react-native'

export function AccountUiButtons() {
  const router = useRouter()
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
      <AppButton onPressIn={() => router.navigate('/(tabs)/account/airdrop')}>Airdrop</AppButton>
      <AppButton onPressIn={() => router.navigate('/(tabs)/account/send')}>Send</AppButton>
      <AppButton onPressIn={() => router.navigate('/(tabs)/account/receive')}>Receive</AppButton>
    </View>
  )
}
