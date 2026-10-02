"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter";
import type { Signer, Transaction } from "@solana/web3.js";
import { toast } from "sonner";
import { useCluster } from "../../components/cluster-context";
import { parseTransactionError } from "../errors";

export function useSendTransaction() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { getExplorerUrl } = useCluster();
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async (
      buildTransaction: () => Transaction | Promise<Transaction>,
      successMessage: string,
      signers?: Signer[]
    ) => {
      if (!publicKey) return null;
      setIsSending(true);
      try {
        const transaction = await buildTransaction();
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();
        transaction.feePayer = publicKey;
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;

        const signature = await sendTransaction(transaction, connection, {
          minContextSlot,
          signers,
        });
        const { value } = await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "confirmed"
        );
        if (value.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(value.err, (_, v) =>
              typeof v === "bigint" ? v.toString() : v
            )}`
          );
        }

        toast.success(successMessage, {
          description: (
            <a
              href={getExplorerUrl(`/tx/${signature}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View transaction
            </a>
          ),
        });
        return signature;
      } catch (err) {
        console.error(err);
        toast.error(parseTransactionError(err));
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [connection, publicKey, sendTransaction, getExplorerUrl]
  );

  return { send, isSending };
}
