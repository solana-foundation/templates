'use client'

import { useAccountInfo } from '@/hooks/use-account-info'
import { AccountUiBalanceSol } from './account-ui-balance-sol'

export function AccountUiBalance({ address }: { address: string }) {
  const balance = useAccountInfo(address)
  return (
    <h1 className="text-5xl font-bold cursor-pointer" onClick={() => balance.refresh()}>
      {balance.data ? <AccountUiBalanceSol balance={balance.data.value?.lamports ?? null} /> : '...'} SOL
    </h1>
  )
}
