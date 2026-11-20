import { openURL } from 'expo-linking'
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useActivityQuery, type ActivityItem } from '../../features/activity/data-access/use-activity-query'
import { findFriendLabel, useFriendsQuery, type Friend } from '../../features/friends/data-access/use-friends'
import { useNetwork } from '../../features/network/use-network'
import { formatSol } from '../../utils/currency'
import { ellipsify } from '../../utils/ellipsify'
import { formatError } from '../../utils/format-error'

// The activity feed is derived entirely from on-chain transaction history —
// there is no database behind it. See use-activity-query.ts.
export default function ActivityScreen() {
  const { account } = useMobileWallet()
  const { getExplorerUrl } = useNetwork()
  const activityQuery = useActivityQuery()
  const friendsQuery = useFriendsQuery()

  return (
    <View className="flex-1 bg-white dark:bg-black px-4">
      <FlatList
        contentContainerClassName="gap-3 py-4"
        data={activityQuery.data ?? []}
        keyExtractor={(item) => `${item.signature}-${item.instructionIndex}`}
        refreshControl={
          <RefreshControl refreshing={activityQuery.isRefetching} onRefresh={() => void activityQuery.refetch()} />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => void openURL(getExplorerUrl(`tx/${item.signature}`))}
            className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
          >
            <Text className="text-gray-800 dark:text-white">
              {describeActivity(item, friendsQuery.data, account?.address)}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : 'Pending'} ·{' '}
              {ellipsify(item.signature)}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 dark:text-gray-500 text-center py-8">
            {activityQuery.isLoading
              ? 'Loading activity…'
              : activityQuery.error
                ? formatError(activityQuery.error)
                : 'No activity yet. It appears here as your pots are used.'}
          </Text>
        }
      />
    </View>
  )
}

function describeActivity(item: ActivityItem, friends: Friend[] | undefined, viewer?: string): string {
  const who = (address?: string) =>
    !address ? 'Someone' : address === viewer ? 'You' : (findFriendLabel(friends, address) ?? ellipsify(address))
  switch (item.type) {
    case 'add-contributor':
      return `➕ ${who(item.actor)} added ${who(item.newContributor)} to ${item.potName}`
    case 'contribute':
      return `💰 ${who(item.actor)} contributed ${item.amount ? formatSol(item.amount) : ''} to ${item.potName}`
    case 'create-pot':
      return `🍯 ${who(item.actor)} created ${item.potName}`
    case 'release-funds':
      return `🎉 ${who(item.actor)} released ${item.potName} to ${who(item.recipient)}`
    case 'sign-release':
      return `✍️ ${who(item.actor)} signed the release of ${item.potName}`
  }
}
