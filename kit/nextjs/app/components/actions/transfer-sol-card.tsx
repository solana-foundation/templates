"use client";

import { useState } from "react";
import { address, sol, solToLamports, type Lamports } from "@solana/kit";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { toast } from "sonner";
import { useAppClient } from "../../lib/client-provider";
import { useSend } from "../../lib/hooks/use-send";
import { isCustomProgramError } from "../../lib/errors";

export function TransferSolCard() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const { run, isSending } = useSend();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.01");
  const amountError = getSolAmountError(amount);

  const handleTransfer = async () => {
    const normalizedRecipient = recipient.trim();
    if (!connected?.signer || !normalizedRecipient) return;
    const signer = connected.signer;

    let destination;
    try {
      destination = address(normalizedRecipient);
    } catch {
      toast.error("Invalid recipient address");
      return;
    }

    let transferAmount: Lamports;
    try {
      transferAmount = solToLamports(sol(amount));
    } catch {
      toast.error("Invalid amount");
      return;
    }

    await run(
      () =>
        client.system.instructions
          .transferSol({
            source: signer,
            destination,
            amount: transferAmount,
          })
          .sendTransaction(),
      "SOL transfer sent",
      (error) =>
        isCustomProgramError(error, 1)
          ? "Insufficient SOL balance. Enter a smaller amount and leave enough SOL for transaction fees."
          : undefined
    );
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Transfer SOL</h2>
      <p className="mt-1 text-xs text-muted">
        Send SOL from your connected wallet to any address.
      </p>
      <div className="mt-4 space-y-3">
        <label htmlFor="sol-recipient" className="block text-xs font-medium">
          Recipient address
        </label>
        <input
          id="sol-recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient address"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring"
        />
        <label htmlFor="sol-amount" className="block text-xs font-medium">
          Amount (SOL)
        </label>
        <input
          id="sol-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount (SOL)"
          aria-describedby={amountError ? "sol-amount-error" : undefined}
          aria-invalid={amountError != null}
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
        />
        {amountError && (
          <p id="sol-amount-error" className="text-xs text-destructive">
            {amountError}
          </p>
        )}
        <button
          onClick={handleTransfer}
          disabled={isSending || !recipient.trim() || amountError != null}
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send SOL"}
        </button>
      </div>
    </div>
  );
}

function getSolAmountError(amount: string): string | null {
  try {
    const lamports = solToLamports(sol(amount));
    return lamports > 0n ? null : "Amount must be greater than zero";
  } catch {
    return "Enter a valid SOL amount";
  }
}
