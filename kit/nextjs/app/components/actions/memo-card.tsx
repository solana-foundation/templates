"use client";

import { useState } from "react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useSend } from "../../lib/hooks/use-send";

// Maximum memo payload that fits Solana's 1,232-byte packet limit with one signer.
const MAX_MEMO_BYTES = 509;
const textEncoder = new TextEncoder();

export function MemoCard() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const { run, isSending } = useSend();
  const [memo, setMemo] = useState("gm from @solana/kit");
  const memoError = getMemoError(memo);

  const handleMemo = async () => {
    if (!connected?.signer || memoError) return;
    const signer = connected.signer;

    await run(
      () =>
        client.memo.instructions
          .addMemo({ memo, signers: [signer] })
          .sendTransaction(),
      "Memo posted"
    );
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Add memo</h2>
      <p className="mt-1 text-xs text-muted">
        Attach an on-chain note with the SPL Memo program via the
        @solana-program/memo kit plugin.
      </p>
      <div className="mt-4 space-y-3">
        <label htmlFor="memo-text" className="block text-xs font-medium">
          Memo
        </label>
        <input
          id="memo-text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Your memo"
          aria-describedby={memoError ? "memo-text-error" : undefined}
          aria-invalid={memoError != null}
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
        />
        {memoError && (
          <p id="memo-text-error" className="text-xs text-destructive">
            {memoError}
          </p>
        )}
        <button
          onClick={handleMemo}
          disabled={isSending || memoError != null}
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSending ? "Posting..." : "Post memo"}
        </button>
      </div>
    </div>
  );
}

function getMemoError(memo: string): string | null {
  if (!memo) return "Memo cannot be empty";

  const byteLength = textEncoder.encode(memo).length;
  return byteLength <= MAX_MEMO_BYTES
    ? null
    : `Memo must be ${MAX_MEMO_BYTES} UTF-8 bytes or fewer`;
}
