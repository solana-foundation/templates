"use client";

import { useWallets, useSignMessage } from "@privy-io/react-auth/solana";
import { useState } from "react";

export default function SignMessage() {
  const { wallets } = useWallets();
  const { signMessage } = useSignMessage();
  const [message, setMessage] = useState("Hello from Solana × Privy!");
  const [signature, setSignature] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wallet = wallets[0];

  async function handleSign() {
    if (!wallet) return;
    setSigning(true);
    setError(null);
    setSignature(null);
    try {
      const encoded = new TextEncoder().encode(message);
      const result = await signMessage({ message: encoded, wallet });
      setSignature(
        typeof result === "string"
          ? result
          : Buffer.from(result.signature).toString("base64")
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign message");
    } finally {
      setSigning(false);
    }
  }

  if (!wallet) return null;

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-400">Sign Message</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-solana-purple focus:outline-none"
          placeholder="Enter a message to sign"
        />
        <button
          onClick={handleSign}
          disabled={signing || !message}
          className="w-full rounded-md bg-gradient-to-r from-solana-purple to-solana-green px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {signing ? "Signing…" : "Sign Message"}
        </button>
        {signature && (
          <div className="rounded-md border border-gray-700/50 bg-gray-800/50 p-3">
            <p className="mb-1 text-xs font-medium text-gray-400">Signature</p>
            <code className="block break-all text-xs text-solana-green">
              {signature}
            </code>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
