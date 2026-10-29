import Ionicons from '@expo/vector-icons/Ionicons'
import { Link } from 'expo-router'
import { Card } from 'heroui-native/card'
import type { ComponentProps } from 'react'
import { Pressable, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'

type ToolIcon = ComponentProps<typeof Ionicons>['name']
type ToolItem = {
  description: string
  href: `/tools/${string}`
  icon: ToolIcon
  id: string
  summary: string
  title: string
}

const toolItems = [
  {
    description: 'Run the example wallet requests for signing in, signing messages, and sending transactions.',
    href: '/tools/wallet-actions',
    icon: 'wallet-outline',
    id: 'wallet-actions',
    summary: 'Wallet examples for signing in, signing messages, and sending transactions.',
    title: 'Wallet actions',
  },
] as const satisfies readonly ToolItem[]

export function ToolsFeatureEntry() {
  const { tintColor } = useTheme()

  return (
    <ShellUiPage>
      {toolItems.map((item) => (
        <Link asChild href={item.href} key={item.id}>
          <Pressable accessibilityRole="button">
            <Card className="gap-2 p-5">
              <View className="flex-row items-center gap-2">
                <Ionicons color={tintColor} name={item.icon} size={22} />
                <Card.Title className="flex-1 text-xl font-bold">{item.title}</Card.Title>
                <Ionicons color={tintColor} name="chevron-forward" size={18} />
              </View>
              <Card.Description className="leading-relaxed">{item.description}</Card.Description>
            </Card>
          </Pressable>
        </Link>
      ))}
    </ShellUiPage>
  )
}
