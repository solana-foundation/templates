import { useState } from "react";
import { getBase58Decoder } from "@solana/kit";
import { useWallet } from "@solana/wallet-adapter";
import { toast } from "sonner";
import { ellipsify } from "../../lib/explorer";
import { parseTransactionError } from "../../lib/errors";

export function SignMessageCard() {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState("Hello from web3.js v3!");
  const [signature, setSignature] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = async () => {
    if (!publicKey || !signMessage) return;
    setIsSigning(true);
    try {
      const bytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(bytes);
      if (!(await publicKey.verifySignature(signatureBytes, bytes))) {
        throw new Error("The wallet returned an invalid signature.");
      }
      setSignature(getBase58Decoder().decode(signatureBytes));
      toast.success("Message signed and verified");
    } catch (err) {
      console.error(err);
      toast.error(parseTransactionError(err));
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Sign message</h2>
      <p className="mt-1 text-xs text-muted">
        Sign arbitrary text with your wallet and verify it with{" "}
        <code className="font-mono">publicKey.verifySignature</code>.
      </p>
      <div className="mt-4 space-y-3">
        <label htmlFor="sign-message" className="block text-xs font-medium">
          Message
        </label>
        <textarea
          id="sign-message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setSignature(null);
          }}
          rows={2}
          className="w-full resize-none rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
        />
        <button
          onClick={handleSign}
          disabled={isSigning || !signMessage || !message}
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {!signMessage
            ? "Wallet cannot sign messages"
            : isSigning
              ? "Signing..."
              : "Sign message"}
        </button>
        {signature && (
          <p className="text-xs text-muted">
            Signature:{" "}
            <span className="font-mono" title={signature}>
              {ellipsify(signature, 8)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
