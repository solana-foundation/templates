"use client";

import { useWallet } from "../lib/wallet/context";
import { useMySubscriptions } from "../lib/hooks/use-my-subscriptions";
import { SubscriptionCard } from "../components/subscriptions/subscription-card";

export default function SubscriptionsPage() {
  const { status } = useWallet();
  const { data: subscriptions, isLoading } = useMySubscriptions();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">Subscriptions</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        Manage the plans you subscribe to. Cancelling keeps the subscription
        active until the end of the current period; resume anytime before then.
        Once ended, close the account to reclaim its rent.
      </p>

      {status !== "connected" ? (
        <div className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted">
          Connect a wallet to view your subscriptions.
        </div>
      ) : (
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {isLoading ? (
            <p className="text-sm text-muted">Loading subscriptions...</p>
          ) : subscriptions && subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.address}
                subscription={subscription}
              />
            ))
          ) : (
            <p className="text-sm text-muted">
              No subscriptions yet. Find a plan in the marketplace.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
