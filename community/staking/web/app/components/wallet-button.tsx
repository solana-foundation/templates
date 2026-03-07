"use client";

/**
 * WalletButton — connect / disconnect toggle.
 *
 * Uses useWallet / useConnectWallet / useDisconnectWallet from
 * @solana/react-hooks to interact with the wallet-standard adapters.
 */

import {
  useWallet,
  useDisconnectWallet,
  useWalletModalState,
} from "@solana/react-hooks";
import { shortenAddress } from "@/app/lib/format";

export function WalletButton() {
  const wallet = useWallet();
  const disconnect = useDisconnectWallet();
  const modal = useWalletModalState();

  if (wallet.status === "connected") {
    const addr = wallet.session.account.address.toString();
    return (
      <button
        onClick={() => disconnect()}
        className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium
          hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {shortenAddress(addr)} · Disconnect
      </button>
    );
  }

  return (
    <button
      onClick={() => modal.open()}
      disabled={wallet.status === "connecting"}
      className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white
        hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900
        dark:hover:bg-zinc-300"
    >
      {wallet.status === "connecting" ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
