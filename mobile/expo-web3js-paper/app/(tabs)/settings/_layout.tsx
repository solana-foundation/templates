import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown'
import { Stack } from 'expo-router'
import React from 'react'

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Settings', headerRight: () => <WalletUiDropdown /> }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
