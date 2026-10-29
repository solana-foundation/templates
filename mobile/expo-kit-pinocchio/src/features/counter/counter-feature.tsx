import { openURL } from 'expo-linking'
import { Pressable, Text, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { AppAddressLink } from '../../components/app-address-link'
import { formatError } from '../../utils/format-error'
import { useAirdropMutation } from '../account/data-access/use-airdrop-mutation'
import { useBalanceQuery } from '../account/data-access/use-balance-query'
import { useNetwork } from '../network/use-network'
import { useCounterQuery } from './data-access/use-counter-query'
import { useCounterProgram } from './data-access/use-counter-program'

export function CounterFeature() {
  const { account } = useMobileWallet()
  const { chain, getExplorerUrl, getFaucetUrl } = useNetwork()
  const airdropMutation = useAirdropMutation()
  const balanceQuery = useBalanceQuery()
  const counterQuery = useCounterQuery()
  const { incrementMutation, initializeMutation } = useCounterProgram()

  const count = counterQuery.data?.count
  const counterAddress = counterQuery.data?.address
  const isBusy =
    airdropMutation.isPending || counterQuery.isFetching || incrementMutation.isPending || initializeMutation.isPending
  const error = airdropMutation.error ?? counterQuery.error ?? incrementMutation.error ?? initializeMutation.error
  const mutation = count === null ? initializeMutation : incrementMutation
  const lastSignature = incrementMutation.data ?? initializeMutation.data
  const label = counterQuery.isError ? 'Retry' : count === null ? 'Initialize Counter' : 'Increment Counter'
  const hasNoSol = balanceQuery.data === 0n
  const isLocalnet = chain === 'solana:localnet'

  return (
    <View className="w-full max-w-sm items-center border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Counter: {counterQuery.isLoading ? '…' : count === null ? 'not initialized' : (count?.toString() ?? '?')}
      </Text>
      {typeof count === 'bigint' && counterAddress ? (
        <View className="mb-4">
          <AppAddressLink address={counterAddress} label="Counter" />
        </View>
      ) : null}
      <Pressable
        disabled={isBusy}
        onPress={() => (counterQuery.isError ? void counterQuery.refetch() : mutation.mutate())}
        className={`bg-green-600 px-6 py-3 rounded-xl active:bg-green-700 ${isBusy ? 'opacity-50' : ''}`}
      >
        <Text className="text-white font-bold">{isBusy ? 'Working...' : label}</Text>
      </Pressable>
      {hasNoSol && isLocalnet ? (
        <Pressable
          disabled={isBusy}
          onPress={() => airdropMutation.mutate()}
          className={`bg-blue-600 px-6 py-3 rounded-xl active:bg-blue-700 mt-3 ${isBusy ? 'opacity-50' : ''}`}
        >
          <Text className="text-white font-bold">{airdropMutation.isPending ? 'Working...' : 'Request Airdrop'}</Text>
        </Pressable>
      ) : null}
      {hasNoSol && !isLocalnet ? (
        <Pressable onPress={() => void openURL(getFaucetUrl(account?.address.toString()))}>
          <Text className="text-amber-600 dark:text-amber-400 mt-3 text-center">
            Your wallet has no SOL to pay for transactions.{'\n'}
            Get some at <Text className="underline">faucet.solana.com</Text>
          </Text>
        </Pressable>
      ) : null}
      {lastSignature ? (
        <Pressable onPress={() => void openURL(getExplorerUrl(`tx/${lastSignature}`))}>
          <Text className="text-blue-500 mt-3 underline">View transaction in Explorer</Text>
        </Pressable>
      ) : null}
      {error ? <Text className="text-red-500 mt-3 text-center max-w-sm">{formatError(error)}</Text> : null}
    </View>
  )
}
