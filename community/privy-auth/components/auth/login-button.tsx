'use client'

import { useLogin } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface LoginButtonProps {
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  children?: React.ReactNode
}

export function LoginButton({ className, size, variant, children = 'Log In' }: LoginButtonProps) {
  const router = useRouter()
  const { login } = useLogin({
    onComplete: () => {
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  return (
    <Button className={className} size={size} variant={variant} onClick={login}>
      {children}
    </Button>
  )
}
