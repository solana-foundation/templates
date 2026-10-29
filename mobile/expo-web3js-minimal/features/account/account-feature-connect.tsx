import React from 'react'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppActionButton } from '@/components/app-action-button'

export function AccountFeatureConnect() {
  const { account, connect } = useMobileWallet()

  return (
    <AppActionButton
      disabled={!!account}
      onPress={async () => {
        await connect()
      }}
      title="Connect"
    />
  )
}
