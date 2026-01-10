"use client";

import { LazorkitProvider } from "@lazorkit/wallet";

export function Providers({ children }: { children: React.ReactNode }) {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  const ipfsUrl = process.env.NEXT_PUBLIC_IPFS_URL;
  const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;

  if (!rpcUrl || !ipfsUrl || !paymasterUrl) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Configuration Error!</strong>
        <span className="block sm:inline"> Please make sure `NEXT_PUBLIC_SOLANA_RPC_URL`, `NEXT_PUBLIC_IPFS_URL`, and `NEXT_PUBLIC_PAYMASTER_URL` are set in your environment variables.</span>
      </div>
    );
  }

  return (
    <LazorkitProvider
      rpcUrl={rpcUrl}
      ipfsUrl={ipfsUrl}
      paymasterUrl={paymasterUrl}
    >
      {children}
    </LazorkitProvider>
  );
}
