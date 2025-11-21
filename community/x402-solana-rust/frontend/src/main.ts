import '../style.css'
import { setupWallet } from './utils/wallet'
import { setupNetwork, detectFramework } from './utils/network'
import { generateAPIUI, injectUIStyles } from './utils/uiGenerator'
import { APIs } from './apis'
import { log, setupLogger } from './utils/logger'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/**
 * Initialize the application
 */
async function init(): Promise<void> {
  // Setup logger first
  setupLogger()

  log('info', 'Initializing application...')

  // Inject UI styles
  injectUIStyles()

  // Generate API UI automatically
  generateAPIUI(APIs)

  // Setup wallet functionality
  setupWallet()

  // Setup network switching
  setupNetwork()

  // Setup event listeners for all APIs
  APIs.forEach((api) => {
    api.setup(API_BASE_URL)
  })

  // Update API URL display
  const apiUrlEl = document.getElementById('api-url')
  if (apiUrlEl) {
    apiUrlEl.textContent = API_BASE_URL
  }

  // Detect backend framework
  const framework = await detectFramework(API_BASE_URL)
  if (framework) {
    const frameworkEl = document.getElementById('detected-framework')
    if (frameworkEl) {
      frameworkEl.textContent = framework
    }
    log('success', `Connected to ${framework} backend`)
  }

  log('success', 'Application initialized successfully')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
