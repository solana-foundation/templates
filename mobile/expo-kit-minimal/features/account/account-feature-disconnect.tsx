import React from 'react'
import { useSeekerWallet } from '@/components/seeker-wallet-provider'
import { AppActionButton } from '@/components/app-action-button'

export function AccountFeatureDisconnect() {
  const { account, disconnect } = useSeekerWallet()

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
