import { act, fireEvent, waitFor } from '@testing-library/react-native'
import { createSolanaDevnet, createSolanaTestnet } from '@wallet-ui/react-native-kit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NetworkFeatureIndex } from '@/features/network/network-feature-index'
import { NetworkProvider } from '@/features/network/network-provider'
import { createSeekerWalletMock, renderWithProviders } from '@/test/test-utils'

const wallet = vi.hoisted(() => ({ current: null as ReturnType<typeof createSeekerWalletMock> | null }))

vi.mock('@/components/seeker-wallet-provider', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/seeker-wallet-provider')>()),
  useSeekerWallet: () => wallet.current,
}))

const devnet = createSolanaDevnet({ url: 'https://api.devnet.solana.com' })
const testnet = createSolanaTestnet({ url: 'https://api.testnet.solana.com' })

function renderNetworkFeature() {
  return renderWithProviders(<NetworkProvider networks={[devnet, testnet]} render={() => <NetworkFeatureIndex />} />)
}

describe('NetworkFeatureIndex', () => {
  beforeEach(() => {
    wallet.current = createSeekerWalletMock()
  })

  it('shows the selected network', async () => {
    const screen = await renderNetworkFeature()

    expect(screen.getByText(/Connected to Devnet/)).toBeTruthy()
  })

  it('renders the cluster version reported by the RPC client', async () => {
    const screen = await renderNetworkFeature()

    expect(await screen.findByText(/Version: 2\.1\.0 \(1234567890\)/)).toBeTruthy()
    expect(wallet.current!.client.rpc.getVersion).toHaveBeenCalled()
  })

  it('renders a shortened genesis hash', async () => {
    const screen = await renderNetworkFeature()

    expect(await screen.findByText(/Genesis Hash: EtWTRABZ\.\.6VU2xqa1/)).toBeTruthy()
  })

  it('reports failed cluster reads instead of rendering undefined', async () => {
    wallet.current = createSeekerWalletMock({ failRpcAfter: 0 })

    const screen = await renderNetworkFeature()

    expect(await screen.findByText(/Version: Unable to load/)).toBeTruthy()
    expect(await screen.findByText(/Genesis Hash: Unable to load/)).toBeTruthy()
    expect(screen.queryByText(/undefined/)).toBeNull()
  })

  it('flags cluster values as stale when a refetch fails', async () => {
    wallet.current = createSeekerWalletMock({ failRpcAfter: 1 })

    const screen = await renderNetworkFeature()
    // Both reads have to settle before the refetch, or the one still in flight never gets a second
    // call and only one value ends up stale.
    expect(await screen.findByText(/Version: 2\.1\.0 \(1234567890\)/)).toBeTruthy()
    expect(await screen.findByText(/Genesis Hash: EtWTRABZ\.\.6VU2xqa1/)).toBeTruthy()

    await act(async () => {
      await screen.queryClient.refetchQueries()
    })

    // `findAllByText` resolves on its first match, so it would settle for one stale value while the
    // second is still a tick behind. Waiting for the count is what makes this deterministic.
    await waitFor(() => expect(screen.getAllByText(/refresh failed/i)).toHaveLength(2))
  })

  it('only offers the networks that are not currently selected', async () => {
    const screen = await renderNetworkFeature()

    expect(screen.getByRole('button', { name: /connect to testnet/i })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /connect to devnet/i })).toBeNull()
  })

  it('switches to another network', async () => {
    const screen = await renderNetworkFeature()

    await fireEvent.press(screen.getByRole('button', { name: /connect to testnet/i }))

    expect(screen.getByText(/Connected to Testnet/)).toBeTruthy()
    expect(screen.getByRole('button', { name: /connect to devnet/i })).toBeTruthy()
  })
})
