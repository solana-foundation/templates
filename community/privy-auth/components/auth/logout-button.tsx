'use client'

import { useLogout } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface LogoutButtonProps {
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  children?: React.ReactNode
}

export function LogoutButton({ className, size, variant = 'outline', children = 'Log Out' }: LogoutButtonProps) {
  const router = useRouter()
  const { logout } = useLogout({
    onSuccess: () => {
      router.push('/')
    },
  })

  return (
    <Button className={className} size={size} variant={variant} onClick={logout}>
      {children}
    </Button>
  )
}
