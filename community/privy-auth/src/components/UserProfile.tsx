'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Mail, User } from 'lucide-react';
import { getInitials, cn } from '@/lib/utils';

export default function UserProfile({ className }: { className?: string }) {
  const { user } = usePrivy();

  if (!user) return null;

  const email = user.email?.address;
  const name = user.google?.name ?? user.github?.name ?? null;
  const initials = getInitials(name, email);

  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-semibold text-indigo-300">
          {initials}
        </div>
        <div>
          {name && <p className="font-semibold text-white">{name}</p>}
          {email && (
            <div className="flex items-center gap-1.5 text-white/50 text-sm">
              <Mail className="size-3" />
              <span>{email}</span>
            </div>
          )}
          {!name && !email && (
            <div className="flex items-center gap-1.5 text-white/50 text-sm">
              <User className="size-3" />
              <span>Anonymous user</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
