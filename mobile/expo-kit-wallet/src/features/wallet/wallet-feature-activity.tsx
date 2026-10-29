import Ionicons from '@expo/vector-icons/Ionicons'
import { getExplorerUrl, useMobileWallet } from '@wallet-ui/react-native-kit'
import type { Account } from '@wallet-ui/react-native-kit'
import * as Linking from 'expo-linking'
import { Button } from 'heroui-native/button'
import { Card } from 'heroui-native/card'
import { Chip } from 'heroui-native/chip'
import { Pressable, Text, View } from 'react-native'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { useGetTransactionSignatures } from '@/features/wallet/data-access/use-get-transaction-signatures'
import { WalletUiConnectButton } from '@/features/wallet/ui/wallet-ui-connect-button'
import { WalletUiStatusAlert } from '@/features/wallet/ui/wallet-ui-status-alert'
import { ellipsify } from '@/features/wallet/util/ellipsify'
import { formatError } from '@/features/wallet/util/format-error'

type WalletActivityGroup = {
  dateKey: string
  title: string
  transactions: WalletActivityTransaction[]
}

type WalletActivityTransaction = NonNullable<ReturnType<typeof useGetTransactionSignatures>['data']>[number]

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})

function formatDate(blockTime: WalletActivityTransaction['blockTime']) {
  if (blockTime === null) {
    return 'Unknown date'
  }

  return dateFormatter.format(new Date(Number(blockTime) * 1000))
}

function formatTime(blockTime: WalletActivityTransaction['blockTime']) {
  if (blockTime === null) {
    return 'Time unavailable'
  }

  return timeFormatter.format(new Date(Number(blockTime) * 1000))
}

function getDateKey(blockTime: WalletActivityTransaction['blockTime']) {
  if (blockTime === null) {
    return 'unknown'
  }

  return new Date(Number(blockTime) * 1000).toISOString().slice(0, 10)
}

function groupTransactionsByDate(transactions: readonly WalletActivityTransaction[]) {
  return transactions.reduce<WalletActivityGroup[]>((groups, transaction) => {
    const dateKey = getDateKey(transaction.blockTime)
    const lastGroup = groups[groups.length - 1]

    if (lastGroup?.dateKey === dateKey) {
      lastGroup.transactions.push(transaction)
      return groups
    }

    groups.push({
      dateKey,
      title: formatDate(transaction.blockTime),
      transactions: [transaction],
    })
    return groups
  }, [])
}

function getTransactionStatus(transaction: WalletActivityTransaction): {
  color: 'danger' | 'default' | 'success'
  label: string
} {
  if (transaction.err) {
    return { color: 'danger', label: 'Failed' }
  }

  if (transaction.confirmationStatus === 'finalized') {
    return { color: 'success', label: 'Success' }
  }

  return { color: 'default', label: transaction.confirmationStatus === 'confirmed' ? 'Confirmed' : 'Pending' }
}

export function WalletFeatureActivity() {
  const wallet = useMobileWallet()
  const { account, connect } = wallet

  return (
    <ShellUiPage>
      {account ? (
        <WalletFeatureActivityList account={account} />
      ) : (
        <WalletUiConnectButton connect={connect}>Connect Wallet</WalletUiConnectButton>
      )}
    </ShellUiPage>
  )
}

function WalletFeatureActivityList({ account }: { account: Account }) {
  const { cluster } = useAppCluster()
  const { tintColor } = useTheme()
  const activity = useGetTransactionSignatures(account.address)
  const transactions = activity.data
  const groups = groupTransactionsByDate(transactions ?? [])
  // A failed refetch keeps the last list, so say so rather than passing it off as current.
  const isStale = transactions !== undefined && activity.isError

  return (
    <View className="gap-5">
      <Card className="w-full gap-3 p-4">
        <Card.Body className="gap-3">
          <View className="gap-1">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons color={tintColor} name="time-outline" size={22} />
                <Card.Title className="text-xl font-bold">Activity</Card.Title>
              </View>
              <Button
                accessibilityLabel="Refresh activity"
                isDisabled={activity.isFetching}
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => void activity.refetch()}
              >
                <Ionicons color={tintColor} name={activity.isFetching ? 'sync-outline' : 'refresh-outline'} size={20} />
              </Button>
            </View>
            <Card.Description className="leading-relaxed">
              Latest confirmed transactions on {cluster.label}.
            </Card.Description>
          </View>
          {activity.isError ? (
            <WalletUiStatusAlert description={formatError(activity.error)} status="danger" title="Activity error" />
          ) : null}
        </Card.Body>
      </Card>

      {activity.isLoading ? (
        <Text className="text-sm text-neutral-600 dark:text-neutral-300">Loading activity...</Text>
      ) : transactions === undefined ? (
        // Without this branch a failed read falls through to the empty state and claims there is
        // no activity, which is indistinguishable from a genuinely empty history.
        <Text className="text-sm text-neutral-600 dark:text-neutral-300">Unable to load activity.</Text>
      ) : groups.length ? (
        <View className="gap-5">
          {isStale ? (
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">Last known activity; refresh failed</Text>
          ) : null}
          {groups.map((group) => (
            <View className="gap-3" key={group.dateKey}>
              <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                {group.title}
              </Text>
              <Card className="w-full gap-3 p-4">
                <Card.Body className="gap-4">
                  {group.transactions.map((transaction) => {
                    const explorerUrl = getExplorerUrl({
                      network: {
                        id: cluster.id,
                        url: cluster.url,
                      },
                      path: `/tx/${transaction.signature}`,
                      provider: 'solana',
                    })
                    const transactionStatus = getTransactionStatus(transaction)

                    return (
                      <View className="gap-2" key={transaction.signature}>
                        <View className="flex-row items-start justify-between gap-3">
                          <View className="flex-1 flex-row items-center gap-2">
                            <Pressable
                              accessibilityHint="Opens this transaction in Solana Explorer."
                              accessibilityLabel={`Open transaction ${transaction.signature}`}
                              accessibilityRole="link"
                              onPress={() => void Linking.openURL(explorerUrl)}
                            >
                              <Text className="font-mono text-base font-semibold text-blue-600 underline dark:text-blue-400">
                                {ellipsify(transaction.signature)}
                              </Text>
                            </Pressable>
                            <Ionicons color={tintColor} name="open-outline" size={16} />
                          </View>
                          <Chip color={transactionStatus.color} size="sm" variant="soft">
                            {transactionStatus.label}
                          </Chip>
                        </View>
                        <View className="flex-row items-center justify-between gap-3">
                          <Text className="flex-1 text-sm text-neutral-600 dark:text-neutral-300">
                            Slot {transaction.slot.toLocaleString()}
                          </Text>
                          <Text className="text-right text-sm text-neutral-600 dark:text-neutral-300">
                            {formatTime(transaction.blockTime)}
                          </Text>
                        </View>
                      </View>
                    )
                  })}
                </Card.Body>
              </Card>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-sm text-neutral-600 dark:text-neutral-300">No recent activity found.</Text>
      )}
    </View>
  )
}
