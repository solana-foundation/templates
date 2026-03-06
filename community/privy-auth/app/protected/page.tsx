'use client'

import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth/solana'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { truncateAddress } from '@/lib/utils'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <ProtectedContent />
    </AuthGuard>
  )
}

function ProtectedContent() {
  const { user } = usePrivy()
  const { wallets } = useWallets()

  const walletAddress = wallets[0]?.address

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Protected Route</h1>
        <p className="mt-1 text-muted-foreground">This page is only accessible to authenticated users</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>Access Verified</CardTitle>
            <Badge variant="outline" className="gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Authenticated
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">You are authenticated. Your session details are shown below.</p>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Privy DID</p>
            <p className="break-all rounded-md bg-muted px-3 py-2 font-mono text-xs">{user?.id}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Wallet Address</p>
            <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
              {walletAddress ? truncateAddress(walletAddress) : 'No wallet'}
            </p>
          </div>

          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
