"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";
import { getAmountError, parseAmount } from "../../lib/amount";
import { useSendTransaction } from "../../lib/hooks/use-send-transaction";

const SOL_DECIMALS = 9;

export function TransferSolCard() {
  const { publicKey } = useWallet();
  const { send, isSending } = useSendTransaction();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.01");
  const amountError = getAmountError(amount, SOL_DECIMALS);

  const handleTransfer = async () => {
    if (!publicKey || amountError) return;

    let toPubkey: PublicKey;
    try {
      toPubkey = new PublicKey(recipient.trim());
    } catch {
      toast.error("Invalid recipient address");
      return;
    }

    await send(
      () =>
        new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey,
            lamports: parseAmount(amount, SOL_DECIMALS),
          })
        ),
      "SOL transfer sent"
    );
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Transfer SOL</h2>
      <p className="mt-1 text-xs text-muted">
        A legacy <code className="font-mono">Transaction</code> with{" "}
        <code className="font-mono">SystemProgram.transfer</code>, sent through
        the wallet adapter.
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
          inputMode="decimal"
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
