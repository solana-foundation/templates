import { Text, View } from 'react-native'
import { useSolPriceQuery } from '../../price/data-access/use-sol-price-query'
import { formatAmount } from '../../../utils/currency'
import type { PotAccount } from '../data-access/use-pots-query'
import { getPotCategory } from '../pot-category'
import { formatTimestamp, getPotStatus } from '../pot-status'

const statusStyles = {
  locked: { className: 'text-amber-600 dark:text-amber-400', label: '🔒 Locked' },
  released: { className: 'text-gray-500 dark:text-gray-400', label: '✅ Released' },
  unlocked: { className: 'text-green-600 dark:text-green-400', label: '🔓 Unlocked' },
}

export function PotUiCard({ pot }: { pot: PotAccount }) {
  const solPriceQuery = useSolPriceQuery()
  const category = getPotCategory(pot.data.category)
  const status = getPotStatus(pot.data)
  const progress = Math.min(1, Number(pot.data.totalContributed) / Number(pot.data.targetAmount))

  return (
    <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-bold text-gray-800 dark:text-white" numberOfLines={1}>
          {category.emoji} {pot.data.name}
        </Text>
        <Text className={`text-sm font-semibold ${statusStyles[status].className}`}>{statusStyles[status].label}</Text>
      </View>
      <View className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full my-2">
        <View className="h-2 bg-blue-600 rounded-full" style={{ width: `${progress * 100}%` }} />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {formatAmount(pot.data.totalContributed, pot.data.currency, solPriceQuery.data)} of{' '}
          {formatAmount(pot.data.targetAmount, pot.data.currency, solPriceQuery.data)}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {status === 'locked'
            ? `Unlocks ${formatTimestamp(pot.data.unlockTimestamp)}`
            : `${pot.data.signatures.length}/${pot.data.signersRequired} signatures`}
        </Text>
      </View>
    </View>
  )
}
