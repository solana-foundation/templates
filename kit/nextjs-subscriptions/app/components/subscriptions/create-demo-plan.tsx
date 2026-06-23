"use client";

import { useState } from "react";
import { generateKeyPairSigner } from "@solana/kit";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useWallet } from "../../lib/wallet/context";
import { useSubscriptionsClient } from "../../lib/hooks/use-subscriptions-client";
import { useMerchant } from "../../lib/hooks/use-merchant";
import { useCluster } from "../cluster-context";
import { DEFAULT_DECIMALS } from "../../lib/subscriptions/constants";
import { parseTransactionError } from "../../lib/errors";

const D = 10n ** BigInt(DEFAULT_DECIMALS);

export function CreateDemoPlan() {
  const { signer } = useWallet();
  const client = useSubscriptionsClient();
  const { setMerchant } = useMerchant();
  const { cluster } = useCluster();
  const { mutate } = useSWRConfig();
  const [busy, setBusy] = useState(false);
  const isMainnet = cluster === "mainnet";

  const handleCreate = async () => {
    if (!signer || !client || isMainnet) return;
    setBusy(true);
    try {
      const mint = await generateKeyPairSigner();
      await client.token.instructions
        .createMint({
          newMint: mint,
          decimals: DEFAULT_DECIMALS,
          mintAuthority: signer.address,
        })
        .sendTransaction();
      await client.token.instructions
        .mintToATA({
          owner: signer.address,
          mint: mint.address,
          mintAuthority: signer,
          amount: 1000n * D,
          decimals: DEFAULT_DECIMALS,
        })
        .sendTransaction();
      await client.subscriptions.instructions
        .createPlan({
          planId: BigInt(Date.now()),
          mint: mint.address,
          amount: 10n * D,
          periodHours: 720n,
          endTs: 0n,
          destinations: [],
          pullers: [],
          metadataUri: "",
        })
        .sendTransaction();

      setMerchant(signer.address);
      mutate((key) => Array.isArray(key) && key[0] === "plans");
      toast.success("Demo plan created — you can subscribe now");
    } catch (err) {
      console.error("Create demo plan failed:", err);
      toast.error(parseTransactionError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">No plans yet</h2>
      <p className="mt-1 max-w-md text-xs text-muted">
        {isMainnet
          ? "Demo plan creation is disabled on mainnet. Switch to devnet, testnet, or localnet to seed a disposable plan."
          : "Create a demo plan with your connected wallet as the merchant. This mints test tokens to you and sets you as the active merchant so you can try subscribing."}{" "}
        For a real app, set{" "}
        <code className="font-mono text-foreground">
          NEXT_PUBLIC_MERCHANT_ADDRESS
        </code>{" "}
        instead.
      </p>
      <button
        onClick={handleCreate}
        disabled={busy || isMainnet}
        className="mt-4 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
      >
        {isMainnet
          ? "Unavailable on mainnet"
          : busy
            ? "Creating..."
            : "Create demo plan"}
      </button>
    </div>
  );
}
