"use client";

import { useState } from "react";
import { address } from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { toast } from "sonner";
import { lamportsFromSol } from "../../lib/lamports";
import { useAppClient } from "../../lib/client-provider";
import { useSend } from "../../lib/hooks/use-send";

export function TransferSolCard() {
  const client = useAppClient();
  const connected = useConnectedWallet();
  const { run, isSending } = useSend();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.01");

  const handleTransfer = async () => {
    if (!connected?.signer || !recipient) return;
    const signer = connected.signer;

    let destination;
    try {
      destination = address(recipient);
    } catch {
      toast.error("Invalid recipient address");
      return;
    }

    const transfer = getTransferSolInstruction({
      source: signer,
      destination,
      amount: lamportsFromSol(Number(amount)),
    });
    await run(() => client.sendTransaction([transfer]), "SOL transfer sent");
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Transfer SOL</h2>
      <p className="mt-1 text-xs text-muted">
        Send SOL from your connected wallet to any address.
      </p>
      <div className="mt-4 space-y-3">
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient address"
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount (SOL)"
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
        />
        <button
          onClick={handleTransfer}
          disabled={isSending || !recipient || Number(amount) <= 0}
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send SOL"}
        </button>
      </div>
    </div>
  );
}
