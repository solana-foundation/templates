'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { UserPanel } from '@/components/dashboard/user-panel'
import { WalletPanel } from '@/components/dashboard/wallet-panel'
import { ActionsPanel } from '@/components/dashboard/actions-panel'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Your Privy auth & wallet overview</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UserPanel />
          <WalletPanel />
        </div>

        <div className="mt-6">
          <ActionsPanel />
        </div>
      </div>
    </AuthGuard>
  )
}
