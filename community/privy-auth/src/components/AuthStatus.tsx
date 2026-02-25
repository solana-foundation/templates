'use client';

import { usePrivy } from '@privy-io/react-auth';
import { cn } from '@/lib/utils';

export default function AuthStatus({ className }: { className?: string }) {
  const { ready, authenticated } = usePrivy();
  const status = !ready ? 'loading' : authenticated ? 'authenticated' : 'unauthenticated';

  const config = {
    loading: {
      dot: 'bg-yellow-400 animate-pulse',
      label: 'Connecting…',
      text: 'text-yellow-400',
    },
    authenticated: {
      dot: 'bg-emerald-400',
      label: 'Connected',
      text: 'text-emerald-400',
    },
    unauthenticated: {
      dot: 'bg-white/30',
      label: 'Not connected',
      text: 'text-white/40',
    },
  };

  const { dot, label, text } = config[status];

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('size-2 rounded-full', dot)} />
      <span className={cn('text-xs font-medium tracking-wide uppercase', text)}>{label}</span>
    </div>
  );
}
