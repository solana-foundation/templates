import { Text } from 'react-native'
import { useAccountGetBalance } from '@/features/account/use-account-get-balance'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { Address } from '@solana/kit'

export function AccountFeatureGetBalance({ address }: { address: Address }) {
  const { data, isLoading } = useAccountGetBalance({ address })

  return <Text>Balance: {isLoading ? '...' : `${lamportsToSol(data?.value ?? 0n)} SOL`}</Text>
}
