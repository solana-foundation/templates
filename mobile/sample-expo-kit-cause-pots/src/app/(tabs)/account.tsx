import { openURL } from 'expo-linking'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { AppAddressLink } from '../../components/app-address-link'
import { AppButton } from '../../components/app-button'
import { AccountUiProgram } from '../../features/account/ui/account-ui-program'
import { useAirdropMutation } from '../../features/account/data-access/use-airdrop-mutation'
import { useBalanceQuery } from '../../features/account/data-access/use-balance-query'
import { useNetwork } from '../../features/network/use-network'
import { NetworkUiSelect } from '../../features/network/network-ui-select'
import { formatSol } from '../../utils/currency'
import { formatError } from '../../utils/format-error'

export default function AccountScreen() {
  const { account, disconnect } = useMobileWallet()
  const { chain, getFaucetUrl } = useNetwork()
  const airdropMutation = useAirdropMutation()
  const balanceQuery = useBalanceQuery()
  const [error, setError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const hasNoSol = balanceQuery.data === 0n
  const isLocalnet = chain === 'solana:localnet'

  async function onDisconnect() {
    setIsBusy(true)
    setError(null)
    try {
      await disconnect()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-black px-4 gap-4 pt-4">
      <View className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-4 gap-3">
        <Text className="text-3xl font-bold text-gray-800 dark:text-white">
          {balanceQuery.isLoading ? '…' : balanceQuery.data != null ? formatSol(balanceQuery.data) : '?'}
        </Text>
        {account ? <AppAddressLink address={account.address.toString()} label="Wallet" /> : null}
        <AccountUiProgram />
      </View>

      {hasNoSol && isLocalnet ? (
        <AppButton
          disabled={airdropMutation.isPending}
          label={airdropMutation.isPending ? 'Working...' : 'Request Airdrop'}
          onPress={() => airdropMutation.mutate()}
        />
      ) : null}
      {hasNoSol && !isLocalnet ? (
        <Pressable onPress={() => void openURL(getFaucetUrl(account?.address.toString()))}>
          <Text className="text-amber-600 dark:text-amber-400 text-center">
            Your wallet has no SOL to pay for transactions.{'\n'}
            Get some at <Text className="underline">faucet.solana.com</Text>
          </Text>
        </Pressable>
      ) : null}

      <View className="items-center gap-4">
        <NetworkUiSelect />
        <AppButton
          disabled={isBusy}
          label={isBusy ? 'Working...' : 'Disconnect Wallet'}
          onPress={() => void onDisconnect()}
          variant="danger"
        />
        {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
        {airdropMutation.error ? (
          <Text className="text-red-500 text-center">{formatError(airdropMutation.error)}</Text>
        ) : null}
      </View>
    </View>
  )
}
