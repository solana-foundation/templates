"use client";

import { useWallet } from "@solana/wallet-adapter";
import { useCluster } from "../cluster-context";
import { AccountCard } from "./account-card";
import { SignInCard } from "./sign-in-card";
import { SignMessageCard } from "./sign-message-card";
import { TokenCard } from "./token-card";
import { TransferSolCard } from "./transfer-sol-card";

export function ActionsPanel() {
  const { publicKey, signer, status } = useWallet();
  const { cluster } = useCluster();

  if (status === "pending" || status === "reconnecting") {
    return (
      <div
        className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted"
        role="status"
      >
        Restoring wallet connection...
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted">
        Connect a wallet to try the on-chain actions.
      </div>
    );
  }

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2">
      {cluster === "mainnet" && (
        <p className="sm:col-span-2 rounded-lg border border-border-low bg-card px-4 py-3 text-sm text-muted">
          Mainnet transactions use real SOL and tokens. Review every wallet
          prompt before signing.
        </p>
      )}
      <AccountCard />
      <SignInCard />
      <SignMessageCard />
      {signer ? (
        <>
          <TransferSolCard />
          <TokenCard key={`${cluster}:${publicKey.toBase58()}`} />
        </>
      ) : (
        <p className="sm:col-span-2 rounded-lg border border-border-low bg-card px-4 py-3 text-sm text-muted">
          This wallet account is connected in read-only mode and cannot sign
          transactions. Connect a signing-capable account to use these actions.
        </p>
      )}
    </section>
  );
}
