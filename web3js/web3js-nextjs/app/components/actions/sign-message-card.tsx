"use client";

import { useState } from "react";
import { getBase58Decoder } from "@solana/kit";
import { useWallet } from "@solana/wallet-adapter";
import { toast } from "sonner";
import { parseTransactionError } from "../../lib/errors";
import { ellipsify } from "../../lib/explorer";

export function SignMessageCard() {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState("gm from @solana/web3.js v3");
  const [signature, setSignature] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSign = async () => {
    if (!publicKey || !signMessage || !message) return;
    setBusy(true);
    try {
      const bytes = new TextEncoder().encode(message);
      const signed = await signMessage(bytes);
      if (!(await publicKey.verifySignature(signed, bytes))) {
        throw new Error("The wallet returned an invalid signature.");
      }
      setSignature(getBase58Decoder().decode(signed));
      toast.success("Message signed and verified");
    } catch (err) {
      console.error(err);
      toast.error(parseTransactionError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Sign message</h2>
      <p className="mt-1 text-xs text-muted">
        Sign arbitrary text and verify it locally with{" "}
        <code className="font-mono">publicKey.verifySignature</code>.
      </p>
      <div className="mt-4 space-y-3">
        <label htmlFor="sign-message" className="block text-xs font-medium">
          Message
        </label>
        <input
          id="sign-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message to sign"
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
        />
        {!signMessage && (
          <p className="text-xs text-muted">
            This wallet account cannot sign messages.
          </p>
        )}
        <button
          onClick={handleSign}
          disabled={busy || !signMessage || !message}
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? "Signing..." : "Sign message"}
        </button>
        {signature && (
          <p className="text-xs text-muted" title={signature}>
            Signature:{" "}
            <span className="font-mono">{ellipsify(signature, 8)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
