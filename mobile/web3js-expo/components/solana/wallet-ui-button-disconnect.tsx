import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { BaseButton } from '@/components/solana/base-button'
import React from 'react'

export function WalletUiButtonDisconnect({ label = 'Disconnect' }: { label?: string }) {
  const { disconnect } = useMobileWallet()

  return <BaseButton label={label} onPress={() => disconnect()} />
}
