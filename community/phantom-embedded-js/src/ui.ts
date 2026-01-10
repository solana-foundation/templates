import { truncateAddress, formatBalance, copyToClipboard } from './solana'

// DOM element references
let connectSection: HTMLElement
let accountSection: HTMLElement
let connectGoogleBtn: HTMLButtonElement
let connectAppleBtn: HTMLButtonElement
let disconnectBtn: HTMLButtonElement
let copyBtn: HTMLButtonElement
let refreshBtn: HTMLButtonElement
let addressDisplay: HTMLElement
let balanceDisplay: HTMLElement
let errorMessage: HTMLElement
let loadingOverlay: HTMLElement

// Initialize and cache DOM element references
export function initializeUI(): void {
  // Get all required DOM elements by ID
  connectSection = document.getElementById('connect-section') as HTMLElement
  accountSection = document.getElementById('account-section') as HTMLElement
  connectGoogleBtn = document.getElementById('connect-google-btn') as HTMLButtonElement
  connectAppleBtn = document.getElementById('connect-apple-btn') as HTMLButtonElement
  disconnectBtn = document.getElementById('disconnect-btn') as HTMLButtonElement
  copyBtn = document.getElementById('copy-btn') as HTMLButtonElement
  refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement
  addressDisplay = document.getElementById('address') as HTMLElement
  balanceDisplay = document.getElementById('balance') as HTMLElement
  errorMessage = document.getElementById('error-message') as HTMLElement
  loadingOverlay = document.getElementById('loading-overlay') as HTMLElement

  // Validate all elements exist
  if (
    !connectSection ||
    !accountSection ||
    !connectGoogleBtn ||
    !connectAppleBtn ||
    !disconnectBtn ||
    !copyBtn ||
    !refreshBtn ||
    !addressDisplay ||
    !balanceDisplay ||
    !errorMessage ||
    !loadingOverlay
  ) {
    throw new Error('Missing required DOM elements')
  }

  console.log('UI initialized')
}

// Show login/connect view
export function showConnectView(): void {
  connectSection.classList.remove('hidden')
  accountSection.classList.add('hidden')
  hideError()
}

// Show account dashboard with address and balance
export function showAccountView(address: string, balance?: number): void {
  connectSection.classList.add('hidden')
  accountSection.classList.remove('hidden')

  // Display truncated address with full address on hover
  const truncated = truncateAddress(address)
  addressDisplay.textContent = truncated
  addressDisplay.title = address

  // Update balance or show loading
  if (balance !== undefined) {
    updateBalance(balance)
  } else {
    balanceDisplay.textContent = 'Loading...'
  }

  hideError()
}

// Update the balance display
export function updateBalance(balance: number): void {
  balanceDisplay.textContent = `${formatBalance(balance)} SOL`
}

// Show loading overlay with message
export function showLoading(message: string = 'Connecting...'): void {
  loadingOverlay.classList.remove('hidden')
  const loadingText = loadingOverlay.querySelector('p')
  if (loadingText) {
    loadingText.textContent = message
  }
}

// Hide loading overlay
export function hideLoading(): void {
  loadingOverlay.classList.add('hidden')
}

// Display error message to user
export function showError(message: string): void {
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
  console.error(message)
}

// Clear error message
export function hideError(): void {
  errorMessage.classList.add('hidden')
  errorMessage.textContent = ''
}

// Show loading state in balance display
export function setBalanceLoading(): void {
  balanceDisplay.textContent = 'Loading...'
  balanceDisplay.classList.add('loading')
}

// Clear loading state from balance display
export function clearBalanceLoading(): void {
  balanceDisplay.classList.remove('loading')
}

// Button element getters
export function getConnectGoogleButton(): HTMLButtonElement {
  return connectGoogleBtn
}

export function getConnectAppleButton(): HTMLButtonElement {
  return connectAppleBtn
}

export function getDisconnectButton(): HTMLButtonElement {
  return disconnectBtn
}

export function getCopyButton(): HTMLButtonElement {
  return copyBtn
}

export function getRefreshButton(): HTMLButtonElement {
  return refreshBtn
}

// Copy address to clipboard with visual feedback
export async function handleCopyAddress(address: string): Promise<void> {
  try {
    await copyToClipboard(address)

    // Show success feedback
    const originalText = copyBtn.textContent
    copyBtn.textContent = 'Copied!'
    copyBtn.classList.add('success')

    // Reset after 2 seconds
    setTimeout(() => {
      copyBtn.textContent = originalText
      copyBtn.classList.remove('success')
    }, 2000)
  } catch (error) {
    showError('Failed to copy address')
  }
}

// Reset UI to initial login state
export function resetUI(): void {
  showConnectView()
  addressDisplay.textContent = ''
  balanceDisplay.textContent = 'Loading...'
  hideError()
  hideLoading()
}
