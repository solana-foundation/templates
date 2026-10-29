import merge from 'deepmerge'
import { DarkTheme as navigationDark, DefaultTheme as navigationLight, ThemeProvider } from 'expo-router'
import { PropsWithChildren } from 'react'
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/use-color-scheme'

// Expo Router types navigation colors as `ColorValue`, while Paper's adapter takes the plain
// strings they are at runtime.
type PaperNavigationTheme = Parameters<typeof adaptNavigationTheme>[0]['reactNavigationLight']

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: navigationDark as PaperNavigationTheme,
  reactNavigationLight: navigationLight as PaperNavigationTheme,
})

// Paper themes carry an MD3 typescale, so navigation keeps its own font styles.
const NavigationThemeLight = { ...LightTheme, fonts: navigationLight.fonts }
const NavigationThemeDark = { ...DarkTheme, fonts: navigationDark.fonts }

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
  const { isDark, theme } = useAppTheme()

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={isDark ? NavigationThemeDark : NavigationThemeLight}>{children}</ThemeProvider>
    </PaperProvider>
  )
}
