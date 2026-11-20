import { PublicKey } from '@solana/web3.js'
import { useGetBalance } from '@/components/account/use-get-balance'
import { ActivityIndicator, View } from 'react-native'
import { AppText } from '@/components/app-text'
import { lamportsToSol } from '@/utils/lamports-to-sol'

export function AccountUiBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address })

  // Keep 'loading', 'error' and an actual zero balance apart, so a failed read never renders as 0 SOL.
  if (query.data === undefined) {
    return (
      <View>
        <AppText variant="headlineMedium">{query.isError ? 'Unable to load balance' : <ActivityIndicator />}</AppText>
      </View>
    )
  }

  // A failed refetch keeps the last known value, so label it instead of passing it off as current.
  return (
    <View>
      <AppText variant="headlineMedium">{lamportsToSol(query.data)} SOL</AppText>
      {query.isError ? <AppText style={{ color: 'red', fontSize: 12 }}>Refresh failed</AppText> : null}
    </View>
  )
}
