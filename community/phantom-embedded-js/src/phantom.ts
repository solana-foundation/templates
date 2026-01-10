import { BrowserSDK, AddressType, ConnectResult, WalletAddress } from '@phantom/browser-sdk'

let sdk: BrowserSDK | null = null
let connectedAddress: string | null = null

export function initializeSDK(): BrowserSDK {
  const appId = import.meta.env.VITE_PHANTOM_APP_ID
  const redirectUrl = import.meta.env.VITE_REDIRECT_URL
  const authUrl = import.meta.env.VITE_PHANTOM_AUTH_URL

  if (!appId || appId === 'your-app-id-here') {
    throw new Error(
      'Missing Phantom App ID. Set VITE_PHANTOM_APP_ID in .env file. ' +
        'Get your App ID at https://phantom.com/portal',
    )
  }

  if (!redirectUrl) {
    throw new Error('Missing redirect URL. Set VITE_REDIRECT_URL in .env file.')
  }

  sdk = new BrowserSDK({
    providerType: 'embedded',
    embeddedWalletType: 'user-wallet',
    addressTypes: [AddressType.solana],
    appId: appId,
    authOptions: {
      authUrl: `${authUrl}/login`,
      redirectUrl: redirectUrl,
    },
  })

  console.log('Phantom SDK initialized')
  return sdk
}

// Get the SDK instance (must be initialized first)
export function getSDK(): BrowserSDK {
  if (!sdk) {
    throw new Error('SDK not initialized. Call initializeSDK() first.')
  }
  return sdk
}

// Trigger Phantom Connect authentication with selected social provider
export async function connect(provider: 'google' | 'apple' = 'google'): Promise<string> {
  try {
    const sdkInstance = getSDK()
    console.log(`Starting authentication with ${provider}...`)

    // Connect with social provider (triggers OAuth flow)
    // Note: This will redirect the user to OAuth provider, so the promise
    // may not resolve in the current page session
    const result: ConnectResult = await sdkInstance.connect({ provider })

    // Extract Solana address from result
    if (result?.addresses && Array.isArray(result.addresses)) {
      const solanaAddr = result.addresses.find((addr: WalletAddress) => addr.addressType === AddressType.solana)

      const address = solanaAddr?.address
      if (address && typeof address === 'string') {
        connectedAddress = address
        console.log('Connected:', address)
        return address
      }
    }

    // During OAuth flow, user gets redirected so no address is returned yet
    // This is expected behavior, not an error - just throw to be caught
    throw new Error('REDIRECT_IN_PROGRESS')
  } catch (error) {
    console.error('Connection error:', error)

    // If this is a redirect-in-progress (expected OAuth flow), pass it through
    if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
      throw error
    }

    // For actual errors, provide helpful message
    if (error instanceof Error) {
      throw new Error(`Connection failed: ${error.message}`)
    }
    throw new Error('Failed to connect with Phantom. Please try again.')
  }
}

// Disconnect from Phantom and clear session
export async function disconnect(): Promise<void> {
  try {
    const sdkInstance = getSDK()
    await sdkInstance.disconnect()
    connectedAddress = null
    console.log('Logged out')
  } catch (error) {
    console.error('Logout failed:', error)
    throw new Error('Failed to log out. Please try again.')
  }
}

// Get the cached connected address
export function getAddress(): string | null {
  return connectedAddress
}

// Check if user has an active session
export function isConnected(): boolean {
  try {
    const sdkInstance = getSDK()
    return sdkInstance.isConnected()
  } catch (error) {
    return false
  }
}

// Check for existing session on page load (auto-reconnect)
export async function checkExistingSession(): Promise<string | null> {
  try {
    const sdkInstance = getSDK()

    // First check if this is an OAuth callback redirect
    const urlParams = new URLSearchParams(window.location.search)
    const isCallback =
      urlParams.has('response_type') || urlParams.has('wallet_id') || urlParams.has('code') || urlParams.has('state')

    if (isCallback) {
      console.log('Processing OAuth callback...')

      // Wait a bit for SDK to initialize the callback
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call connect to complete the OAuth handshake and get session
      try {
        const result: ConnectResult = await sdkInstance.connect({ provider: 'phantom' })

        // Extract Solana address from result
        if (result?.addresses && Array.isArray(result.addresses)) {
          const solanaAddr = result.addresses.find((addr: WalletAddress) => addr.addressType === AddressType.solana)

          const address = solanaAddr?.address
          if (address && typeof address === 'string') {
            connectedAddress = address
            console.log('OAuth callback completed, address:', address)
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname)
            return address
          }
        }
      } catch (err) {
        console.error('OAuth callback failed:', err)
        // Clean URL even on error
        window.history.replaceState({}, document.title, window.location.pathname)
        return null
      }
    }

    // Not a callback - check if SDK reports an existing session
    if (!sdkInstance.isConnected()) {
      console.log('No active session')
      return null
    }

    // If connected, retrieve the session data from SDK
    console.log('Active session detected, retrieving address...')

    try {
      const result: ConnectResult = await sdkInstance.connect({ provider: 'phantom' })

      // Extract Solana address from session
      if (result?.addresses && Array.isArray(result.addresses)) {
        const solanaAddr = result.addresses.find((addr: WalletAddress) => addr.addressType === AddressType.solana)

        const address = solanaAddr?.address
        if (address && typeof address === 'string') {
          connectedAddress = address
          console.log('Session restored:', address)
          return address
        }
      }
    } catch (err) {
      console.error('Failed to retrieve session data:', err)
    }

    return null
  } catch (error) {
    console.error('Session check failed:', error)
    return null
  }
}

// Handle OAuth callback after Phantom redirects back to app
export async function handleAuthCallback(): Promise<string | null> {
  try {
    // Check for OAuth callback parameters in URL
    const urlParams = new URLSearchParams(window.location.search)
    const hasAuthParams =
      urlParams.has('response_type') || urlParams.has('wallet_id') || urlParams.has('code') || urlParams.has('state')

    if (!hasAuthParams) {
      return null
    }

    console.log('Processing OAuth callback...')

    const sdkInstance = getSDK()

    // Wait for SDK to process the OAuth callback
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Retrieve session data without showing UI
      const result: ConnectResult = await sdkInstance.connect({ provider: 'phantom' })

      // Extract Solana address from session
      if (result?.addresses && Array.isArray(result.addresses)) {
        const solanaAddr = result.addresses.find((addr: WalletAddress) => addr.addressType === AddressType.solana)

        const address = solanaAddr?.address
        if (address && typeof address === 'string') {
          connectedAddress = address
          console.log('OAuth session established')
          // Clean URL parameters
          window.history.replaceState({}, document.title, window.location.pathname)
          return address
        }
      }
    } catch (err) {
      console.log('Session retrieval failed')
    }

    // Fallback: check if we have cached connection
    if (isConnected() && connectedAddress) {
      window.history.replaceState({}, document.title, window.location.pathname)
      return connectedAddress
    }

    // Clean URL even if callback failed
    window.history.replaceState({}, document.title, window.location.pathname)
    return null
  } catch (error) {
    console.error('OAuth callback error:', error)
    window.history.replaceState({}, document.title, window.location.pathname)
    return null
  }
}
