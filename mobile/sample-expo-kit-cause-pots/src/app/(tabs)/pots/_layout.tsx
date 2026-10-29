import { Stack } from 'expo-router'
import { useNavColors } from '../../../features/theme/use-nav-colors'

export default function PotsLayout() {
  const colors = useNavColors()

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Pots' }} />
      <Stack.Screen name="create" options={{ title: 'New Pot' }} />
      <Stack.Screen name="[pot]" options={{ title: 'Pot' }} />
    </Stack>
  )
}
