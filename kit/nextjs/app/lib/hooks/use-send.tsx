"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCluster } from "../../components/cluster-context";
import { parseTransactionError } from "../errors";

type TxResult = { context: { signature: string } };

export function useSend() {
  const { getExplorerUrl } = useCluster();
  const [isSending, setIsSending] = useState(false);

  async function run<T extends TxResult>(
    action: () => Promise<T>,
    successMessage: string
  ) {
    setIsSending(true);
    try {
      const result = await action();
      const signature = result.context.signature;
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
      return undefined;
    } finally {
      setIsSending(false);
    }
  }

  return { run, isSending };
}
