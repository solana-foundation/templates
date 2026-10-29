import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { BaseButton } from '@/components/solana/base-button'
import React, { useState } from 'react'
import { showError } from '@/utils/show-error'

export function WalletUiButtonConnect({ label = 'Connect' }: { label?: string }) {
  const { connect } = useMobileWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  // The wallet can decline or fail the authorization request. Catch it here so it
  // never surfaces as an unhandled rejection, and let the user know what happened.
  async function handleConnect() {
    if (isConnecting) {
      return
    }
    setIsConnecting(true)
    try {
      await connect()
    } catch (error) {
      showError('Could not connect wallet', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <BaseButton
      disabled={isConnecting}
      label={isConnecting ? 'Connecting...' : label}
      onPress={() => void handleConnect()}
    />
  )
}
