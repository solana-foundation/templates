import type { SolanaClusterId } from '@wallet-ui/react-native-kit'
import { useRouter } from 'expo-router'
import type { Href } from 'expo-router'
import { Select } from 'heroui-native/select'
import { View } from 'react-native'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'

const CLUSTER_SETTINGS_VALUE = 'cluster-settings'
const SETTINGS_CLUSTER_HREF = '/settings/cluster' as Href

export function ClusterUiSelect({
  contentWidth = 'trigger',
  triggerClassName = 'w-full',
}: {
  contentWidth?: 'trigger' | number
  triggerClassName?: string
}) {
  const { cluster: activeCluster, clusters, setCluster } = useAppCluster()
  const router = useRouter()

  return (
    <Select
      onValueChange={(option) => {
        if (option) {
          if (option.value === CLUSTER_SETTINGS_VALUE) {
            router.push(SETTINGS_CLUSTER_HREF)
            return
          }

          const nextCluster = clusters.find((cluster) => cluster.id === option.value)
          if (!nextCluster?.isEnabled) {
            return
          }

          setCluster(option.value as SolanaClusterId)
        }
      }}
      value={{ label: activeCluster.label, value: activeCluster.id }}
    >
      <Select.Trigger className={triggerClassName}>
        <Select.Value placeholder="Select cluster" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content align="start" placement="bottom" presentation="popover" width={contentWidth}>
          <Select.ListLabel>Cluster</Select.ListLabel>
          {clusters.map((cluster) => (
            <Select.Item
              className={!cluster.isEnabled ? 'opacity-50' : undefined}
              disabled={!cluster.isEnabled}
              key={cluster.id}
              label={cluster.label}
              value={cluster.id}
            >
              <View className="flex-1 gap-1">
                <Select.ItemLabel className={!cluster.isEnabled ? 'text-muted' : undefined} />
                {cluster.url ? <Select.ItemDescription>{cluster.url}</Select.ItemDescription> : null}
              </View>
            </Select.Item>
          ))}
          <Select.Item label="Cluster settings" value={CLUSTER_SETTINGS_VALUE}>
            <View className="flex-1 gap-1">
              <Select.ItemLabel />
              <Select.ItemDescription>Manage clusters in Settings</Select.ItemDescription>
            </View>
          </Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select>
  )
}
