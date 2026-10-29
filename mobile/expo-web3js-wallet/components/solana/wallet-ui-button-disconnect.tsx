import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { BaseButton } from '@/components/solana/base-button'
import React, { useState } from 'react'
import { showError } from '@/utils/show-error'

export function WalletUiButtonDisconnect({ label = 'Disconnect' }: { label?: string }) {
  const { disconnect } = useMobileWallet()
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  async function handleDisconnect() {
    if (isDisconnecting) {
      return
    }
    setIsDisconnecting(true)
    try {
      await disconnect()
    } catch (error) {
      showError('Could not disconnect wallet', error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <BaseButton
      disabled={isDisconnecting}
      label={isDisconnecting ? 'Disconnecting...' : label}
      onPress={() => void handleDisconnect()}
    />
  )
}
