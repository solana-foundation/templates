import React from 'react'
import QRCode from 'react-qr-code'
import { AppView, AppViewProps } from '@/components/app-view'
import { useAppTheme } from './app-theme'

export function AppQrCode({ value, ...props }: AppViewProps & { value: string }) {
  const { spacing } = useAppTheme()
  return (
    <AppView style={{ backgroundColor: 'white', marginHorizontal: 'auto', padding: spacing.md }} {...props}>
      <QRCode value={value} />
    </AppView>
  )
}
