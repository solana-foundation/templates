'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function AuthStatus() {
  const { ready, authenticated, user } = usePrivy()

  if (!ready) return <Skeleton className="h-6 w-24" />
  if (!authenticated) return null

  const label =
    user?.email?.address ??
    user?.google?.email ??
    (user?.twitter?.username ? `@${user.twitter.username}` : null) ??
    user?.github?.username ??
    'Logged in'

  return <Badge variant="secondary">{label}</Badge>
}
