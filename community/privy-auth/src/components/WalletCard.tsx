'use client';

import { useState } from 'react';
import { Copy, Check, Wallet, ExternalLink } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { truncateAddress, cn } from '@/lib/utils';

export default function WalletCard({ className }: { className?: string }) {
  const { user } = usePrivy();
  const [copied, setCopied] = useState(false);

  // Find the Solana embedded wallet from the user's linked accounts
  const solanaWallet = user?.linkedAccounts?.find(
    (a) => a.type === 'wallet' && a.chainType === 'solana' && a.connectorType === 'embedded'
  ) as { address: string } | undefined;

  const address = solanaWallet?.address ?? null;

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!address) {
    return (
      <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
        <div className="flex items-center gap-3 text-white/30">
          <Wallet className="size-5" />
          <span className="text-sm">No wallet connected</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="size-5 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Solana Wallet</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30">
          Embedded
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 border border-white/5">
        <span className="font-mono text-sm text-white/80">{truncateAddress(address, 6)}</span>
        <div className="flex items-center gap-2">
          <a
            href={`https://explorer.solana.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
            title="View on Explorer"
          >
            <ExternalLink className="size-3.5" />
          </a>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
            title="Copy address"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-indigo-300/60">
        ✦ Embedded wallet — created automatically on login
      </p>
    </div>
  );
}
