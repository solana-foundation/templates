import { Text } from 'react-native'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useAccountGetBalance } from '@/features/account/use-account-get-balance'
import { appStyles } from '@/constants/app-styles'

export function AccountFeatureGetBalance({ address }: { address: PublicKey }) {
  const balance = useAccountGetBalance({ address })

  // Keep 'loading', 'error' and an actual zero balance apart, so a failed read never renders as 0 SOL.
  if (balance.data === undefined) {
    return <Text>Balance: {balance.isError ? 'Unable to load' : '...'}</Text>
  }

  // A failed refetch keeps the last known value, so label it instead of passing it off as current.
  return (
    <Text>
      Balance: {balance.data / LAMPORTS_PER_SOL} SOL
      {balance.isError ? <Text style={appStyles.textDanger}> (refresh failed)</Text> : null}
    </Text>
  )
}
