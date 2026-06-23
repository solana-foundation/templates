"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import {
  SUBSCRIPTIONS_ERROR__ALREADY_SUBSCRIBED,
  type Delegation,
  type PlanWithAddress,
} from "@solana/subscriptions";
import { useSubscriptionsClient } from "../../lib/hooks/use-subscriptions-client";
import { useSubscriptionAuthority } from "../../lib/hooks/use-subscription-authority";
import { useNow } from "../../lib/hooks/use-now";
import { useWallet } from "../../lib/wallet/context";
import { useCluster } from "../cluster-context";
import {
  getAtaAddress,
  findSubscriptionDelegationPda,
} from "../../lib/subscriptions/pdas";
import {
  TOKEN_PROGRAM_ADDRESS,
  DEFAULT_DECIMALS,
} from "../../lib/subscriptions/constants";
import { fromBaseUnits, formatPeriod } from "../../lib/subscriptions/format";
import { ellipsify } from "../../lib/explorer";
import { getCustomErrorCode, parseTransactionError } from "../../lib/errors";

type SubscriptionDelegation = Extract<Delegation, { kind: "subscription" }>;

export function SubscribeCard({
  plan,
  subscription,
}: {
  plan: PlanWithAddress;
  subscription?: SubscriptionDelegation;
}) {
  const client = useSubscriptionsClient();
  const { wallet } = useWallet();
  const { getExplorerUrl } = useCluster();
  const { mutate } = useSWRConfig();
  const me = wallet?.account.address;

  const { owner, data: planData } = plan.data;
  const { terms, mint, planId } = planData;
  const { data: authority } = useSubscriptionAuthority(mint);

  const [busy, setBusy] = useState(false);
  const [optimisticActive, setOptimisticActive] = useState(false);
  const nowSec = useNow();

  const expiresAtTs = subscription?.data.expiresAtTs;
  let state: "none" | "active" | "cancelling" | "ended";
  if (!subscription) state = "none";
  else if (expiresAtTs === 0n) state = "active";
  else if (nowSec < expiresAtTs!) state = "cancelling";
  else state = "ended";
  if (optimisticActive) state = "active";

  const revalidate = () =>
    mutate(
      (key) =>
        Array.isArray(key) &&
        (key[0] === "my-subscriptions" || key[0] === "sub-authority")
    );

  const handleSubscribe = async () => {
    if (!client || !me || authority === undefined) return;
    setBusy(true);
    try {
      if (!authority?.initialized) {
        const userAta = await getAtaAddress(me, mint);
        await client.subscriptions.instructions
          .initSubscriptionAuthority({
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
            userAta,
          })
          .sendTransaction();
      }
      await client.subscriptions.instructions
        .subscribe({ merchant: owner, planId, tokenMint: mint })
        .sendTransaction();

      const [subscriptionPda] = await findSubscriptionDelegationPda({
        planPda: plan.address,
        subscriber: me,
      });
      setOptimisticActive(true);
      toast.success("Subscribed", {
        description: (
          <a
            href={getExplorerUrl(`/address/${subscriptionPda}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View subscription
          </a>
        ),
      });
    } catch (err) {
      if (getCustomErrorCode(err) === SUBSCRIPTIONS_ERROR__ALREADY_SUBSCRIBED) {
        setOptimisticActive(true);
        toast.info("Already subscribed");
      } else {
        console.error("Subscribe failed:", err);
        toast.error(parseTransactionError(err));
      }
    } finally {
      revalidate();
      setBusy(false);
    }
  };

  const handleResume = async () => {
    if (!client || !subscription) return;
    setBusy(true);
    try {
      await client.subscriptions.instructions
        .resumeSubscription({
          planPda: plan.address,
          subscriptionPda: subscription.address,
        })
        .sendTransaction();
      setOptimisticActive(true);
      revalidate();
      toast.success("Subscription resumed");
    } catch (err) {
      console.error("Resume failed:", err);
      toast.error(parseTransactionError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <p className="font-mono text-2xl font-bold tabular-nums">
        {fromBaseUnits(terms.amount, DEFAULT_DECIMALS)}
        <span className="ml-1.5 text-sm font-normal text-muted">
          / {formatPeriod(terms.periodHours)}
        </span>
      </p>
      <p className="mt-1 font-mono text-xs text-muted">
        mint {ellipsify(mint, 4)}
      </p>

      {state === "cancelling" ? (
        <button
          onClick={handleResume}
          disabled={busy}
          className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? "Resuming..." : "Resume"}
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={
            busy ||
            state === "active" ||
            state === "ended" ||
            authority === undefined
          }
          className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {state === "active"
            ? "Subscribed"
            : state === "ended"
              ? "Ended"
              : authority === undefined
                ? "Loading..."
                : busy
                  ? "Subscribing..."
                  : "Subscribe"}
        </button>
      )}
    </div>
  );
}
