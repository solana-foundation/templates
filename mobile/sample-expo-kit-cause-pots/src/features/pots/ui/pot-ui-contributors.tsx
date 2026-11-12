import type { Address } from '@solana/kit'
import { Text, View } from 'react-native'
import { SkrNameOrAddress } from '../../domains/skr-name-or-address'
import { findFriendLabel, useFriendsQuery } from '../../friends/data-access/use-friends'
import { formatSol } from '../../../utils/currency'
import type { PotContributor } from '../data-access/use-pot-contributors-query'

// Who is in the pot, what they contributed, and whether they signed the release.
export function PotUiContributors({
  authority,
  contributors,
  signatures,
  viewer,
}: {
  authority: Address
  contributors: PotContributor[]
  signatures: Address[]
  viewer: Address
}) {
  const friendsQuery = useFriendsQuery()

  return (
    <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4 gap-3">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">Contributors</Text>
      {contributors.map(({ account, address }) => {
        const label =
          address === viewer
            ? 'You'
            : (findFriendLabel(friendsQuery.data, address) ?? <SkrNameOrAddress address={address} />)
        return (
          <View key={address} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 shrink">
              <Text className="text-gray-800 dark:text-white" numberOfLines={1}>
                {label}
              </Text>
              {address === authority ? <Text className="text-xs text-gray-500 dark:text-gray-500">creator</Text> : null}
              {signatures.includes(address) ? <Text className="text-xs">✍️</Text> : null}
            </View>
            <Text className="text-gray-600 dark:text-gray-400">
              {account ? `${formatSol(account.totalContributed)} · ${account.contributionCount}x` : 'no contributions'}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
