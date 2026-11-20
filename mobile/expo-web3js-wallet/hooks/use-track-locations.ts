import { UnknownOutputParams, useGlobalSearchParams, usePathname } from 'expo-router'
import { useEffect } from 'react'

// Hook to track the location for analytics
export function useTrackLocations(onChange: (pathname: string, params: UnknownOutputParams) => void) {
  const pathname = usePathname()
  const params = useGlobalSearchParams()
  useEffect(() => {
    onChange(pathname, params)
  }, [onChange, pathname, params])
}
