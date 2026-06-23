"use client";

import { useWallet } from "./lib/wallet/context";
import { usePlans } from "./lib/hooks/use-plans";
import { useMySubscriptions } from "./lib/hooks/use-my-subscriptions";
import { useMerchant } from "./lib/hooks/use-merchant";
import { SubscribeCard } from "./components/subscriptions/subscribe-card";
import { CreateDemoPlan } from "./components/subscriptions/create-demo-plan";

export default function Home() {
  const { status } = useWallet();
  const { merchant } = useMerchant();
  const { data: plans, isLoading } = usePlans(merchant ?? undefined);
  const { data: mySubs } = useMySubscriptions();
  const subByPlan = new Map(
    (mySubs ?? []).map((s) => [s.data.header.delegatee, s])
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">Subscribe</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        Pick a plan and subscribe. Subscribing approves the program to pull each
        billing period; you can cancel or resume anytime from{" "}
        <span className="font-medium">My Subscriptions</span>.
      </p>

      {status !== "connected" ? (
        <div className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted">
          Connect a wallet to subscribe.
        </div>
      ) : merchant === null ? (
        <CreateDemoPlan />
      ) : isLoading ? (
        <p className="mt-8 text-sm text-muted">Loading plans...</p>
      ) : plans && plans.length > 0 ? (
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {plans.map((plan) => (
            <SubscribeCard
              key={plan.address}
              plan={plan}
              subscription={subByPlan.get(plan.address)}
            />
          ))}
        </section>
      ) : (
        <p className="mt-8 text-sm text-muted">
          This merchant has no plans yet.
        </p>
      )}
    </main>
  );
}
