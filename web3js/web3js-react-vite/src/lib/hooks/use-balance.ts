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
    let latestSlot = -1n;

    const update = (slot: bigint, lamports: bigint) => {
      if (!active || slot < latestSlot) return;
      latestSlot = slot;
      setState({ key, lamports, error: null });
    };

    connection
      .getBalanceAndContext(publicKey, "confirmed")
      .then(({ context, value }) => update(context.slot, value))
      .catch((error: unknown) => {
        if (active && latestSlot < 0n) {
          setState({ key, lamports: null, error });
        }
      });

    const subscriptionId = connection.onAccountChange(
      publicKey,
      ({ lamports }, context) => update(context.slot, lamports),
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
