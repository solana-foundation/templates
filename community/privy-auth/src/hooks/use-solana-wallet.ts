"use client";

import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { WalletWithMetadata } from "@privy-io/react-auth";
import { isSolanaWallet, isEmbeddedWallet } from "@/types/privy";

interface SolanaWalletInfo {
  address: string;
  walletClientType: string;
  isEmbedded: boolean;
}

export function useSolanaWallet() {
  const { user, ready, authenticated } = usePrivy();

  const wallets = useMemo(() => {
    if (!user?.linkedAccounts) {
      return {
        embedded: null as SolanaWalletInfo | null,
        external: [] as SolanaWalletInfo[],
        all: [] as SolanaWalletInfo[],
      };
    }

    const solanaWallets: SolanaWalletInfo[] = user.linkedAccounts
      .filter(isSolanaWallet)
      .map((account) => {
        const w = account as WalletWithMetadata;
        return {
          address: w.address,
          walletClientType: w.walletClientType ?? "unknown",
          isEmbedded: isEmbeddedWallet(account),
        };
      });

    const embedded = solanaWallets.find((w) => w.isEmbedded) ?? null;
    const external = solanaWallets.filter((w) => !w.isEmbedded);

    return { embedded, external, all: solanaWallets };
  }, [user?.linkedAccounts]);

  return {
    ...wallets,
    ready,
    authenticated,
  };
}
