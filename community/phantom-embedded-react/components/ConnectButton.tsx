'use client';

import { useConnect, useAccounts, useDisconnect } from '@phantom/react-sdk';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Wallet connection button component
 * Uses Phantom Connect OAuth authentication (Google/Apple login)
 * Provides separate buttons for Google and Apple login
 */
export function ConnectButton() {
  // Get connection functionality from Phantom SDK
  const { connect, isConnecting } = useConnect();
  
  // Get connected accounts to check connection state
  const accounts = useAccounts();
  
  // Get disconnect functionality
  const { disconnect, isDisconnecting } = useDisconnect();
  
  // Check if wallet is connected
  const isConnected = accounts && accounts.length > 0;

  // Show disconnect button when connected
  if (isConnected) {
    return (
      <button
        onClick={disconnect}
        disabled={isDisconnecting}
        className="px-6 py-3 bg-gray-800 text-gray-400 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center min-w-[200px]"
      >
        {isDisconnecting ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Disconnecting...</span>
          </>
        ) : (
          'Disconnect'
        )}
      </button>
    );
  }

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await connect({ provider: 'google' });
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  // Handle Apple login
  const handleAppleLogin = async () => {
    try {
      await connect({ provider: 'apple' });
    } catch (error) {
      console.error('Apple login failed:', error);
    }
  };

  // Show separate Google and Apple login buttons when not connected
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={isConnecting}
        className="w-full px-6 py-3.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-300 shadow-sm hover:shadow-md"
      >
        {isConnecting ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="flex-1 text-center">Continue with Google</span>
          </>
        )}
      </button>

      {/* Apple Login Button */}
      <button
        onClick={handleAppleLogin}
        disabled={isConnecting}
        className="w-full px-6 py-3.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
      >
        {isConnecting ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="flex-1 text-center">Continue with Apple</span>
          </>
        )}
      </button>

      {/* Divider with text */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 text-gray-500">
            Powered by Phantom
          </span>
        </div>
      </div>
    </div>
  );
}

