import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { BaseButton } from '@/components/solana/base-button'
import React from 'react'

export function WalletUiButtonConnect({ label = 'Connect' }: { label?: string }) {
  const { connect } = useWalletUi()

  return <BaseButton label={label} onPress={() => connect()} />
}
