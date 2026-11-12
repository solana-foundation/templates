import { View, type ViewProps } from 'react-native'
import React from 'react'
import { useAppTheme } from '@/components/app-theme'

export type AppViewProps = ViewProps

export function AppView({ style, ...props }: AppViewProps) {
  const { spacing } = useAppTheme()
  return <View style={[{ gap: spacing.sm }, style]} {...props} />
}
