import { Buffer } from 'buffer'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './providers'
import { App } from './App'

if (typeof window !== 'undefined') window.Buffer = window.Buffer ?? Buffer

const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID
if (!environmentId) {
  document.getElementById('root')!.textContent =
    'Error: VITE_DYNAMIC_ENVIRONMENT_ID is not set. Copy .env.example to .env and add your Dynamic Environment ID.'
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>,
  )
}
