import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { useConnectedWallet, useIsWalletReady, useWallets } from '@solana/kit-plugin-wallet/react'
import { ClientProvider } from '@solana/react'
import { getWalletForHandle } from '@wallet-standard/ui-registry'
import { SolanaProvider as Provider, useSolana } from '../src/components/solana/solana-provider'
import { createAppClient } from '../src/lib/solana-client'
import { CLUSTERS } from '../src/components/solana/clusters'
import { registerTestWallet } from './wallet-fixture'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

test('tracks selected accounts, disconnection and restoration with real plugins', async () => {
  const fixture = registerTestWallet()
  let client = createAppClient(CLUSTERS[0])
  function Probe() {
    const wallet = useConnectedWallet(client)
    const ready = useIsWalletReady(client)
    return <p>{ready ? (wallet?.account.address ?? 'Disconnected') : 'Restoring'}</p>
  }
  try {
    let view = render(
      <ClientProvider client={client}>
        <Probe />
      </ClientProvider>,
    )
    await screen.findByText('Disconnected')
    await act(async () => client.wallet.connect(client.wallet.getState().wallets[0]))
    await screen.findByText(fixture.first.address)
    act(() => fixture.change([fixture.second]))
    await screen.findByText(fixture.second.address)
    view.unmount()
    client[Symbol.dispose]()
    client = createAppClient(CLUSTERS[0])
    view = render(
      <ClientProvider client={client}>
        <Probe />
      </ClientProvider>,
    )
    await screen.findByText(fixture.second.address)
    await act(async () => client.wallet.disconnect())
    await screen.findByText('Disconnected')
    view.unmount()
  } finally {
    client[Symbol.dispose]()
    fixture.unregister()
  }
})

test('does not conflate wallets with duplicate names', async () => {
  const a = registerTestWallet('Same Name')
  const b = registerTestWallet('Same Name')
  const client = createAppClient(CLUSTERS[0])
  function Probe() {
    const wallets = useWallets(client)
    return <p>{wallets.length}</p>
  }
  try {
    render(
      <ClientProvider client={client}>
        <Probe />
      </ClientProvider>,
    )
    await screen.findByText('2')
    const wallets = client.wallet.getState().wallets
    await act(async () => client.wallet.connect(wallets[0]))
    expect(getWalletForHandle(client.wallet.getState().connected!.wallet)).toBe(getWalletForHandle(wallets[0]))
    expect(getWalletForHandle(wallets[0])).not.toBe(getWalletForHandle(wallets[1]))
  } finally {
    cleanup()
    client[Symbol.dispose]()
    a.unregister()
    b.unregister()
  }
})

test('provider survives StrictMode and rebuilds the RPC and wallet chain together', async () => {
  const fixture = registerTestWallet()
  function Probe() {
    const context = useSolana()
    return (
      <>
        <p>{context.cluster.id}</p>
        <button onClick={() => context.setCluster(CLUSTERS[1])}>Testnet</button>
      </>
    )
  }
  try {
    render(
      <StrictMode>
        <Provider>
          <Probe />
        </Provider>
      </StrictMode>,
    )
    await screen.findByText('devnet')
    fireEvent.click(screen.getByRole('button', { name: 'Testnet' }))
    await waitFor(() => expect(screen.getByText('testnet')).toBeTruthy())
  } finally {
    cleanup()
    fixture.unregister()
  }
})
