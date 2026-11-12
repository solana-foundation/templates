import { PublicKey } from '@solana/web3.js'
import { ActivityIndicator } from 'react-native'
import { AppText } from '@/components/app-text'
import { useGetTokenAccountBalance } from '@/components/account/use-get-token-account-balance'

export function AccountUiTokenBalance({ address }: { address: PublicKey }) {
  const query = useGetTokenAccountBalance({ address })
  return query.isLoading ? (
    <ActivityIndicator animating={true} />
  ) : query.data ? (
    <AppText>{query.data?.value.uiAmount}</AppText>
  ) : (
    <AppText>Error</AppText>
  )
}
