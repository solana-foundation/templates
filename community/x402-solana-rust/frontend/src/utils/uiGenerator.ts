/**
 * UI Generator
 * Automatically generates HTML UI elements for APIs
 */

import type { BaseAPI } from '../apis/BaseAPI'
import { PaidAPI } from '../apis/PaidAPI'

/**
 * Generate UI sections for all APIs
 */
export function generateAPIUI(apis: BaseAPI[], containerId: string = 'api-endpoints-container'): void {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container #${containerId} not found`)
    return
  }

  // Clear existing content
  container.innerHTML = ''

  // Generate UI for each API
  apis.forEach((api) => {
    const section = createAPISection(api)
    container.appendChild(section)
  })
}

/**
 * Create a UI section for a single API
 */
function createAPISection(api: BaseAPI): HTMLDivElement {
  // Create card container
  const card = document.createElement('div')
  card.className = 'endpoint-card'
  card.id = `${api.buttonId}-section`

  // Create header section
  const header = document.createElement('div')
  header.className = 'endpoint-header'

  // Add method badge
  const methodBadge = document.createElement('span')
  methodBadge.className = `method ${api.method.toLowerCase()}`
  methodBadge.textContent = api.method.toUpperCase()
  header.appendChild(methodBadge)

  // Add path
  const pathSpan = document.createElement('span')
  pathSpan.className = 'path'
  pathSpan.textContent = api.path
  header.appendChild(pathSpan)

  // Add buttons
  if (api instanceof PaidAPI) {
    // Special handling for PaidAPI (two buttons)
    const noPaymentBtn = document.createElement('button')
    noPaymentBtn.className = 'test-btn'
    noPaymentBtn.id = 'test-paid-no-payment-btn'
    noPaymentBtn.textContent = 'Test (No Payment)'
    header.appendChild(noPaymentBtn)

    const withPaymentBtn = document.createElement('button')
    withPaymentBtn.className = 'test-btn primary'
    withPaymentBtn.id = 'test-paid-with-payment-btn'
    withPaymentBtn.textContent = 'Test (With Payment)'
    header.appendChild(withPaymentBtn)
  } else {
    // Regular button for other APIs
    const button = document.createElement('button')
    button.className = 'test-btn'
    button.id = api.buttonId
    button.textContent = 'Test'
    header.appendChild(button)
  }

  card.appendChild(header)

  // Add description
  if (api.description) {
    const desc = document.createElement('div')
    desc.className = 'endpoint-desc'
    desc.textContent = api.description
    card.appendChild(desc)
  }

  // Add response container
  const responseDiv = document.createElement('div')
  responseDiv.className = 'response'
  responseDiv.id = api.responseId
  card.appendChild(responseDiv)

  return card
}

/**
 * Add custom CSS for button groups (if needed)
 */
export function injectUIStyles(): void {
  const styleId = 'api-ui-generator-styles'

  // Don't inject if already present
  if (document.getElementById(styleId)) return

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
        .button-group {
            display: flex;
            gap: 10px;
            margin: 10px 0;
            flex-wrap: wrap;
        }

        .button-group button {
            flex: 1;
            min-width: 150px;
        }
    `

  document.head.appendChild(style)
}
