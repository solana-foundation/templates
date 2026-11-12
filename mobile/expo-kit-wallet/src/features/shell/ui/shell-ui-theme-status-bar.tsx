import { StatusBar } from 'expo-status-bar'

import { useTheme } from '@/features/shell/data-access/use-theme'

export function ShellUiThemeStatusBar() {
  const { isLight } = useTheme()

  return <StatusBar animated style={isLight ? 'dark' : 'light'} />
}
