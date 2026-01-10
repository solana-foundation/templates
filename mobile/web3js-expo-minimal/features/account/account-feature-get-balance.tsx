import { Text } from 'react-native'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useAccountGetBalance } from '@/features/account/use-account-get-balance'

export function AccountFeatureGetBalance({ publicKey }: { publicKey: PublicKey }) {
  const { data, isLoading } = useAccountGetBalance({ publicKey })

  return <Text>Balance: {isLoading ? '...' : `${(data ?? 0) / LAMPORTS_PER_SOL} SOL`}</Text>
}
