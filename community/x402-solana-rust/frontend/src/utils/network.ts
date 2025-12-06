import { getNetworkConfig } from '../config'
import { setConnection, fetchBalance } from './wallet'
import { log } from './logger'

export type NetworkType = 'devnet' | 'mainnet'

let currentNetwork: NetworkType = 'devnet'

export function getCurrentNetwork(): NetworkType {
  return currentNetwork
}

export function setupNetwork(): void {
  const buttons = document.querySelectorAll('.toggle-btn')
  const rpcEndpointEl = document.getElementById('rpc-endpoint')

  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const network = target.getAttribute('data-network') as NetworkType

      if (!network) return

      // Update active state
      buttons.forEach((btn) => btn.classList.remove('active'))
      target.classList.add('active')

      // Switch network
      currentNetwork = network
      const config = getNetworkConfig()
      const rpcUrl = config[currentNetwork].rpcUrl
      setConnection(rpcUrl)

      // Update UI
      if (rpcEndpointEl) {
        rpcEndpointEl.textContent = rpcUrl
      }

      log('info', `Switched to ${currentNetwork.toUpperCase()}`)
      fetchBalance()
    })
  })

  // Initialize with devnet
  const config = getNetworkConfig()
  setConnection(config.devnet.rpcUrl)
  if (rpcEndpointEl) {
    rpcEndpointEl.textContent = config.devnet.rpcUrl
  }
}

export async function detectFramework(apiBaseUrl: string): Promise<string | null> {
  try {
    log('info', 'Detecting backend framework...')
    const response = await fetch(`${apiBaseUrl}/api/health`)
    const data = await response.json()

    const frameworkEl = document.getElementById('framework-name')
    if (frameworkEl && data.framework) {
      frameworkEl.textContent = data.framework
      log('success', `Detected framework: ${data.framework}`)
    }

    return data.framework || null
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    log('error', `Framework detection failed: ${errorMessage}`)
    return null
  }
}
