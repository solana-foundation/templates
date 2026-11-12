import { ScrollView, View } from 'react-native'
import type { PropsWithChildren } from 'react'
import { cn } from 'heroui-native/utils'

type ShellUiPageProps = PropsWithChildren<{
  centered?: boolean
  contentClassName?: string
  contentContainerClassName?: string
}>

export function ShellUiPage({ centered, contentClassName, contentContainerClassName, children }: ShellUiPageProps) {
  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-black"
      contentContainerStyle={{ flexGrow: 1 }}
      contentContainerClassName={cn(
        'gap-6 px-4 py-2',
        {
          'flex-grow justify-center ': centered,
        },
        contentContainerClassName,
      )}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className={cn('gap-6', contentClassName)}>{children}</View>
    </ScrollView>
  )
}
