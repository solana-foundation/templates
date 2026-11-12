import { useClient } from '@solana/react'

import type { AppClient } from './create-solana-client'

/**
 * Reads the client published by `ClusterProvider`, already typed as {@link AppClient}.
 *
 * `useClient` is a pure type assertion with no runtime check, so naming the app's client type in
 * one place keeps every call site honest about which plugins are actually installed.
 */
export function useAppClient(): AppClient {
  return useClient<AppClient>()
}
