import {
  getTransactionEncoder,
  getTransactionDecoder,
  signatureBytes,
  type TransactionSigner,
  type TransactionSendingSigner,
  type TransactionPartialSigner,
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

function createPartialSigner(session: WalletSession): TransactionPartialSigner {
  return {
    address: session.account.address,
    signTransactions: async (transactions) => {
      const encoder = getTransactionEncoder();
      const decoder = getTransactionDecoder();
      return Promise.all(
        transactions.map(async (tx) => {
          const wireBytes = new Uint8Array(
            encoder.encode(tx as Parameters<(typeof encoder)["encode"]>[0])
          );
          const signedBytes = await session.signTransaction!(wireBytes);
          return decoder.decode(signedBytes) as typeof tx;
        })
      );
    },
  };
}

export function createWalletSigner(
  session: WalletSession,
  chain: string
): TransactionSigner {
  if (session.sendTransaction) {
    return createSendingSigner(session, chain);
  }
  if (session.signTransaction) {
    return createPartialSigner(session);
  }
  throw new Error("Wallet does not support transaction signing");
}
