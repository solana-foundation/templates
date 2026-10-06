import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { formatAmount } from "../../lib/amount";
import { useCluster } from "../../lib/cluster-context";
import { getExplorerUrl } from "../../lib/explorer";
import { useBalance } from "../../lib/hooks/use-balance";

const SOL_DECIMALS = 9;

export function WalletCard() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { cluster } = useCluster();
  const balance = useBalance(publicKey);
  const [isAirdropping, setIsAirdropping] = useState(false);

  if (!publicKey) return null;
  const address = publicKey.toBase58();

  const handleAirdrop = async () => {
    setIsAirdropping(true);
    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );
      const latest = await connection.getLatestBlockhash("confirmed");
      const { value } = await connection.confirmTransaction(
        { signature, ...latest },
        "confirmed"
      );
      if (value.err) {
        throw new Error(
          `Airdrop transaction failed: ${JSON.stringify(value.err, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
          )}`
        );
      }
      toast.success("Airdropped 1 SOL", {
        description: (
          <a
            href={getExplorerUrl(`/tx/${signature}`, cluster)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View transaction
          </a>
        ),
      });
    } catch (err) {
      console.error(err);
      toast.error(
        "Airdrop failed. Public faucets are rate-limited — try faucet.solana.com."
      );
    } finally {
      setIsAirdropping(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6 sm:col-span-2">
      <h2 className="text-sm font-semibold">Wallet</h2>
      <p className="mt-1 text-xs text-muted">
        Live balance from <code className="font-mono">getBalance</code> and an{" "}
        <code className="font-mono">onAccountChange</code> subscription.
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums">
            {balance.lamports != null
              ? formatAmount(balance.lamports, SOL_DECIMALS)
              : balance.isLoading
                ? "Loading..."
                : "Unavailable"}{" "}
            {balance.lamports != null && (
              <span className="text-sm font-normal text-muted">SOL</span>
            )}
          </p>
          {balance.error != null && (
            <p className="mt-1 text-xs text-destructive" role="alert">
              Unable to load the wallet balance.
            </p>
          )}
          <a
            href={getExplorerUrl(`/address/${address}`, cluster)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all font-mono text-xs text-muted underline-offset-2 hover:underline"
          >
            {address}
          </a>
        </div>

        {cluster !== "mainnet" && (
          <button
            onClick={handleAirdrop}
            disabled={isAirdropping}
            className="shrink-0 cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isAirdropping ? "Requesting..." : "Airdrop 1 SOL"}
          </button>
        )}
      </div>
    </div>
  );
}
