import { useThemeColor } from '@/hooks/use-theme-color'

export function useWalletUiTheme() {
  const backgroundColor = useThemeColor({}, 'background')
  const listBackgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')
  return {
    backgroundColor,
    listBackgroundColor,
    borderColor,
    textColor,
  }
}
