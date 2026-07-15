"use client";

import { useState } from "react";
import { address, generateKeyPairSigner, type Address } from "@solana/kit";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { toast } from "sonner";
import { useAppClient } from "../../lib/client-provider";
import { useCluster } from "../cluster-context";
import { useSend } from "../../lib/hooks/use-send";
import { ellipsify } from "../../lib/explorer";

const DECIMALS = 9;

function toBaseUnits(amount: string): bigint {
  return BigInt(Math.round(Number(amount) * 10 ** DECIMALS));
}

export function TokenCard() {
  const client = useAppClient();
  const connected = useConnectedWallet();
  const { getExplorerUrl } = useCluster();
  const { run, isSending } = useSend();

  const [mint, setMint] = useState<Address | null>(null);
  const [mintAmount, setMintAmount] = useState("100");
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("10");

  const handleCreateMint = async () => {
    const signer = connected?.signer;
    if (!signer) return;

    const newMint = await generateKeyPairSigner();
    const signature = await run(
      () =>
        client.token.instructions
          .createMint({
            newMint,
            decimals: DECIMALS,
            mintAuthority: signer.address,
          })
          .sendTransaction(),
      "Token mint created"
    );
    if (signature) setMint(newMint.address);
  };

  const handleMint = async () => {
    const signer = connected?.signer;
    if (!signer || !mint) return;

    await run(
      () =>
        client.token.instructions
          .mintToATA({
            mint,
            owner: signer.address,
            mintAuthority: signer,
            amount: toBaseUnits(mintAmount),
            decimals: DECIMALS,
          })
          .sendTransaction(),
      "Tokens minted to your wallet"
    );
  };

  const handleTransfer = async () => {
    const signer = connected?.signer;
    if (!signer || !mint || !recipient) return;

    let destination: Address;
    try {
      destination = address(recipient);
    } catch {
      toast.error("Invalid recipient address");
      return;
    }

    await run(
      () =>
        client.token.instructions
          .transferToATA({
            mint,
            authority: signer,
            recipient: destination,
            amount: toBaseUnits(transferAmount),
            decimals: DECIMALS,
          })
          .sendTransaction(),
      "Tokens transferred"
    );
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Token</h2>
      <p className="mt-1 text-xs text-muted">
        Create an SPL token mint, then mint and transfer with the{" "}
        <code className="font-mono">@solana-program/token</code> kit plugin —
        associated token accounts are created for you.
      </p>

      {!mint ? (
        <button
          onClick={handleCreateMint}
          disabled={isSending}
          className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSending ? "Creating..." : `Create mint (${DECIMALS} decimals)`}
        </button>
      ) : (
        <div className="mt-4 space-y-5">
          <p className="text-xs text-muted">
            Mint:{" "}
            <a
              href={getExplorerUrl(`/address/${mint}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono underline"
            >
              {ellipsify(mint)}
            </a>
          </p>

          <div className="space-y-3">
            <input
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              type="number"
              min="0"
              step="1"
              placeholder="Amount to mint"
              className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
            <button
              onClick={handleMint}
              disabled={isSending || Number(mintAmount) <= 0}
              className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSending ? "Working..." : "Mint to my wallet"}
            </button>
          </div>

          <div className="space-y-3 border-t border-border-low pt-5">
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient address"
              className="w-full rounded-lg border border-border-low bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring"
            />
            <input
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              type="number"
              min="0"
              step="1"
              placeholder="Amount to transfer"
              className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
            <button
              onClick={handleTransfer}
              disabled={isSending || !recipient || Number(transferAmount) <= 0}
              className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSending ? "Working..." : "Transfer tokens"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
