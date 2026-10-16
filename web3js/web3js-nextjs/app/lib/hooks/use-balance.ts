"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter";
import type { PublicKey } from "@solana/web3.js";

type BalanceState = { key: string; lamports: bigint | null; error: boolean };

export function useBalance(publicKey: PublicKey | null) {
  const { connection } = useConnection();
  const [state, setState] = useState<BalanceState | null>(null);
  const key = publicKey
    ? `${connection.rpcEndpoint}:${publicKey.toBase58()}`
    : null;

  useEffect(() => {
    if (!publicKey || !key) return;
    let active = true;
    let latestSlot = -1n;

    const update = (slot: bigint, lamports: bigint | null) => {
      if (!active || slot < latestSlot) return;
      latestSlot = slot;
      setState({ key, lamports, error: lamports === null });
    };

    connection.getBalanceAndContext(publicKey).then(
      ({ context, value }) => update(context.slot, value),
      () => update(-1n, null)
    );
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (account, context) => update(context.slot, account.lamports)
    );

    return () => {
      active = false;
      void connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey, key]);

  const current = state?.key === key ? state : null;
  return {
    lamports: current?.lamports ?? null,
    isLoading: key !== null && current === null,
    error: current?.error ?? false,
  };
}
