import { formatDecimalFixedPoint, lamportsToSol, type Lamports } from '@solana/kit'

const solFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 9 })

export function AccountUiBalanceSol({ balance }: { balance: Lamports | null }) {
  if (balance == null) {
    return <span>0</span>
  }
  return <span>{formatDecimalFixedPoint(solFormatter, lamportsToSol(balance))}</span>
}
