import { useThemeColor } from '@/hooks/use-theme-color'
import { View, type ViewProps } from 'react-native'
import React from 'react'

export function AppView({ style, ...otherProps }: ViewProps) {
  const backgroundColor = useThemeColor({}, 'background')

  return <View style={[{ backgroundColor, gap: 8 }, style]} {...otherProps} />
}
