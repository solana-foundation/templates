import Ionicons from '@expo/vector-icons/Ionicons'
import { cn } from 'heroui-native/utils'
import type { ComponentProps } from 'react'
import { Pressable, Text, View } from 'react-native'

import type { Theme } from '@/features/shell/data-access/use-theme'
import { setTheme, useTheme } from '@/features/shell/data-access/use-theme'

type ThemeIcon = ComponentProps<typeof Ionicons>['name']

const themeIcons: Record<Theme, ThemeIcon> = {
  dark: 'moon-outline',
  light: 'sunny-outline',
  system: 'phone-portrait-outline',
}

export function ShellUiThemeSwitcher() {
  const { activeTheme, themes } = useTheme()

  return (
    <View className="flex-row rounded-2xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-950">
      {themes.map((theme) => {
        const isSelected = activeTheme === theme.name

        return (
          <ThemeSwitcherItem
            icon={themeIcons[theme.name]}
            isSelected={isSelected}
            key={theme.name}
            label={theme.label}
            onPress={() => setTheme(theme.name)}
          />
        )
      })}
    </View>
  )
}

function ThemeSwitcherItem({
  icon,
  isSelected,
  label,
  onPress,
}: {
  icon: ThemeIcon
  isSelected: boolean
  label: string
  onPress(): void
}) {
  const color = isSelected ? '#208AEF' : '#737373'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={cn(
        'min-h-16 flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2',
        isSelected ? 'bg-white dark:bg-neutral-900' : 'bg-transparent',
      )}
      onPress={onPress}
    >
      <Ionicons color={color} name={icon} size={22} />
      <Text
        className={cn(
          'text-sm font-semibold',
          isSelected ? 'text-blue-600 dark:text-blue-300' : 'text-neutral-600 dark:text-neutral-300',
        )}
      >
        {label}
      </Text>
    </Pressable>
  )
}
