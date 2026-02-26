'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Zap, LogOut } from 'lucide-react';
import AuthStatus from '@/components/AuthStatus';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, logout } = usePrivy();

  const handleDisconnect = useCallback(async () => {
    await logout();
    router.push('/');
  }, [logout, router]);

  const isDashboard = pathname === '/dashboard';

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isDashboard && (
          <Link
            href="/"
            className="flex items-center justify-center size-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/10"
            title="Back to Home"
          >
            ←
          </Link>
        )}
      <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold text-white text-lg">Privy Auth</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <AuthStatus />
        {authenticated && ready && (
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-1.5 text-xs font-medium text-red-400/70 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all"
          >
            Disconnect
            <LogOut className="size-3.5" />
          </button>
        )}
      </div>
    </nav>
  );
}
