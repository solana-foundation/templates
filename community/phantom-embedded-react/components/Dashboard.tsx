'use client';

import { useAccounts, useDisconnect } from '@phantom/react-sdk';
import { useEffect, useState } from 'react';
import { getBalance } from '@/lib/solana';
import { truncateAddress, copyToClipboard } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Dashboard component - shown after successful authentication
 * Displays wallet information, balance, and account actions
 */
export function Dashboard() {
  const accounts = useAccounts();
  const { disconnect, isDisconnecting } = useDisconnect();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  const solanaAccount = accounts?.[0];

  useEffect(() => {
    if (solanaAccount?.address) {
      fetchBalance(solanaAccount.address);
    }
  }, [solanaAccount?.address]);

  const fetchBalance = async (address: string) => {
    setIsLoadingBalance(true);
    try {
      const bal = await getBalance(address);
      setBalance(bal);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleCopy = async () => {
    if (solanaAccount?.address) {
      try {
        await copyToClipboard(solanaAccount.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const handleRefresh = () => {
    if (solanaAccount?.address) {
      fetchBalance(solanaAccount.address);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/phantom-logo.png" alt="Phantom" className="w-8 h-8" />
              <span className="text-gray-900 font-semibold text-lg">Phantom Wallet</span>
            </div>
            <button
              onClick={disconnect}
              disabled={isDisconnecting}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              {isDisconnecting ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Balance</p>
              <div className="flex items-baseline gap-2">
                {isLoadingBalance ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-gray-900">Loading...</span>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {balance?.toFixed(4) ?? '0.0000'}
                    </h2>
                    <span className="text-gray-600">SOL</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoadingBalance}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Refresh balance"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Wallet Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-2">Wallet Address</p>
            <div className="flex items-center justify-between gap-4">
              <code className="text-sm text-gray-900 font-mono" title={solanaAccount?.address}>
                {solanaAccount?.address && truncateAddress(solanaAccount.address, 8)}
              </code>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm text-gray-900"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

