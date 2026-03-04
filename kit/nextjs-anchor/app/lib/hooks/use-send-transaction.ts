"use client";

import { useState, useCallback, useMemo } from "react";
import { useSWRConfig } from "swr";
import {
  getFirstFailedSingleTransactionPlanResult,
  isSolanaError,
  SOLANA_ERROR__INSTRUCTION_PLANS__FAILED_TO_EXECUTE_TRANSACTION_PLAN,
  type Instruction,
} from "@solana/kit";
import { createClient } from "@solana/kit-client-rpc";
import { useWallet } from "../wallet/context";
import { useCluster } from "../../components/cluster-context";
import { getClusterUrl, getClusterWsConfig } from "../solana-client";

function isTransactionSigner(
  signer: unknown
): signer is { address: string } & Record<string, unknown> {
  if (typeof signer !== "object" || signer === null) return false;
  // Accept any signer type the kit pipeline can use:
  // TransactionPartialSigner (signTransactions)
  // TransactionModifyingSigner (modifyAndSignTransactions)
  // TransactionSendingSigner (signAndSendTransactions)
  return (
    "address" in signer &&
    (("signTransactions" in signer &&
      typeof signer.signTransactions === "function") ||
      ("modifyAndSignTransactions" in signer &&
        typeof signer.modifyAndSignTransactions === "function") ||
      ("signAndSendTransactions" in signer &&
        typeof signer.signAndSendTransactions === "function"))
  );
}

function unwrapPlanExecutionError(err: unknown): unknown {
  if (
    !isSolanaError(
      err,
      SOLANA_ERROR__INSTRUCTION_PLANS__FAILED_TO_EXECUTE_TRANSACTION_PLAN
    )
  ) {
    return err;
  }

  const withContext = err as {
    context?: { transactionPlanResult?: unknown };
    transactionPlanResult?: unknown;
  };

  const result =
    withContext.context?.transactionPlanResult ??
    withContext.transactionPlanResult;

  if (!result) return err;

  try {
    const failed = getFirstFailedSingleTransactionPlanResult(result as never);
    if (failed.error instanceof Error) {
      return failed.error;
    }
    if (failed.error != null) {
      return new Error(String(failed.error));
    }
  } catch {
    // continue to fallback parsing below
  }

  const canceled = findFirstCanceledSingleResult(result);
  if (canceled?.context?.signature) {
    return new Error(
      `Transaction confirmation timed out. Signature: ${canceled.context.signature}`
    );
  }
  if (canceled) {
    return new Error("Transaction confirmation timed out before final status");
  }

  return err;
}

function findFirstCanceledSingleResult(result: unknown):
  | {
      kind?: string;
      status?: string;
      context?: { signature?: string };
      plans?: unknown[];
    }
  | undefined {
  if (typeof result !== "object" || result === null) return undefined;

  const candidate = result as {
    kind?: string;
    status?: string;
    context?: { signature?: string };
    plans?: unknown[];
  };

  if (candidate.kind === "single" && candidate.status === "canceled") {
    return candidate;
  }

  if (Array.isArray(candidate.plans)) {
    for (const plan of candidate.plans) {
      const found = findFirstCanceledSingleResult(plan);
      if (found) return found;
    }
  }

  return undefined;
}

export function useSendTransaction() {
  const { signer } = useWallet();
  const { cluster } = useCluster();
  const { mutate } = useSWRConfig();
  const [isSending, setIsSending] = useState(false);
  const hasSigner = isTransactionSigner(signer);

  const txClient = useMemo(
    () =>
      signer && hasSigner
        ? createClient({
            url: getClusterUrl(cluster),
            rpcSubscriptionsConfig: getClusterWsConfig(cluster),
            payer: signer,
          })
        : null,
    [cluster, signer, hasSigner]
  );

  const send = useCallback(
    async ({ instructions }: { instructions: readonly Instruction[] }) => {
      if (!signer) throw new Error("Wallet not connected");
      if (!hasSigner) {
        throw new Error(
          "Connected wallet does not support transaction signing"
        );
      }
      if (!txClient) throw new Error("Transaction client unavailable");

      setIsSending(true);
      try {
        const result = await txClient.sendTransaction([...instructions]);

        mutate((key: unknown) => Array.isArray(key) && key[0] === "balance");

        return result.context.signature;
      } catch (err) {
        throw unwrapPlanExecutionError(err);
      } finally {
        setIsSending(false);
      }
    },
    [signer, hasSigner, txClient, mutate]
  );

  return { send, isSending };
}
