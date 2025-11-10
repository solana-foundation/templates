'use client';

import { useAccounts } from '@phantom/react-sdk';
import { useEffect } from 'react';
import { ConnectButton } from '@/components/ConnectButton';
import { Dashboard } from '@/components/Dashboard';

/**
 * Home page - Main entry point for the application
 * Shows landing page when disconnected, dashboard when connected
 */
export default function Home() {
  const accounts = useAccounts();
  const isConnected = accounts && accounts.length > 0;

  // Clean up URL query parameters after OAuth redirect
  useEffect(() => {
    if (isConnected && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.search) {
        // Remove all query parameters
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, [isConnected]);

  if (isConnected) {
    return <Dashboard />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/phantom-logo.png" alt="Phantom" className="w-8 h-8" />
              <span className="text-gray-900 font-semibold text-lg">Phantom Wallet</span>
            </div>
              <a 
                href="https://docs.phantom.com/sdks/react-sdk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Documentation
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand to-plum rounded-2xl mb-6 shadow-lg overflow-hidden">
              <img src="/phantom-logo.png" alt="Phantom" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Welcome to [Your App Name]
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Built with Phantom embedded wallet with easy integration and auth flow
            </p>
          </div>

          {/* Connect Buttons */}
          <ConnectButton />
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <p>Built with Phantom React SDK</p>
              <div className="flex gap-6">
                <a href="https://docs.phantom.com/sdks/react-sdk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  Documentation
                </a>
                <a href="https://phantom.com/portal/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  Portal
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
  );
}

