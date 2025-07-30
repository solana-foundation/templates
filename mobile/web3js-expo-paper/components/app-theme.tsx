import {
  DarkTheme as reactNavigationDark,
  DefaultTheme as reactNavigationLight,
  ThemeProvider,
} from '@react-navigation/native'
import { PropsWithChildren } from 'react'
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/use-color-scheme'
import merge from 'deepmerge'

const { LightTheme, DarkTheme } = adaptNavigationTheme({ reactNavigationLight, reactNavigationDark })

const AppThemeLight = merge(MD3LightTheme, LightTheme)
const AppThemeDark = merge(MD3DarkTheme, DarkTheme)

export function useAppTheme() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const theme = isDark ? AppThemeDark : AppThemeLight
  return {
    colorScheme,
    isDark,
    theme,
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  }
}

export function AppTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme()

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>{children}</ThemeProvider>
    </PaperProvider>
  )
}
