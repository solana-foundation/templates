import { lamportsToSolString } from '@solana/client'

export function AccountUiBalanceSol({ balance }: { balance: bigint | null }) {
  if (balance == null) {
    return <span>0</span>
  }
  return <span>{lamportsToSolString(balance)}</span>
}
