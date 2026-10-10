export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const url = new URL(path, 'https://native.local')
    const scheme = process.env.EXPO_PUBLIC_APP_SCHEME || 'phantomwallet'
    if (
      (url.protocol === `${scheme}:` && url.hostname === 'phantom-auth-callback') ||
      (url.hostname === 'native.local' && url.pathname === '/phantom-auth-callback')
    ) {
      // Phantom consumes the original linking event; this only controls navigation.
      return '/'
    }
  } catch {
    return path
  }
  return path
}
