"use client";

import { useState } from "react";

/**
 * Example component showing how to build and send a SOL transfer
 * using @solana/kit with a Privy embedded wallet.
 *
 * This is a code reference — in production you'd add proper validation,
 * error handling, and confirmation tracking.
 */

const CODE_EXAMPLE = `import { useSolanaWallets } from "@privy-io/react-auth/solana";
import {
  createSolanaRpc,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  getTransferSolInstruction,
  signTransactionMessageWithSigners,
  getBase64EncodedWireTransaction,
  address,
  lamports,
} from "@solana/kit";

// Inside your component:
const { wallets } = useSolanaWallets();
const wallet = wallets[0];

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");
const { value: blockhash } = await rpc
  .getLatestBlockhash({ commitment: "confirmed" })
  .send();

const tx = pipe(
  createTransactionMessage({ version: 0 }),
  (msg) => setTransactionMessageFeePayerSigner(wallet.address, msg),
  (msg) => setTransactionMessageLifetimeUsingBlockhash(blockhash, msg),
  (msg) =>
    appendTransactionMessageInstruction(
      getTransferSolInstruction({
        source: address(wallet.address),
        destination: address("RECIPIENT_ADDRESS"),
        amount: lamports(1_000_000n), // 0.001 SOL
      }),
      msg
    )
);`;

export default function SendTransaction() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">
          Send Transaction (Example)
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-solana-purple hover:text-solana-green transition-colors"
        >
          {expanded ? "Hide Code" : "View Code"}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Reference implementation for building a SOL transfer with{" "}
        <code className="text-gray-400">@solana/kit</code> and a Privy
        embedded wallet.
      </p>
      {expanded && (
        <pre className="mt-3 max-h-80 overflow-auto rounded-md border border-gray-700/50 bg-gray-800/50 p-3 text-xs text-gray-300">
          <code>{CODE_EXAMPLE}</code>
        </pre>
      )}
    </div>
  );
}
