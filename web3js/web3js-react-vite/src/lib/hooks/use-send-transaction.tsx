import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter";
import type { Signer, Transaction } from "@solana/web3.js";
import { toast } from "sonner";
import { useCluster } from "../cluster-context";
import { parseTransactionError } from "../errors";
import { getExplorerUrl } from "../explorer";

type SendOptions = {
  signers?: Signer[];
};

export function useSendTransaction() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { cluster } = useCluster();
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async (
      buildTransaction: () => Transaction | Promise<Transaction>,
      successMessage: string,
      { signers }: SendOptions = {}
    ) => {
      if (!publicKey) return undefined;
      setIsSending(true);
      try {
        const transaction = await buildTransaction();
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext("confirmed");
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
              href={getExplorerUrl(`/tx/${signature}`, cluster)}
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
        return undefined;
      } finally {
        setIsSending(false);
      }
    },
    [cluster, connection, publicKey, sendTransaction]
  );

  return { send, isSending };
}
