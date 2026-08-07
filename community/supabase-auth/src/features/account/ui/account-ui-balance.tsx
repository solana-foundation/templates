'use client'

import { address as toAddress } from '@solana/kit'
import { useBalance } from '@/hooks/use-balance'
import { AccountUiBalanceSol } from './account-ui-balance-sol'

export function AccountUiBalance({ address }: { address: string }) {
  const balance = useBalance(address ? toAddress(address) : undefined)

  return (
    <h1 className="text-5xl font-bold">
      {typeof balance.lamports === 'bigint' ? <AccountUiBalanceSol balance={balance.lamports} /> : '...'} SOL
    </h1>
  )
}
