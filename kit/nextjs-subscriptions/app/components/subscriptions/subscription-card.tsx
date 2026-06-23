"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import type { Delegation } from "@solana/subscriptions";
import { useSubscriptionsClient } from "../../lib/hooks/use-subscriptions-client";
import { useNow } from "../../lib/hooks/use-now";
import { useCluster } from "../cluster-context";
import { DEFAULT_DECIMALS } from "../../lib/subscriptions/constants";
import { fromBaseUnits, formatPeriod } from "../../lib/subscriptions/format";
import { ellipsify } from "../../lib/explorer";
import { parseTransactionError } from "../../lib/errors";

type SubscriptionDelegation = Extract<Delegation, { kind: "subscription" }>;

export function SubscriptionCard({
  subscription,
}: {
  subscription: SubscriptionDelegation;
}) {
  const client = useSubscriptionsClient();
  const { getExplorerUrl } = useCluster();
  const { mutate } = useSWRConfig();
  const [busy, setBusy] = useState(false);

  const planPda = subscription.data.header.delegatee;
  const { terms, expiresAtTs } = subscription.data;
  const nowSec = useNow();

  const isActive = expiresAtTs === 0n;
  const isEnded = expiresAtTs !== 0n && nowSec >= expiresAtTs;
  const isCancelling = expiresAtTs !== 0n && !isEnded;

  const revalidate = () =>
    mutate((key) => Array.isArray(key) && key[0] === "my-subscriptions");

  const run = async (
    action: () => Promise<unknown>,
    successMessage: string
  ) => {
    if (!client) return;
    setBusy(true);
    try {
      await action();
      revalidate();
      toast.success(successMessage);
    } catch (err) {
      console.error(`${successMessage} failed:`, err);
      toast.error(parseTransactionError(err));
    } finally {
      setBusy(false);
    }
  };

  const cancel = () =>
    run(
      () =>
        client!.subscriptions.instructions
          .cancelSubscription({
            planPda,
            subscriptionPda: subscription.address,
          })
          .sendTransaction(),
      "Subscription cancelled"
    );

  const resume = () =>
    run(
      () =>
        client!.subscriptions.instructions
          .resumeSubscription({
            planPda,
            subscriptionPda: subscription.address,
          })
          .sendTransaction(),
      "Subscription resumed"
    );

  const revoke = () =>
    run(
      () =>
        client!.subscriptions.instructions
          .revokeSubscription({
            planPda,
            subscriptionPda: subscription.address,
          })
          .sendTransaction(),
      "Closed — rent reclaimed"
    );

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-2xl font-bold tabular-nums">
            {fromBaseUnits(terms.amount, DEFAULT_DECIMALS)}
            <span className="ml-1.5 text-sm font-normal text-muted">
              / {formatPeriod(terms.periodHours)}
            </span>
          </p>
          <a
            href={getExplorerUrl(`/address/${planPda}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-mono text-xs text-muted underline transition hover:text-foreground"
          >
            plan {ellipsify(planPda, 4)}
          </a>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isActive
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : isCancelling
                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                : "bg-muted/10 text-muted"
          }`}
        >
          {isActive ? "Active" : isCancelling ? "Cancelling" : "Ended"}
        </span>
      </div>

      {isCancelling && (
        <p className="mt-3 text-xs text-muted">
          Ends {new Date(Number(expiresAtTs) * 1000).toLocaleString()}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        {isActive && (
          <button
            onClick={cancel}
            disabled={busy}
            className="cursor-pointer rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium transition hover:bg-cream disabled:pointer-events-none disabled:opacity-50"
          >
            {busy ? "Working..." : "Cancel"}
          </button>
        )}
        {isCancelling && (
          <button
            onClick={resume}
            disabled={busy}
            className="cursor-pointer rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium transition hover:bg-cream disabled:pointer-events-none disabled:opacity-50"
          >
            {busy ? "Working..." : "Resume"}
          </button>
        )}
        {isEnded && (
          <button
            onClick={revoke}
            disabled={busy}
            className="cursor-pointer rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
          >
            {busy ? "Working..." : "Close & reclaim rent"}
          </button>
        )}
      </div>
    </div>
  );
}
