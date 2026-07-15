"use client";

import { ActionsPanel } from "./components/actions/actions-panel";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">Solana Kit Starter</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        A wallet + on-chain actions demo built on @solana/kit, the kit plugin
        client, and @solana/react. Connect a wallet, switch networks from the
        header, and try SOL transfers, token actions, and memos.
      </p>
      <ActionsPanel />
    </main>
  );
}
