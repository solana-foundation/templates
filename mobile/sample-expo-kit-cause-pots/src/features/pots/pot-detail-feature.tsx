import { Currency, type Pot } from '@project/anchor'
import type { Address, Signature } from '@solana/kit'
import { openURL } from 'expo-linking'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppAddressLink } from '../../components/app-address-link'
import { AppButton } from '../../components/app-button'
import { AppKeyboardView } from '../../components/app-keyboard-view'
import { AppTextInput } from '../../components/app-text-input'
import { formatAmount, parseAmountInput, solToLamports } from '../../utils/currency'
import { ellipsify } from '../../utils/ellipsify'
import { formatError } from '../../utils/format-error'
import { resolveAddressOrDomain } from '../domains/resolve-address-or-domain'
import { SkrNameOrAddress } from '../domains/skr-name-or-address'
import { useFriendsQuery } from '../friends/data-access/use-friends'
import { useNetwork } from '../network/use-network'
import { useSolPriceQuery } from '../price/data-access/use-sol-price-query'
import { usePotContributorsQuery } from './data-access/use-pot-contributors-query'
import { usePotProgram } from './data-access/use-pot-program'
import { getPotCategory } from './pot-category'
import { formatTimestamp, getPotStatus } from './pot-status'
import { PotUiContributors } from './ui/pot-ui-contributors'

