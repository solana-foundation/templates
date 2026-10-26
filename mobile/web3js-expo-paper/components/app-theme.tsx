import {
  DarkTheme as reactNavigationDark,
  DefaultTheme as reactNavigationLight,
  type Theme,
  ThemeProvider,
} from 'expo-router'
import { PropsWithChildren } from 'react'
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/use-color-scheme'
import merge from 'deepmerge'

type NavigationTheme = Theme & { colors: Record<keyof Theme['colors'], string> }

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: reactNavigationLight as NavigationTheme,
  reactNavigationDark: reactNavigationDark as NavigationTheme,
})

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
