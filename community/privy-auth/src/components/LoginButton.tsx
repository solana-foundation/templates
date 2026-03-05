'use client'

import { usePrivy } from '@privy-io/react-auth'
import { cn } from '@/lib/utils'

interface LoginButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoginButton({ className, size = 'md' }: LoginButtonProps) {
  const { ready, authenticated, login, logout } = usePrivy()

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  if (!ready) {
    return (
      <button
        disabled
        className={cn(
          'relative inline-flex items-center gap-2 rounded-xl font-semibold',
          'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
          'cursor-not-allowed opacity-60',
          sizes[size],
          className,
        )}
      >
        <span className="size-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
        Connecting…
      </button>
    )
  }

  if (authenticated) {
    return null
  }

  return (
    <button
      onClick={login}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-xl font-semibold',
        'bg-indigo-600 text-white border border-indigo-500',
        'hover:bg-indigo-500 transition-all duration-200',
        sizes[size],
        className,
      )}
    >
      Connect with
      <img src="/privy.png" alt="Privy" width={70} height={70} className="mt-0.5" />
    </button>
  )
}
