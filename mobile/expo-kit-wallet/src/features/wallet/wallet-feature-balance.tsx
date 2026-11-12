import Ionicons from '@expo/vector-icons/Ionicons'
import type { Lamports } from '@solana/kit'
import { Account } from '@wallet-ui/react-native-kit'
import { Card } from 'heroui-native/card'
import { Pressable, Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { useGetBalance } from '@/features/wallet/data-access/use-get-balance'
import { formatError } from './util/format-error'
import { WalletUiStatusAlert } from './ui/wallet-ui-status-alert'

export const LAMPORTS_PER_SOL = 1_000_000_000n
function formatLamports(lamports: Lamports) {
  const fractional = lamports % LAMPORTS_PER_SOL
  const whole = lamports / LAMPORTS_PER_SOL

  if (fractional === 0n) {
    return `${whole.toLocaleString()} SOL`
  }

  const fractionalDisplay = fractional.toString().padStart(9, '0').replace(/0+$/, '')
  return `${whole.toLocaleString()}.${fractionalDisplay} SOL`
}

export function WalletFeatureBalance({ account }: { account: Account }) {
  const balance = useGetBalance(account.address)
  const { tintColor } = useTheme()
  const value = balance.data?.value
  const balanceText = value !== undefined ? formatLamports(value) : balance.isError ? 'Unable to load' : 'Loading...'
  // A failed refetch keeps the last value, so say so rather than passing it off as current.
  const isStale = value !== undefined && balance.isError

  return (
    <Card className="w-full gap-3 p-4">
      <Card.Body className="gap-3">
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons color={tintColor} name="cash-outline" size={22} />
            <Card.Title className="flex-1 text-xl font-bold">Balance</Card.Title>
            <Pressable
              accessibilityLabel="Refresh balance"
              disabled={balance.isFetching}
              onPress={() => void balance.refetch()}
            >
              <Ionicons color={tintColor} name={balance.isFetching ? 'sync-outline' : 'refresh-outline'} size={20} />
            </Pressable>
          </View>
        </View>
        <View className="gap-1">
          <Text className="text-2xl font-bold text-neutral-900 text-right dark:text-white">{balanceText}</Text>
          {isStale ? (
            <Text className="text-right text-sm text-neutral-500 dark:text-neutral-400">
              Last known value; refresh failed
            </Text>
          ) : null}
        </View>
        {balance.isError ? (
          <WalletUiStatusAlert description={formatError(balance.error)} status="danger" title="Balance error" />
        ) : null}
      </Card.Body>
    </Card>
  )
}
