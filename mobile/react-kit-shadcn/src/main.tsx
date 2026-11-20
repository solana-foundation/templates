import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app'
import { registerMobileWalletAdapter } from '@/features/core/data-access/register-mwa'
import { registerSeekerConnectWallet } from '@/features/core/data-access/register-seeker-connect'
import { applyTheme, loadTheme } from '@/features/shell/data-access/use-theme'

import './global.css'

// Wallets have to join the wallet-standard registry before anything reads from it.
registerMobileWalletAdapter()
registerSeekerConnectWallet()

// Applied before the first paint. A stored preference that disagrees with the operating system
// would otherwise show the wrong theme for a frame before React's effects run.
applyTheme(loadTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
