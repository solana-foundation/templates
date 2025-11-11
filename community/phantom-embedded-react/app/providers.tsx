'use client';

import { PhantomProvider } from '@phantom/react-sdk';
import { AddressType } from '@phantom/browser-sdk';
import { ReactNode } from 'react';

/**
 * Client-side providers wrapper for Phantom SDK
 * Configures embedded wallet for Solana OAuth authentication
 * Users login via Google or Apple (provided by Phantom Connect)
 */
export function Providers({ children }: { children: ReactNode }) {
  // Get configuration from environment variables
  const appId = process.env.NEXT_PUBLIC_PHANTOM_APP_ID;
  const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL || (typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:3000/');

  // Validate App ID is provided
  if (!appId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p className="text-gray-400 mb-4">
            Please set your Phantom App ID in the environment variables.
          </p>
          <ol className="text-left text-sm text-gray-400 space-y-2">
            <li>1. Copy .env.example to .env.local</li>
            <li>2. Get your App ID from https://phantom.com/portal/</li>
            <li>3. Add it to NEXT_PUBLIC_PHANTOM_APP_ID</li>
            <li>4. Whitelist your redirect URL in Phantom Portal</li>
            <li>5. Restart the development server</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <PhantomProvider
      config={{
        providerType: 'embedded',
        appId: appId,
        addressTypes: [AddressType.solana],
        authOptions: {
          redirectUrl: redirectUrl, // Must be an existing page and whitelisted in Phantom Portal
        },
      }}
    >
      {children}
    </PhantomProvider>
  );
}

