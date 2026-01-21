'use client'

import { LazorkitProvider } from '@lazorkit/wallet'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl={process.env.NEXT_PUBLIC_LAZORKIT_RPC_URL!}
      portalUrl={process.env.NEXT_PUBLIC_LAZORKIT_PORTAL_URL!}
      paymasterConfig={{
        paymasterUrl: process.env.NEXT_PUBLIC_LAZORKIT_PAYMASTER_URL!,
      }}
    >
      {children}
    </LazorkitProvider>
  )
}
