import { lamportsToSolString } from '@solana/client'
import type { Lamports } from '@solana/kit'

export function AccountUiBalanceSol({ balance }: { balance: Lamports | null }) {
  if (balance == null) {
    return <span>0</span>
  }
  return <span>{lamportsToSolString(balance)}</span>
}
