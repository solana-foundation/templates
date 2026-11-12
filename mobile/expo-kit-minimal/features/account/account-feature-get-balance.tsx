import { Text } from 'react-native'
import { useAccountGetBalance } from '@/features/account/use-account-get-balance'
import { appStyles } from '@/constants/app-styles'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { Address } from '@solana/kit'

export function AccountFeatureGetBalance({ address }: { address: Address }) {
  const balance = useAccountGetBalance({ address })
  const value = balance.data?.value

  // Keep 'loading', 'error' and an actual zero balance apart, so a failed read never renders as 0 SOL.
  if (value === undefined) {
    return <Text>Balance: {balance.isError ? 'Unable to load' : '...'}</Text>
  }

  // A failed refetch keeps the last known value, so label it instead of passing it off as current.
  return (
    <Text>
      Balance: {lamportsToSol(value)} SOL
      {balance.isError ? <Text style={appStyles.textDanger}> (refresh failed)</Text> : null}
    </Text>
  )
}
