import { MEMO_PROGRAM_ADDRESS } from '@solana-program/memo'
import { act, fireEvent } from '@testing-library/react-native'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AccountFeatureIndex } from '@/features/account/account-feature-index'
import { createSeekerWalletMock, renderWithProviders, TEST_ADDRESS } from '@/test/test-utils'

// `vi.mock` is hoisted above the imports, so the mock value lives in a mutable holder that each test
// reassigns before rendering.
const wallet = vi.hoisted(() => ({ current: null as ReturnType<typeof createSeekerWalletMock> | null }))

vi.mock('@/components/seeker-wallet-provider', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/seeker-wallet-provider')>()),
  useSeekerWallet: () => wallet.current,
}))

describe('AccountFeatureIndex', () => {
  beforeEach(() => {
    wallet.current = createSeekerWalletMock()
  })

  describe('when a wallet is connected', () => {
    it('shows the connected wallet label', async () => {
      const screen = await renderWithProviders(<AccountFeatureIndex />)

      expect(screen.getByText(/Connected to Test Wallet/)).toBeTruthy()
    })

    it('renders the balance returned by the RPC client', async () => {
      wallet.current = createSeekerWalletMock({ balance: 2_250_000_000n })

      const screen = await renderWithProviders(<AccountFeatureIndex />)

      expect(await screen.findByText(/Balance: 2\.25 SOL/)).toBeTruthy()
      expect(wallet.current.client.rpc.getBalance).toHaveBeenCalledWith(TEST_ADDRESS)
    })

    it('reports a failed balance read instead of rendering it as zero', async () => {
      wallet.current = createSeekerWalletMock({ failRpcAfter: 0 })

      const screen = await renderWithProviders(<AccountFeatureIndex />)

      expect(await screen.findByText(/Balance: Unable to load/)).toBeTruthy()
      expect(screen.queryByText(/Balance: 0 SOL/)).toBeNull()
    })

    it('flags the balance as stale when a refetch fails', async () => {
      wallet.current = createSeekerWalletMock({ balance: 2_250_000_000n, failRpcAfter: 1 })

      const screen = await renderWithProviders(<AccountFeatureIndex />)
      expect(await screen.findByText(/Balance: 2\.25 SOL/)).toBeTruthy()

      // React Query keeps the last value on a failed refetch, so the error must not be swallowed
      // just because `data` is still present.
      await act(async () => {
        await screen.queryClient.refetchQueries()
      })

      expect(await screen.findByText(/refresh failed/i)).toBeTruthy()
      expect(screen.getByText(/2\.25 SOL/)).toBeTruthy()
    })

    it('sends a memo instruction through the wallet when sending a transaction', async () => {
      const screen = await renderWithProviders(<AccountFeatureIndex />)

      await fireEvent.press(screen.getByRole('button', { name: /send transaction/i }))

      expect(wallet.current!.sendTransactions).toHaveBeenCalledOnce()
      const [instructions] = wallet.current!.sendTransactions.mock.calls[0]
      expect(instructions).toHaveLength(1)
      expect(instructions[0].programAddress).toBe(MEMO_PROGRAM_ADDRESS)
      expect(new TextDecoder().decode(instructions[0].data)).toBe(`gm from Mobile Wallet Adapter - ${TEST_ADDRESS}`)
    })

    it('signs a message containing the connected address', async () => {
      const screen = await renderWithProviders(<AccountFeatureIndex />)

      await fireEvent.press(screen.getByRole('button', { name: /sign message/i }))

      expect(wallet.current!.signMessages).toHaveBeenCalledOnce()
      const [message] = wallet.current!.signMessages.mock.calls[0]
      expect(new TextDecoder().decode(message)).toBe(`Signing a message with ${TEST_ADDRESS}`)
    })

    it('reports the reason when signing a message is rejected', async () => {
      wallet.current = createSeekerWalletMock()
      wallet.current.signMessages.mockRejectedValueOnce(new Error('User rejected the request'))

      const screen = await renderWithProviders(<AccountFeatureIndex />)
      await fireEvent.press(screen.getByRole('button', { name: /sign message/i }))

      expect(await screen.findByText(/Sign Message failed/)).toBeTruthy()
      expect(screen.getByText(/User rejected the request/)).toBeTruthy()
      // The status is reported next to the button, so the label stays actionable.
      expect(screen.getByRole('button', { name: /^sign message$/i })).toBeTruthy()
    })

    it('disconnects the wallet', async () => {
      const screen = await renderWithProviders(<AccountFeatureIndex />)

      await fireEvent.press(screen.getByRole('button', { name: /disconnect/i }))

      expect(wallet.current!.disconnect).toHaveBeenCalledOnce()
    })
  })

  describe('when no wallet is connected', () => {
    beforeEach(() => {
      wallet.current = createSeekerWalletMock({ account: null })
    })

    it('offers to connect instead of showing account actions', async () => {
      const screen = await renderWithProviders(<AccountFeatureIndex />)

      expect(screen.getByTestId('connect-with-seeker')).toBeTruthy()
      expect(screen.queryByRole('button', { name: /send transaction/i })).toBeNull()
      expect(screen.queryByText(/Connected to/)).toBeNull()
    })

    it('connects the wallet', async () => {
      const screen = await renderWithProviders(<AccountFeatureIndex />)

      await fireEvent(screen.getByTestId('connect-with-seeker'), 'press')

      expect(wallet.current!.connect).toHaveBeenCalledOnce()
    })

    it('does not query the balance', async () => {
      await renderWithProviders(<AccountFeatureIndex />)

      expect(wallet.current!.client.rpc.getBalance).not.toHaveBeenCalled()
    })
  })
})
