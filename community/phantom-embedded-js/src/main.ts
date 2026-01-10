import { initializeSDK, connect, disconnect, getAddress, checkExistingSession } from './phantom'

import { initializeConnection, getBalance } from './solana'

import {
  initializeUI,
  showConnectView,
  showAccountView,
  showLoading,
  hideLoading,
  showError,
  hideError,
  updateBalance,
  setBalanceLoading,
  clearBalanceLoading,
  getConnectGoogleButton,
  getConnectAppleButton,
  getDisconnectButton,
  getCopyButton,
  getRefreshButton,
  handleCopyAddress,
  resetUI,
} from './ui'

// App state
let currentAddress: string | null = null
let balanceRefreshInterval: number | null = null

// Initialize theme from localStorage (defaults to light)
function initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme') || 'light'
  setTheme(savedTheme)
}

// Apply theme and update icon visibility
function setTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)

  const lightIcon = document.getElementById('theme-icon-light')
  const darkIcon = document.getElementById('theme-icon-dark')

  // Toggle icon visibility based on theme
  if (theme === 'dark') {
    if (lightIcon) lightIcon.style.display = 'none'
    if (darkIcon) darkIcon.style.display = 'block'
  } else {
    if (lightIcon) lightIcon.style.display = 'block'
    if (darkIcon) darkIcon.style.display = 'none'
  }
}

// Toggle between light and dark themes
function toggleTheme(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
}

// Main app initialization
async function initializeApp(): Promise<void> {
  try {
    console.log('Initializing app...')

    // Initialize all systems
    initializeTheme()
    initializeUI()
    initializeSDK()
    initializeConnection()
    setupEventListeners()

    // Show loading while checking/processing authentication
    showLoading('Loading...')

    // Check for existing session (includes handling OAuth callback if present)
    const existingAddress = await checkExistingSession()

    if (existingAddress) {
      // Session found - load dashboard
      currentAddress = existingAddress
      await loadAccountData()
      hideLoading()
      console.log('App initialized - session active')
      return
    }

    // No session, show login view
    hideLoading()
    showConnectView()
    console.log('App initialized - no session')
  } catch (error) {
    console.error('Initialization failed:', error)
    hideLoading()
    showError('Failed to initialize. Please refresh the page.')
  }
}

// Set up all event listeners
function setupEventListeners(): void {
  // Social login buttons
  getConnectGoogleButton().addEventListener('click', () => handleConnect('google'))
  getConnectAppleButton().addEventListener('click', () => handleConnect('apple'))

  // Account actions
  getDisconnectButton().addEventListener('click', handleDisconnect)
  getCopyButton().addEventListener('click', handleCopyClick)
  getRefreshButton().addEventListener('click', handleRefreshBalance)

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle')
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme)
  }
}

// Handle social login button clicks
async function handleConnect(provider: 'google' | 'apple'): Promise<void> {
  try {
    hideError()
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1)
    showLoading(`Connecting with ${providerName}...`)

    // Trigger OAuth flow with selected provider
    // Note: This will redirect user to OAuth provider for authentication
    const address = await connect(provider)

    if (!address) {
      throw new Error('No address returned')
    }

    currentAddress = address
    hideLoading()
    await loadAccountData()
  } catch (error) {
    console.error('Connection error:', error)

    // The user is being redirected to authenticate and will return to the app
    if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
      console.log('Redirecting to OAuth provider...')
      // Keep loading state active during redirect
      return
    }

    // Only show errors for actual failures
    hideLoading()

    const errorMessage = error instanceof Error ? error.message : 'Connection failed. Please try again.'

    showError(errorMessage)
  }
}

// Handle logout button click
async function handleDisconnect(): Promise<void> {
  try {
    hideError()
    showLoading('Logging out...')

    // Stop balance polling and disconnect
    stopBalanceAutoRefresh()
    await disconnect()

    currentAddress = null

    hideLoading()
    resetUI()
  } catch (error) {
    console.error('Logout error:', error)
    hideLoading()

    const errorMessage = error instanceof Error ? error.message : 'Logout failed. Please try again.'

    showError(errorMessage)
  }
}

// Handle copy address button click
async function handleCopyClick(): Promise<void> {
  if (!currentAddress) {
    showError('No address to copy')
    return
  }

  try {
    await handleCopyAddress(currentAddress)
  } catch (error) {
    console.error('Copy error:', error)
  }
}

// Handle refresh balance button click
async function handleRefreshBalance(): Promise<void> {
  if (!currentAddress) {
    showError('No connected account')
    return
  }

  try {
    hideError()
    await fetchAndDisplayBalance(currentAddress)
  } catch (error) {
    console.error('Refresh error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Refresh failed. Please try again.'

    showError(errorMessage)
  }
}

// Load and display account data (address + balance)
async function loadAccountData(): Promise<void> {
  try {
    const address = getAddress()

    if (!address) {
      throw new Error('No connected address')
    }

    currentAddress = address
    // Show account view first (balance will show "Loading...")
    showAccountView(address)
    // Fetch balance from blockchain
    await fetchAndDisplayBalance(address)
    // Start auto-refresh every 30 seconds
    startBalanceAutoRefresh(address)
  } catch (error) {
    console.error('Load account failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to load account.'

    showError(errorMessage)
    showConnectView()
  }
}

// Fetch balance from Solana blockchain and update UI
async function fetchAndDisplayBalance(address: string): Promise<void> {
  try {
    setBalanceLoading()
    // Query Solana RPC for balance (SDK doesn't provide this)
    const balance = await getBalance(address)
    updateBalance(balance)
    clearBalanceLoading()
  } catch (error) {
    console.error('Balance fetch failed:', error)
    clearBalanceLoading()

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balance'

    showError(errorMessage)
  }
}

// Start polling for balance updates every 30 seconds
function startBalanceAutoRefresh(address: string): void {
  stopBalanceAutoRefresh()

  balanceRefreshInterval = window.setInterval(() => {
    fetchAndDisplayBalance(address)
  }, 30000)
}

// Stop balance polling
function stopBalanceAutoRefresh(): void {
  if (balanceRefreshInterval !== null) {
    clearInterval(balanceRefreshInterval)
    balanceRefreshInterval = null
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}
