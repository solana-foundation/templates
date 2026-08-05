"use client";

import { useState } from "react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import {
  ASSETS_PER_PAGE,
  useOwnedAssets,
} from "../../lib/hooks/use-owned-assets";
import { NftCard } from "./nft-card";

/**
 * A `Method not found` means the endpoint is a plain Solana RPC with no DAS indexer behind
 * it, which is the common case on devnet and needs a different fix than a bad request.
 */
function describeError(error: Error) {
  if (/-32601|Method not found/i.test(error.message)) {
    return "This endpoint does not serve the DAS API. Set NEXT_PUBLIC_DAS_URL to a provider that indexes this cluster (Helius, Triton, QuickNode, Shyft).";
  }
  return error.message;
}

export function NftViewer() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const walletAddress = connected?.account.address;

  // `null` means "follow the connected wallet", so connecting one fills the field in
  // without overwriting an address the user typed.
  const [typedOwner, setTypedOwner] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const owner = typedOwner ?? walletAddress ?? "";
  const { assets, isInvalidAddress, isLoading, error } = useOwnedAssets(
    owner,
    page
  );

  const updateOwner = (value: string | null) => {
    setTypedOwner(value);
    setPage(1);
  };

  return (
    <section className="mt-8">
      <div className="flex gap-2">
        <input
          value={owner}
          onChange={(e) => updateOwner(e.target.value)}
          placeholder="Owner address"
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring"
        />
        {walletAddress && owner !== walletAddress && (
          <button
            onClick={() => updateOwner(null)}
            className="shrink-0 cursor-pointer rounded-lg border border-border-low px-3 py-2 text-xs font-medium transition hover:bg-accent"
          >
            My wallet
          </button>
        )}
      </div>

      {isInvalidAddress && (
        <p className="mt-4 text-xs text-destructive">Not a valid address.</p>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-border-low bg-card p-4 text-xs text-muted">
          {describeError(error)}
        </p>
      )}

      {!error && owner && !isInvalidAddress && (
        <>
          {isLoading && assets.length === 0 ? (
            <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-accent"
                />
              ))}
            </div>
          ) : assets.length === 0 ? (
            <p className="mt-4 rounded-lg border border-border-low bg-card p-4 text-xs text-muted">
              No assets found for this wallet.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {assets.map((asset) => (
                <NftCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}

          {(page > 1 || assets.length === ASSETS_PER_PAGE) && (
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted">Page {page}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1 || isLoading}
                  className="cursor-pointer rounded-lg border border-border-low px-3 py-1.5 font-medium transition hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={assets.length < ASSETS_PER_PAGE || isLoading}
                  className="cursor-pointer rounded-lg border border-border-low px-3 py-1.5 font-medium transition hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
