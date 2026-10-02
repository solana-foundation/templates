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
    let receivedUpdate = false;

    connection.getBalance(publicKey).then(
      (lamports) =>
        active && !receivedUpdate && setState({ key, lamports, error: false }),
      () =>
        active &&
        !receivedUpdate &&
        setState({ key, lamports: null, error: true })
    );
    const subscriptionId = connection.onAccountChange(publicKey, (account) => {
      receivedUpdate = true;
      if (active) setState({ key, lamports: account.lamports, error: false });
    });

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
