import { afterEach, expect, test, vi } from 'vitest'
import { createAppClient } from '../src/lib/solana-client'
import { prepareTransfer } from '../src/lib/prepare-transfer'
import { CLUSTERS } from '../src/components/solana/clusters'
import { registerTestWallet } from './wallet-fixture'
import type { AppClient } from '../src/lib/solana-client'
import { describeWalletVersions } from '../src/lib/wallet-versions'

afterEach(() => localStorage.clear())

async function connectedClient() {
  const fixture = registerTestWallet()
  const client = createAppClient(CLUSTERS[0])
  await vi.waitFor(() => expect(client.wallet.getState().wallets.length).toBe(1))
  await client.wallet.connect(client.wallet.getState().wallets[0])
  return {
    client: { ...client, rpc: { getBalance: vi.fn() } } as unknown as AppClient,
    fixture,
    close: () => {
      client[Symbol.dispose]()
      fixture.unregister()
    },
  }
}

test('builds the correct transfer instruction with exact lamports', async () => {
  const { client, fixture, close } = await connectedClient()
  try {
    vi.spyOn(client.rpc, 'getBalance').mockReturnValue({ send: async () => ({ value: 1_000_000_000n }) } as never)
    const [ix] = await prepareTransfer(client, fixture.second.address, '0.001', new AbortController().signal)
    expect(ix.programAddress).toBe('11111111111111111111111111111111')
    expect(ix.accounts?.[0].address).toBe(fixture.first.address)
    expect(ix.accounts?.[1].address).toBe(fixture.second.address)
    expect(new DataView(ix.data!.buffer, ix.data!.byteOffset).getBigUint64(4, true)).toBe(1_000_000n)
  } finally {
    close()
  }
})

test('rejects insufficient SOL before opening the wallet', async () => {
  const { client, fixture, close } = await connectedClient()
  try {
    vi.spyOn(client.rpc, 'getBalance').mockReturnValue({ send: async () => ({ value: 1_000_000n }) } as never)
    await expect(
      prepareTransfer(client, fixture.second.address, '0.001', new AbortController().signal),
    ).rejects.toThrow('Not enough SOL')
  } finally {
    close()
  }
})

test('rejects a wallet change during preparation', async () => {
  const { client, fixture, close } = await connectedClient()
  try {
    vi.spyOn(client.rpc, 'getBalance').mockReturnValue({
      send: async () => {
        fixture.change([fixture.second])
        return { value: 1_000_000_000n }
      },
    } as never)
    await expect(
      prepareTransfer(client, fixture.second.address, '0.001', new AbortController().signal),
    ).rejects.toThrow('Wallet changed')
  } finally {
    close()
  }
})

test('rejects cancelled preparation', async () => {
  const { client, fixture, close } = await connectedClient()
  try {
    const controller = new AbortController()
    vi.spyOn(client.rpc, 'getBalance').mockReturnValue({
      send: async () => {
        controller.abort()
        return { value: 1_000_000_000n }
      },
    } as never)
    await expect(prepareTransfer(client, fixture.second.address, '0.001', controller.signal)).rejects.toThrow()
  } finally {
    close()
  }
})

test('does not silently fall back when the wallet supports only V0', async () => {
  const fixture = registerTestWallet('V0 wallet', ['legacy', 0])
  const client = createAppClient(CLUSTERS[0])
  try {
    await vi.waitFor(() => expect(client.wallet.getState().wallets.length).toBe(1))
    await client.wallet.connect(client.wallet.getState().wallets[0])
    expect(describeWalletVersions(client.wallet.getState().connected!)).toBe('signTransaction: legacy, 0')
    await expect(
      prepareTransfer(client, fixture.second.address, '0.001', new AbortController().signal),
    ).rejects.toThrow('does not support V1')
  } finally {
    client[Symbol.dispose]()
    fixture.unregister()
  }
})
