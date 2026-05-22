'use client'
import { useEffect } from 'react'
import { DynamicProvider, useEvent } from '@dynamic-labs-sdk/react-hooks'
import { detectSocialRedirectUrl, completeSocialRedirect } from '@dynamic-labs-sdk/client'
import { createWaasWalletAccounts, getChainsMissingWaasWalletAccounts } from '@dynamic-labs-sdk/client/waas'
import { dynamicClient } from './dynamicClient'

function WaasBootstrap() {
  useEvent({
    event: 'userChanged',
    listener: async (user) => {
      if (!user) return
      const missingChains = getChainsMissingWaasWalletAccounts()
      if (missingChains.length > 0) {
        try {
          await createWaasWalletAccounts({ chains: missingChains })
        } catch (err) {
          console.error('Failed to create WaaS wallet accounts:', err)
        }
      }
    },
  })
  return null
}

function SocialRedirectHandler() {
  useEffect(() => {
    async function handle() {
      try {
        const isRedirect = await detectSocialRedirectUrl({ url: new URL(window.location.href) })
        if (isRedirect) {
          await completeSocialRedirect({ url: new URL(window.location.href) })
        }
      } catch {
        // not a social redirect
      }
    }
    handle()
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicProvider client={dynamicClient}>
      <WaasBootstrap />
      <SocialRedirectHandler />
      {children}
    </DynamicProvider>
  )
}
