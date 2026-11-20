import Ionicons from '@expo/vector-icons/Ionicons'
import type { SolanaClusterId } from '@wallet-ui/react-native-kit'
import { Chip } from 'heroui-native/chip'
import { Description } from 'heroui-native/description'
import { Label } from 'heroui-native/label'
import { cn } from 'heroui-native/utils'
import { Pressable, View } from 'react-native'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'

export function AppClusterSwitcher({
  onSelectCluster,
  selectedClusterId,
}: {
  onSelectCluster?: (clusterId: SolanaClusterId) => void
  selectedClusterId?: SolanaClusterId
}) {
  const { cluster: activeCluster, clusters, setCluster } = useAppCluster()
  const selectedId = selectedClusterId ?? activeCluster.id

  return (
    <View className="gap-3">
      {clusters.map((cluster) => {
        const isActive = activeCluster.id === cluster.id
        const isSelected = selectedId === cluster.id

        return (
          <Pressable
            accessibilityRole="button"
            className={cn(
              'w-full flex-row items-center justify-between gap-3 rounded-2xl border px-4 py-3',
              isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black',
            )}
            key={cluster.id}
            onPress={() => {
              onSelectCluster?.(cluster.id)

              if (cluster.isEnabled) {
                setCluster(cluster.id)
              }
            }}
          >
            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-2">
                <Label
                  className={cn(
                    'text-base font-semibold',
                    isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-900 dark:text-white',
                  )}
                >
                  {cluster.label}
                </Label>
                {isActive ? <Ionicons color="#22C55E" name="checkmark-circle" size={16} /> : null}
              </View>
              <Description>{cluster.url || 'No RPC URL configured.'}</Description>
            </View>
            <ClusterStatusChip isActive={isActive} isEnabled={cluster.isEnabled} />
          </Pressable>
        )
      })}
    </View>
  )
}

function ClusterStatusChip({ isActive, isEnabled }: { isActive: boolean; isEnabled: boolean }) {
  if (isActive) {
    return (
      <Chip color="success" size="sm" variant="soft">
        Active
      </Chip>
    )
  }

  if (isEnabled) {
    return (
      <Chip color="default" size="sm" variant="soft">
        Ready
      </Chip>
    )
  }

  return (
    <Chip color="warning" size="sm" variant="soft">
      Disabled
    </Chip>
  )
}
