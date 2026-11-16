import React from 'react'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppActionButton } from '@/components/app-action-button'

export function AccountFeatureDisconnect() {
  const { account, disconnect } = useMobileWallet()

  return (
    <AppActionButton
      disabled={!account}
      onPress={async () => {
        await disconnect()
      }}
      title="Disconnect"
    />
  )
}
