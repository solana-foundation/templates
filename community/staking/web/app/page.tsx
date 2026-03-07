import { WalletButton } from "./components/wallet-button";
import { PoolStats } from "./components/pool-stats";
import { UserDashboard } from "./components/user-dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* ── Header ────────────────────────────────────── */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight">
            Staking Template
          </h1>
          <WalletButton />
        </div>
      </header>

      {/* ── Main content ──────────────────────────────── */}
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <PoolStats pdas={null} pool={null}/>
        <UserDashboard />
      </main>
    </div>
  );
}
