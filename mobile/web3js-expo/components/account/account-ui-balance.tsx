import { PublicKey } from '@solana/web3.js'
import { useGetBalance } from '@/components/account/use-get-balance'
import { ActivityIndicator, View } from 'react-native'
import { AppText } from '@/components/app-text'
import { lamportsToSol } from '@/utils/lamports-to-sol'

export function AccountUiBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address })

  return (
    <View>
      <AppText type="title">
        {query.isLoading ? <ActivityIndicator /> : query.data ? lamportsToSol(query.data) : '0'} SOL
      </AppText>
    </View>
  )
}