export function PotDetailFeature({ pot, potAddress, viewer }: { pot: Pot; potAddress: Address; viewer: Address }) {
  const { getExplorerUrl } = useNetwork()
  const solPriceQuery = useSolPriceQuery()
  const contributorsQuery = usePotContributorsQuery({ contributors: [...pot.contributors], pot: potAddress })
  const { addContributorMutation, contributeMutation, releaseFundsMutation, signReleaseMutation } = usePotProgram()
  const [lastSignature, setLastSignature] = useState<Signature | undefined>()
  const [error, setError] = useState<string | null>(null)

  const category = getPotCategory(pot.category)
  const status = getPotStatus(pot)
  const progress = Math.min(1, Number(pot.totalContributed) / Number(pot.targetAmount))
  const isAuthority = viewer === pot.authority
  const isContributor = pot.contributors.includes(viewer)
  const hasSigned = pot.signatures.includes(viewer)
  const hasThreshold = pot.signatures.length >= pot.signersRequired
  const isBusy =
    addContributorMutation.isPending ||
    contributeMutation.isPending ||
    releaseFundsMutation.isPending ||
    signReleaseMutation.isPending

  function run<T>(mutate: (onHandlers: { onError: (e: unknown) => void; onSuccess: (s: T) => void }) => void) {
    setError(null)
    mutate({
      onError: (mutationError) => setError(formatError(mutationError)),
      onSuccess: (transactionSignature) => setLastSignature(transactionSignature as Signature),
    })
  }

  return (
    <AppKeyboardView>
      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentContainerClassName="gap-4 p-4 pb-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Summary */}
        <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {category.emoji} {pot.name}
          </Text>
          {pot.description ? <Text className="text-gray-600 dark:text-gray-400 mb-2">{pot.description}</Text> : null}
          <View className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full my-2">
            <View className="h-2 bg-blue-600 rounded-full" style={{ width: `${progress * 100}%` }} />
          </View>
          <Text className="text-gray-800 dark:text-white font-semibold mb-2">
            {formatAmount(pot.totalContributed, pot.currency, solPriceQuery.data)} of{' '}
            {formatAmount(pot.targetAmount, pot.currency, solPriceQuery.data)}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {status === 'locked'
              ? `🔒 Locked until ${formatTimestamp(pot.unlockTimestamp)}`
              : status === 'unlocked'
                ? `🔓 Unlocked — ${pot.signatures.length}/${pot.signersRequired} release signatures`
                : `✅ Released${pot.recipient.__option === 'Some' ? ` to ${ellipsify(pot.recipient.value)}` : ''}`}
          </Text>
          <View className="gap-1">
            <AppAddressLink address={potAddress} label="Pot" />
            <AppAddressLink address={pot.vault} label="Vault" />
          </View>
        </View>

        {/* Actions */}
        {status !== 'released' ? (
          <PotUiContribute
            currency={pot.currency}
            disabled={isBusy}
            onContribute={(amount) =>
              run<Signature>((handlers) => contributeMutation.mutate({ amount, pot: potAddress }, handlers))
            }
          />
        ) : null}

        {status === 'unlocked' && isContributor && !hasSigned ? (
          <AppButton
            disabled={isBusy}
            label={signReleaseMutation.isPending ? 'Working...' : 'Sign Release'}
            onPress={() => run<Signature>((handlers) => signReleaseMutation.mutate({ pot: potAddress }, handlers))}
            variant="success"
          />
        ) : null}

        {status === 'unlocked' && isAuthority && hasThreshold ? (
          <PotUiRelease
            disabled={isBusy}
            onRelease={(recipient) =>
              run<Signature>((handlers) => releaseFundsMutation.mutate({ pot: potAddress, recipient }, handlers))
            }
          />
        ) : null}

        {status !== 'released' && isAuthority ? (
          <PotUiAddContributor
            contributors={[...pot.contributors]}
            disabled={isBusy}
            onAdd={(newContributor) =>
              run<Signature>((handlers) => addContributorMutation.mutate({ newContributor, pot: potAddress }, handlers))
            }
          />
        ) : null}

        {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
        {lastSignature ? (
          <Pressable onPress={() => void openURL(getExplorerUrl(`tx/${lastSignature}`))}>
            <Text className="text-blue-500 text-center underline">View transaction in Explorer</Text>
          </Pressable>
        ) : null}

        <PotUiContributors
          authority={pot.authority}
          contributors={contributorsQuery.data ?? []}
          signatures={[...pot.signatures]}
          viewer={viewer}
        />
      </ScrollView>
    </AppKeyboardView>
  )
}

// Contribution input in the pot's display currency; a USD amount converts to
// SOL at the current rate before it goes on chain.
function PotUiContribute({
  currency,
  disabled,
  onContribute,
}: {
  currency: Currency
  disabled: boolean
  onContribute: (amount: bigint) => void
}) {
  const solPriceQuery = useSolPriceQuery()
  const [input, setInput] = useState('')

  const amount = parseAmountInput(input)
  const amountSol = currency === Currency.Usd && amount ? amount / (solPriceQuery.data ?? 0) : amount
  const isValid = !!amountSol && Number.isFinite(amountSol) && amountSol > 0

  return (
    <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4 gap-3">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">Contribute</Text>
      <AppTextInput
        keyboardType="decimal-pad"
        onChangeText={setInput}
        placeholder={currency === Currency.Usd ? 'Amount in USD' : 'Amount in SOL'}
        value={input}
      />
      {currency === Currency.Usd && isValid ? (
        <Text className="text-xs text-gray-500 dark:text-gray-500">≈ {amountSol.toFixed(4)} SOL</Text>
      ) : null}
      <AppButton
        disabled={disabled || !isValid}
        label="Contribute"
        onPress={() => {
          if (isValid) {
            onContribute(solToLamports(amountSol))
            setInput('')
          }
        }}
      />
    </View>
  )
}

// Release sends the whole vault to one recipient: yourself, a friend, or any
// address or .skr domain.
function PotUiRelease({ disabled, onRelease }: { disabled: boolean; onRelease: (recipient: Address) => void }) {
  const friendsQuery = useFriendsQuery()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)

  async function release() {
    setError(null)
    setIsResolving(true)
    try {
      onRelease(await resolveAddressOrDomain(input))
    } catch (resolveError) {
      setError(formatError(resolveError))
    } finally {
      setIsResolving(false)
    }
  }

  return (
    <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4 gap-3">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">Release Funds</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        Enough contributors signed. Send the vault balance to a recipient.
      </Text>
      <AppTextInput onChangeText={setInput} placeholder="Wallet address or name.skr" value={input} />
      {friendsQuery.data?.length ? (
        <View className="flex-row flex-wrap gap-2">
          {friendsQuery.data.map((friend) => (
            <Pressable
              key={friend.address}
              onPress={() => setInput(friend.address)}
              className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800"
            >
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                {friend.displayName ?? friend.domain ?? <SkrNameOrAddress address={friend.address} />}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <AppButton
        disabled={disabled || isResolving || input.trim().length === 0}
        label={isResolving ? 'Working...' : 'Release'}
        onPress={() => void release()}
        variant="danger"
      />
      {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  )
}

function PotUiAddContributor({
  contributors,
  disabled,
  onAdd,
}: {
  contributors: Address[]
  disabled: boolean
  onAdd: (contributor: Address) => void
}) {
  const friendsQuery = useFriendsQuery()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)

  const candidates = friendsQuery.data?.filter((friend) => !contributors.includes(friend.address)) ?? []

  async function add() {
    setError(null)
    setIsResolving(true)
    try {
      const resolved = await resolveAddressOrDomain(input)
      if (contributors.includes(resolved)) {
        throw new Error('This wallet is already a contributor.')
      }
      onAdd(resolved)
      setInput('')
    } catch (resolveError) {
      setError(formatError(resolveError))
    } finally {
      setIsResolving(false)
    }
  }

  return (
    <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4 gap-3">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">Add Contributor</Text>
      <AppTextInput onChangeText={setInput} placeholder="Wallet address or name.skr" value={input} />
      {candidates.length ? (
        <View className="flex-row flex-wrap gap-2">
          {candidates.map((friend) => (
            <Pressable
              key={friend.address}
              onPress={() => setInput(friend.address)}
              className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800"
            >
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                {friend.displayName ?? friend.domain ?? <SkrNameOrAddress address={friend.address} />}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <AppButton
        disabled={disabled || isResolving || input.trim().length === 0}
        label={isResolving ? 'Working...' : 'Add Contributor'}
        onPress={() => void add()}
      />
      {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  )
}
