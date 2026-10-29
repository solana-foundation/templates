import React, { PropsWithChildren } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppView } from '@/components/app-view'
import type { ViewProps } from 'react-native'

export function AppPage({ children, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <AppView style={{ flex: 1 }} {...props}>
      <SafeAreaView style={{ flex: 1, gap: 16, paddingHorizontal: 16 }}>{children}</SafeAreaView>
    </AppView>
  )
}
