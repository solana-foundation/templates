import {
  getTransactionEncoder,
  getTransactionDecoder,
  signatureBytes,
  type TransactionSigner,
  type TransactionSendingSigner,
  type TransactionModifyingSigner,
} from "@solana/kit";
import type { WalletSession } from "./types";

function createSendingSigner(
  session: WalletSession,
  chain: string
): TransactionSendingSigner {
  return {
    address: session.account.address,
    signAndSendTransactions: async (transactions) => {
      const encoder = getTransactionEncoder();
      return Promise.all(
        transactions.map(async (tx) => {
          const wireBytes = new Uint8Array(
            encoder.encode(tx as Parameters<(typeof encoder)["encode"]>[0])
          );
          const sigBytes = await session.sendTransaction!(wireBytes, chain);
          return signatureBytes(sigBytes);
        })
      );
    },
  };
}

/**
 * Uses TransactionModifyingSigner so the full signed transaction returned
 * by the wallet is preserved. This is critical because wallet-standard
 * signTransaction may return a modified transaction (e.g. added memo,
 * changed compute budget). Extracting only signatures and applying them
 * to the original message would cause a signature/message mismatch.
 */
function createModifyingSigner(
  session: WalletSession,
  chain: string
): TransactionModifyingSigner {
  return {
    address: session.account.address,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modifyAndSignTransactions: (async (transactions: readonly unknown[]) => {
      const encoder = getTransactionEncoder();
      const decoder = getTransactionDecoder();
      return Promise.all(
        transactions.map(async (tx) => {
          const wireBytes = new Uint8Array(
            encoder.encode(tx as Parameters<(typeof encoder)["encode"]>[0])
          );
          const signedBytes = await session.signTransaction!(wireBytes, chain);
          const signedTx = decoder.decode(signedBytes);
          // Return the full decoded transaction — preserving whatever the
          // wallet signed (including any message modifications).
          // Carry over the lifetimeConstraint from the original transaction
          // since it's runtime metadata not present in the wire format.
          return Object.freeze({
            ...signedTx,
            ...("lifetimeConstraint" in (tx as Record<string, unknown>)
              ? {
                  lifetimeConstraint: (tx as Record<string, unknown>)
                    .lifetimeConstraint,
                }
              : {}),
          });
        })
      );
    }) as unknown as TransactionModifyingSigner["modifyAndSignTransactions"],
  };
}

export function createWalletSigner(
  session: WalletSession,
  chain: string
): TransactionSigner {
  if (session.signTransaction) {
    return createModifyingSigner(session, chain);
  }
  if (session.sendTransaction) {
    return createSendingSigner(session, chain);
  }
  throw new Error("Wallet does not support transaction signing");
}
