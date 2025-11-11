import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

interface LoadingSpinnerProps {
  size?: 'small' | 'large'
  color?: string
}

/**
 * Reusable loading spinner component
 * Centered loading indicator with customizable size and color
 */
export function LoadingSpinner({ size = 'large', color = '#ab9ff2' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
})
