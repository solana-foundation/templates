import { act, render } from '@testing-library/react-native'
import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createSolanaTestnet,
  SolanaCluster,
} from '@wallet-ui/react-native-kit'
import { describe, expect, it } from 'vitest'
import { NetworkProvider, NetworkProviderContextValue } from '@/features/network/network-provider'

const devnet = createSolanaDevnet({ url: 'https://api.devnet.solana.com' })
const localnet = createSolanaLocalnet({ url: 'http://localhost:8899' })
const testnet = createSolanaTestnet({ url: 'https://api.testnet.solana.com' })

/**
 * `NetworkProvider` hands its context value to a render prop, which is the simplest seam for
 * asserting on the provider's behaviour without mounting the whole screen.
 */
async function renderNetworkProvider(networks: SolanaCluster[]) {
  const seen: NetworkProviderContextValue[] = []

  await render(
    <NetworkProvider
      networks={networks}
      render={(value) => {
        seen.push(value)
        return null
      }}
    />,
  )

  return {
    get value() {
      return seen[seen.length - 1]
    },
  }
}

describe('NetworkProvider', () => {
  it('selects the first network by default', async () => {
    const provider = await renderNetworkProvider([testnet, devnet])

    expect(provider.value.selectedNetwork).toBe(testnet)
    expect(provider.value.chain).toBe('solana:testnet')
    expect(provider.value.endpoint).toBe('https://api.testnet.solana.com')
  })

  it('sorts the networks by label', async () => {
    const provider = await renderNetworkProvider([testnet, devnet, localnet])

    expect(provider.value.networks.map((network) => network.label)).toEqual(['Devnet', 'Localnet', 'Testnet'])
  })

  it('switches the selected network', async () => {
    const provider = await renderNetworkProvider([devnet, testnet])

    await act(async () => provider.value.setSelectedNetwork(testnet))

    expect(provider.value.selectedNetwork).toBe(testnet)
    expect(provider.value.chain).toBe('solana:testnet')
    expect(provider.value.endpoint).toBe('https://api.testnet.solana.com')
  })

  describe('getExplorerUrl', () => {
    it('appends the devnet cluster query parameter', async () => {
      const provider = await renderNetworkProvider([devnet])

      expect(provider.value.getExplorerUrl('tx/abc')).toBe('https://explorer.solana.com/tx/abc?cluster=devnet')
    })

    it('appends the testnet cluster query parameter', async () => {
      const provider = await renderNetworkProvider([testnet])

      expect(provider.value.getExplorerUrl('tx/abc')).toBe('https://explorer.solana.com/tx/abc?cluster=testnet')
    })

    it('encodes the endpoint for a local validator', async () => {
      const provider = await renderNetworkProvider([localnet])

      expect(provider.value.getExplorerUrl('tx/abc')).toBe(
        'https://explorer.solana.com/tx/abc?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899',
      )
    })

    it('follows the selected network after a switch', async () => {
      const provider = await renderNetworkProvider([devnet, testnet])

      await act(async () => provider.value.setSelectedNetwork(testnet))

      expect(provider.value.getExplorerUrl('tx/abc')).toBe('https://explorer.solana.com/tx/abc?cluster=testnet')
    })
  })
})
