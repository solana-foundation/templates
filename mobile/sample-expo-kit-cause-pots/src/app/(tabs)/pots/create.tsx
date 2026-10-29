import { Currency } from '@project/anchor'
import { getUtf8Encoder, type Address } from '@solana/kit'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppButton } from '../../../components/app-button'
import { AppKeyboardView } from '../../../components/app-keyboard-view'
import { AppTextInput } from '../../../components/app-text-input'
import { useFriendsQuery } from '../../../features/friends/data-access/use-friends'
import { usePotProgram } from '../../../features/pots/data-access/use-pot-program'
import { POT_CATEGORIES } from '../../../features/pots/pot-category'
import { useSolPriceQuery } from '../../../features/price/data-access/use-sol-price-query'
import { parseAmountInput, solToLamports } from '../../../utils/currency'
import { ellipsify } from '../../../utils/ellipsify'
import { formatError } from '../../../utils/format-error'

// Mirrors the program's limits, which measure name and description in UTF-8 bytes.
const MAX_DESCRIPTION_BYTES = 200
const MAX_NAME_BYTES = 32
// Each friend adds an instruction to the create transaction; 15 is the most that fits at the longest
// name and description. More can be added from the pot afterwards.
const MAX_FRIENDS_AT_CREATION = 15

function byteLength(value: string): number {
  return getUtf8Encoder().encode(value).length
}

