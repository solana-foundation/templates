"use client";

import { useState } from "react";
import { getAddMemoInstruction } from "@solana-program/memo";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useSend } from "../../lib/hooks/use-send";

export function MemoCard() {
  const client = useAppClient();
  const connected = useConnectedWallet();
  const { run, isSending } = useSend();
  const [memo, setMemo] = useState("gm from @solana/kit");

  const handleMemo = async () => {
    if (!connected?.signer || !memo) return;
    const signer = connected.signer;

    const memoInstruction = getAddMemoInstruction({
      memo,
      signers: [signer],
    });
    await run(() => client.sendTransaction([memoInstruction]), "Memo posted");
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Add memo</h2>
      <p className="mt-1 text-xs text-muted">
        Attach an on-chain note with the SPL Memo program. Built by hand —
        @solana-program/memo has no client plugin.
      </p>
      <div className="mt-4 space-y-3">
        <input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Your memo"
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
        />
        <button
          onClick={handleMemo}
          disabled={isSending || !memo}
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSending ? "Posting..." : "Post memo"}
        </button>
      </div>
    </div>
  );
}
