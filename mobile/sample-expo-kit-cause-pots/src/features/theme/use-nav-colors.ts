import { useColorScheme } from 'react-native'

// Colors for the react-navigation chrome (headers, tab bar), matching the
// Tailwind palette the screens use. Navigation components take style objects
// instead of classNames, so the color scheme is applied here by hand.
export function useNavColors() {
  const isDark = useColorScheme() === 'dark'
  return {
    background: isDark ? '#000000' : '#ffffff',
    border: isDark ? '#1f2937' : '#e5e7eb',
    inactive: isDark ? '#9ca3af' : '#6b7280',
    text: isDark ? '#ffffff' : '#1f2937',
    tint: isDark ? '#3b82f6' : '#2563eb',
  }
}
