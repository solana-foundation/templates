'use client';

import UserProfile from '@/components/UserProfile';
import WalletCard from '@/components/WalletCard';
import SetupChecklist from '@/components/SetupChecklist';
import Navbar from '@/components/Navbar';

export default function DashboardPageClient() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <Navbar />

        <div className="divider" />

        <div className="grid grid-cols-1 gap-4">
          <UserProfile />
          <WalletCard />
        </div>

        <SetupChecklist />

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Privy Docs', href: 'https://docs.privy.io' },
            { label: 'Privy Dashboard', href: 'https://dashboard.privy.io' },
            { label: 'Solana Docs', href: 'https://solana.com/docs' },
            { label: 'Template Repo', href: 'https://github.com/solana-foundation/templates' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="card px-4 py-3 text-sm text-white/50 hover:text-white/80 hover:border-white/15 transition-all flex items-center justify-between group"
            >
              {label}
              <span className="text-white/20 group-hover:text-indigo-400 transition-colors">↗</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
