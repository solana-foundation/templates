'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { GaslessTransfer } from '@/components/GaslessTransfer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Kora Demo</h1>
          <WalletMultiButton />
        </div>
        <GaslessTransfer />
      </div>
    </main>
  );
}
