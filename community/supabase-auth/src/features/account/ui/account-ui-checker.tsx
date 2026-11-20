'use client'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/provider'
import { AccountUiBalanceCheck } from './account-ui-balance-check'

export function AccountUiChecker() {
  const { client } = useSolana()
  const wallet = useConnectedWallet(client)
  if (!wallet) {
    return null
  }
  return <AccountUiBalanceCheck address={wallet.account.address.toString()} />
}