export default function CreatePotScreen() {
  const router = useRouter()
  const { account } = useMobileWallet()
  const friendsQuery = useFriendsQuery()
  const solPriceQuery = useSolPriceQuery()
  const { createPotMutation } = usePotProgram()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(POT_CATEGORIES[0].category)
  const [currency, setCurrency] = useState(Currency.Sol)
  const [target, setTarget] = useState('')
  const [unlockDays, setUnlockDays] = useState('30')
  const [signersRequired, setSignersRequired] = useState('1')
  const [contributors, setContributors] = useState<Address[]>([])
  const [error, setError] = useState<string | null>(null)
  // Captured once on mount; only used to preview the unlock date.
  const [now] = useState(() => Date.now())

  const targetAmount = parseAmountInput(target)
  // Amounts on chain are always SOL. A USD target is converted at the current
  // rate when the pot is created.
  const targetSol = currency === Currency.Usd && targetAmount ? targetAmount / (solPriceQuery.data ?? 0) : targetAmount
  const days = Number.parseInt(unlockDays, 10)
  const signers = Number.parseInt(signersRequired, 10)
  const unlockDate = new Date(now + (Number.isFinite(days) ? days : 0) * 86_400_000)
  // The creator is already a contributor, and adding them again fails the whole transaction. A saved
  // friend can be the connected wallet, for example after switching wallets.
  const friends = friendsQuery.data?.filter((friend) => friend.address !== account?.address)
  const selected = contributors.filter((address) => address !== account?.address)
  const isContributorLimitReached = selected.length >= MAX_FRIENDS_AT_CREATION
  const nameBytes = byteLength(name.trim())
  const descriptionBytes = byteLength(description.trim())
  const isValid =
    nameBytes > 0 &&
    nameBytes <= MAX_NAME_BYTES &&
    descriptionBytes <= MAX_DESCRIPTION_BYTES &&
    !!targetSol &&
    Number.isFinite(targetSol) &&
    targetSol > 0 &&
    Number.isInteger(days) &&
    days >= 0 &&
    Number.isInteger(signers) &&
    signers > 0 &&
    signers <= selected.length + 1 &&
    selected.length <= MAX_FRIENDS_AT_CREATION

  function toggleContributor(address: Address) {
    setContributors((current) => {
      if (current.includes(address)) {
        return current.filter((entry) => entry !== address)
      }
      return current.length >= MAX_FRIENDS_AT_CREATION ? current : [...current, address]
    })
  }

  function onCreate() {
    if (!isValid || !targetSol) {
      return
    }
    setError(null)
    createPotMutation.mutate(
      {
        category,
        contributors: selected,
        currency,
        description: description.trim(),
        name: name.trim(),
        signersRequired: signers,
        targetAmount: solToLamports(targetSol),
        unlockDays: BigInt(days),
      },
      {
        onError: (mutationError) => setError(formatError(mutationError)),
        onSuccess: ({ pot }) => router.replace({ params: { pot }, pathname: '/(tabs)/pots/[pot]' }),
      },
    )
  }

  return (
    <AppKeyboardView>
      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentContainerClassName="gap-4 p-4 pb-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1">
          <AppTextInput label="Name" onChangeText={setName} placeholder="Vacation Fund" value={name} />
          {nameBytes > MAX_NAME_BYTES ? (
            <Text className="text-xs text-red-500">
              Too long: {nameBytes} of {MAX_NAME_BYTES} bytes. Emoji and accented letters take more than one.
            </Text>
          ) : null}
        </View>
        <View className="gap-1">
          <AppTextInput
            label="Description"
            multiline
            onChangeText={setDescription}
            placeholder="What are you saving for?"
            value={description}
          />
          {descriptionBytes > MAX_DESCRIPTION_BYTES ? (
            <Text className="text-xs text-red-500">
              Too long: {descriptionBytes} of {MAX_DESCRIPTION_BYTES} bytes. Emoji and accented letters take more than
              one.
            </Text>
          ) : null}
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {POT_CATEGORIES.map((entry) => {
              const isSelected = entry.category === category
              return (
                <Pressable
                  key={entry.label}
                  onPress={() => setCategory(entry.category)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Text className={isSelected ? 'text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                    {entry.emoji} {entry.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Display currency</Text>
          <View className="flex-row gap-2">
            {[
              { label: 'SOL', value: Currency.Sol },
              { label: 'USD', value: Currency.Usd },
            ].map((entry) => {
              const isSelected = entry.value === currency
              return (
                <Pressable
                  key={entry.label}
                  onPress={() => setCurrency(entry.value)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Text className={isSelected ? 'text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                    {entry.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
          <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Contributions always move SOL on chain; USD only changes how amounts are shown.
          </Text>
        </View>

        <View className="gap-1">
          <AppTextInput
            keyboardType="decimal-pad"
            label={`Target amount (${currency === Currency.Usd ? 'USD' : 'SOL'})`}
            onChangeText={setTarget}
            placeholder={currency === Currency.Usd ? '100' : '1.5'}
            value={target}
          />
          {currency === Currency.Usd && targetSol && Number.isFinite(targetSol) ? (
            <Text className="text-xs text-gray-500 dark:text-gray-500">≈ {targetSol.toFixed(4)} SOL</Text>
          ) : null}
        </View>

        <View className="gap-1">
          <AppTextInput
            keyboardType="number-pad"
            label="Unlock in (days)"
            onChangeText={setUnlockDays}
            placeholder="30"
            value={unlockDays}
          />
          <Text className="text-xs text-gray-500 dark:text-gray-500">
            The pot stays locked until {unlockDate.toLocaleDateString()}. The unlock time is set by the cluster clock
            when the pot is created.
          </Text>
        </View>

        <AppTextInput
          keyboardType="number-pad"
          label="Signatures required to release"
          onChangeText={setSignersRequired}
          placeholder="1"
          value={signersRequired}
        />

        <View>
          <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Contributors</Text>
          {friends?.length ? (
            <View className="flex-row flex-wrap gap-2">
              {friends.map((friend) => {
                const isSelected = selected.includes(friend.address)
                return (
                  <Pressable
                    key={friend.address}
                    disabled={!isSelected && isContributorLimitReached}
                    onPress={() => toggleContributor(friend.address)}
                    className={`px-4 py-2 rounded-full border ${
                      isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-200 dark:border-gray-800'
                    } ${!isSelected && isContributorLimitReached ? 'opacity-40' : ''}`}
                  >
                    <Text className={isSelected ? 'text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                      {friend.displayName ?? friend.domain ?? ellipsify(friend.address)}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          ) : (
            <Text className="text-gray-500 dark:text-gray-500">
              You are the first contributor. Add friends in the Friends tab to invite them here.
            </Text>
          )}
          {isContributorLimitReached ? (
            <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              That is the most friends one transaction can add. Add more from the pot after creating it.
            </Text>
          ) : null}
        </View>

        <AppButton
          disabled={!isValid || createPotMutation.isPending}
          label={createPotMutation.isPending ? 'Working...' : 'Create Pot'}
          onPress={onCreate}
        />
        {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
      </ScrollView>
    </AppKeyboardView>
  )
}
