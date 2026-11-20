import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react-native'
import { Address, Instruction } from '@solana/kit'
import { ReactElement } from 'react'
import { vi } from 'vitest'

/** A fixed address so assertions stay deterministic. */
export const TEST_ADDRESS = 'GsbwXfJraMomNxBcjK9jJ3YuPBQTd7pTvbwEfJvvZoP1' as Address

/**
 * Render a component tree with the providers the app relies on.
 *
 * React Query is configured without retries and without a cache shared between tests, so a failing
 * query fails fast instead of hanging the test.
 *
 * `render` is async in React Native Testing Library v14 — always await this helper.
 */
export async function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { gcTime: 0, retry: false, staleTime: 0 } },
  })

  // The client is returned so a test can force a refetch and exercise the
  // success-then-failure path, where React Query keeps the last value and still reports an error.
  const screen = await render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)

  return Object.assign(screen, { queryClient })
}

export interface SeekerWalletMockOptions {
  /** Lamports returned by `client.rpc.getBalance`. */
  balance?: bigint
  /** Pass `null` to simulate a disconnected wallet. */
  account?: { address: Address; label: string } | null
  /**
   * Reject RPC reads once this many sends have succeeded. `0` fails the first read, `1` lets the
   * first read succeed and fails every refetch after it.
   */
  failRpcAfter?: number
}

/**
 * Build a stand-in for `useSeekerWallet()`.
 *
 * This is the seam that replaces the Seeker Connect transport: no wallet app, no device and
 * no RPC calls are involved, so the tests stay fast and deterministic while still driving the real
 * components.
 */
export function createSeekerWalletMock({
  account,
  balance = 1_500_000_000n,
  failRpcAfter,
}: SeekerWalletMockOptions = {}) {
  const sends: Record<string, number> = {}

  /** Resolve with `value`, unless this read is past the configured failure point. */
  function send<T>(method: string, value: T) {
    return () => {
      const attempt = (sends[method] = (sends[method] ?? 0) + 1)
      if (failRpcAfter !== undefined && attempt > failRpcAfter) {
        return Promise.reject(new Error(`RPC ${method} unavailable`))
      }
      return Promise.resolve(value)
    }
  }

  return {
    account: account === undefined ? { address: TEST_ADDRESS, label: 'Test Wallet' } : account,
    chain: 'solana:devnet',
    client: {
      rpc: {
        getBalance: vi.fn((_address: Address) => ({ send: send('getBalance', { value: balance }) })),
        getGenesisHash: vi.fn(() => ({ send: send('getGenesisHash', 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1') })),
        getVersion: vi.fn(() => ({
          send: send('getVersion', { 'feature-set': 1234567890, 'solana-core': '2.1.0' }),
        })),
      },
    },
    connect: vi.fn(() => Promise.resolve({ address: TEST_ADDRESS, label: 'Test Wallet' })),
    disconnect: vi.fn(),
    identity: { name: 'expo-kit-minimal', uri: 'https://example.com' },
    sendTransactions: vi.fn((_instructions: Instruction[]) => Promise.resolve('SignatureFromMockedWallet')),
    signIn: vi.fn(),
    signMessages: vi.fn((_message: Uint8Array) => Promise.resolve([])),
  }
}
