import { Link } from 'expo-router'
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native'
import { usePotsQuery } from '../../../features/pots/data-access/use-pots-query'
import { PotUiCard } from '../../../features/pots/ui/pot-ui-card'
import { formatError } from '../../../utils/format-error'

export default function PotsScreen() {
  const potsQuery = usePotsQuery()

  return (
    <View className="flex-1 bg-white dark:bg-black px-4">
      <FlatList
        contentContainerClassName="gap-3 py-4"
        data={potsQuery.data ?? []}
        keyExtractor={(pot) => pot.address}
        refreshControl={
          <RefreshControl refreshing={potsQuery.isRefetching} onRefresh={() => void potsQuery.refetch()} />
        }
        renderItem={({ item }) => (
          <Link asChild href={{ params: { pot: item.address }, pathname: '/(tabs)/pots/[pot]' }}>
            <Pressable>
              <PotUiCard pot={item} />
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">🍯</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
              {potsQuery.isLoading
                ? 'Loading pots…'
                : potsQuery.error
                  ? formatError(potsQuery.error)
                  : 'No pots yet. Create one to start saving together.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <Link asChild href="/(tabs)/pots/create">
            <Pressable className="bg-blue-600 px-6 py-3 rounded-xl active:bg-blue-700 items-center mt-2">
              <Text className="text-white font-bold">New Pot</Text>
            </Pressable>
          </Link>
        }
      />
    </View>
  )
}
