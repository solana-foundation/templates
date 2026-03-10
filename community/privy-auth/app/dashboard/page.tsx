'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth/solana'
import { WalletInfo } from '@/components/wallet/wallet-info'
import { SignMessage } from '@/components/wallet/sign-message'
import { Wallet, Key, User, Code } from 'lucide-react'

/**
 * Dashboard page — protected by AuthGuard.
 * Only accessible to authenticated users.
 * Shows wallet info, sign message demo, linked accounts, and user JSON.
 */
function DashboardContent() {
  const { user } = usePrivy()
  const { wallets } = useWallets()

  if (!user) return null

  // Collect linked accounts for display
  const linkedAccounts: { type: string; value: string }[] = []
  if (user.email) linkedAccounts.push({ type: 'Email', value: user.email.address })
  if (user.google)
    linkedAccounts.push({
      type: 'Google',
      value: user.google.email || user.google.name || 'Connected',
    })
  if (user.twitter)
    linkedAccounts.push({
      type: 'Twitter',
      value: `@${user.twitter.username}`,
    })
  if (user.discord)
    linkedAccounts.push({
      type: 'Discord',
      value: user.discord.username || 'Connected',
    })
  if (user.github)
    linkedAccounts.push({
      type: 'GitHub',
      value: user.github.username || 'Connected',
    })

  return (
    <div className="dashboard">
      <div className="dashboard-header animate-fade-in">
        <h1>Dashboard</h1>
        <p>Welcome back! This is a protected route — only authenticated users can see this page.</p>
      </div>

      <div className="dashboard-grid">
        {/* Wallet Info Card */}
        <div className="dashboard-card animate-fade-in">
          <h2>
            <Wallet size={18} className="card-icon" />
            Solana Wallet
          </h2>
          <WalletInfo wallets={wallets} />
        </div>

        {/* Sign Message Card */}
        <div className="dashboard-card animate-fade-in">
          <h2>
            <Key size={18} className="card-icon" />
            Sign Message
          </h2>
          <SignMessage wallets={wallets} />
        </div>

        {/* Linked Accounts Card */}
        <div className="dashboard-card animate-fade-in">
          <h2>
            <User size={18} className="card-icon" />
            Linked Accounts
          </h2>
          {linkedAccounts.length > 0 ? (
            <div className="accounts-list">
              {linkedAccounts.map((account) => (
                <div key={account.type} className="account-row">
                  <span className="account-type">{account.type}</span>
                  <span className="account-value">{account.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No linked accounts found.</p>
          )}
        </div>

        {/* User Object Debug Card */}
        <div className="dashboard-card animate-fade-in">
          <h2>
            <Code size={18} className="card-icon" />
            User Object
          </h2>
          <div className="user-json">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
