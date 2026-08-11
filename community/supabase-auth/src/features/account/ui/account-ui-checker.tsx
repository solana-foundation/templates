'use client'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useAppClient } from '@/components/provider'
import { AccountUiBalanceCheck } from './account-ui-balance-check'

export function AccountUiChecker() {
  const connected = useConnectedWallet(useAppClient())
  if (!connected) {
    return null
  }
  return <AccountUiBalanceCheck address={connected.account.address} />
}
