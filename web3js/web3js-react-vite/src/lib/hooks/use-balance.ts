import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter";
import type { PublicKey } from "@solana/web3.js";

type BalanceState = {
  key: string;
  lamports: bigint | null;
  error: unknown;
};

export function useBalance(publicKey: PublicKey | null) {
  const { connection } = useConnection();
  const key = publicKey
    ? `${connection.rpcEndpoint}:${publicKey.toBase58()}`
    : "";
  const [state, setState] = useState<BalanceState>({
    key: "",
    lamports: null,
    error: null,
  });

  useEffect(() => {
    if (!publicKey) return;
    let active = true;

    connection
      .getBalance(publicKey, "confirmed")
      .then((lamports) => {
        if (active) setState({ key, lamports, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ key, lamports: null, error });
      });

    const subscriptionId = connection.onAccountChange(
      publicKey,
      ({ lamports }) => {
        if (active) setState({ key, lamports, error: null });
      },
      "confirmed"
    );

    return () => {
      active = false;
      void connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey, key]);

  const current = state.key === key ? state : null;
  return {
    lamports: current?.lamports ?? null,
    error: current?.error ?? null,
    isLoading: publicKey != null && current == null,
  };
}
