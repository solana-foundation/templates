'use client';

import { useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { Toaster, toast } from 'sonner';

function PrivyErrorHandler() {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const msg: string = event.reason?.message ?? '';
      const match = msg.match(/Login with (.+?) not allowed/i);
      if (match) {
        toast.error(`${match[1]} login not enabled`, {
          description: 'Enable it in your Privy dashboard → Login Methods.',
          duration: 5000,
        });
        try { 
          event.preventDefault(); 
          event.stopImmediatePropagation();
        } catch {}
      }
    };
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'discord', 'github', 'apple'],
        appearance: {
          theme: 'dark',
          accentColor: '#6366f1',
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <PrivyErrorHandler />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#e2e8f0',
          },
          classNames: {
            description: '!text-white',
          },
        }}
      />
      {children}
    </PrivyProvider>
  );
}