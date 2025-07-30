import React from 'react'
import QRCode from 'react-qr-code'
import { AppView } from '@/components/app-view'
import { ViewProps } from 'react-native'

export function AppQrCode({ value, style = {}, ...props }: ViewProps & { value: string }) {
  return (
    <AppView style={{ backgroundColor: 'white', marginHorizontal: 'auto', padding: 16 }} {...props}>
      <QRCode value={value} />
    </AppView>
  )
}
