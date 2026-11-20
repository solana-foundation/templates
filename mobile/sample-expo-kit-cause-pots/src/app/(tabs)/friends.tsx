import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { AppAddressLink } from '../../components/app-address-link'
import { AppButton } from '../../components/app-button'
import { AppTextInput } from '../../components/app-text-input'
import { SkrNameOrAddress } from '../../features/domains/skr-name-or-address'
import {
  useAddFriendMutation,
  useFriendsQuery,
  useRemoveFriendMutation,
} from '../../features/friends/data-access/use-friends'
import { formatError } from '../../utils/format-error'

// The friends list is a local address book for picking contributors and
// recipients. Friends can be added by wallet address or .skr domain, which
// resolves to the owning wallet on mainnet.
export default function FriendsScreen() {
  const friendsQuery = useFriendsQuery()
  const addFriendMutation = useAddFriendMutation()
  const removeFriendMutation = useRemoveFriendMutation()
  const [addressOrDomain, setAddressOrDomain] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function onAdd() {
    setError(null)
    addFriendMutation.mutate(
      { addressOrDomain, displayName: displayName.trim() || undefined },
      {
        onError: (mutationError) => setError(formatError(mutationError)),
        onSuccess: () => {
          setAddressOrDomain('')
          setDisplayName('')
        },
      },
    )
  }

  return (
    <View className="flex-1 bg-white dark:bg-black px-4 pt-4">
      <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4 gap-3 mb-4">
        <AppTextInput
          label="Wallet address or .skr domain"
          onChangeText={setAddressOrDomain}
          placeholder="alice.skr"
          value={addressOrDomain}
        />
        <AppTextInput
          label="Display name (optional)"
          onChangeText={setDisplayName}
          placeholder="Alice"
          value={displayName}
        />
        <AppButton
          disabled={addFriendMutation.isPending || addressOrDomain.trim().length === 0}
          label={addFriendMutation.isPending ? 'Working...' : 'Add Friend'}
          onPress={onAdd}
        />
        {error ? <Text className="text-red-500">{error}</Text> : null}
      </View>
      <FlatList
        contentContainerClassName="gap-3 pb-4"
        data={friendsQuery.data ?? []}
        keyExtractor={(friend) => friend.address}
        renderItem={({ item }) => (
          <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex-row items-center justify-between">
            <View className="shrink gap-1">
              <Text className="text-gray-800 dark:text-white font-semibold">
                {item.displayName ?? item.domain ?? 'Friend'}
                {item.displayName && item.domain ? (
                  <Text className="text-gray-500 dark:text-gray-500"> · {item.domain}</Text>
                ) : null}
              </Text>
              <AppAddressLink
                address={item.address}
                label="Wallet"
                name={<SkrNameOrAddress address={item.address} />}
              />
            </View>
            <Pressable onPress={() => removeFriendMutation.mutate(item.address)} hitSlop={8}>
              <Text className="text-base">🗑️</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 dark:text-gray-500 text-center py-8">
            {friendsQuery.isLoading ? 'Loading…' : 'No friends yet. Add one to invite them to a pot.'}
          </Text>
        }
      />
    </View>
  )
}
