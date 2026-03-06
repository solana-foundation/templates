'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LogoutButton } from '@/components/auth/logout-button'
import { Skeleton } from '@/components/ui/skeleton'

interface LinkedAccount {
  label: string
  value: string
}

export function UserPanel() {
  const { ready, user } = usePrivy()

  if (!ready || !user) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-9 w-24" />
        </CardContent>
      </Card>
    )
  }

  const linkedAccounts: LinkedAccount[] = []

  if (user.email?.address) {
    linkedAccounts.push({ label: 'Email', value: user.email.address })
  }
  if (user.google?.email) {
    linkedAccounts.push({ label: 'Google', value: user.google.email })
  }
  if (user.twitter?.username) {
    linkedAccounts.push({
      label: 'Twitter',
      value: `@${user.twitter.username}`,
    })
  }
  if (user.github?.username) {
    linkedAccounts.push({ label: 'GitHub', value: user.github.username })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Your Privy account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Privy DID</p>
          <p className="break-all rounded-md bg-muted px-3 py-2 font-mono text-xs">{user.id}</p>
        </div>

        {linkedAccounts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Linked Accounts</p>
            <ul className="space-y-1.5">
              {linkedAccounts.map((account) => (
                <li key={account.label} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{account.label}</span>
                  <span className="text-sm">{account.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2">
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  )
}
