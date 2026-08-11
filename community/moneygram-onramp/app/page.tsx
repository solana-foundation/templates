"use client";

import { ActionsPanel } from "./components/actions/actions-panel";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">
        MoneyGram Ramps × Solana Kit
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        A reference for the MoneyGram team: cash-out wired to the @solana/kit
        plugin client. The widget&apos;s <code>onSignTransaction</code> callback
        signs a USDC transfer with the <code>@solana-program/token</code> plugin
        — one <code>transferToATA</code> call, no manual ATA / blockhash /
        compute-budget plumbing. Connect a devnet wallet and try it below.
      </p>
      <ActionsPanel />
    </main>
  );
}
