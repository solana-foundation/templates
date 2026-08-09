"use client";

import { SignInCard } from "./signin-card";

export function SignInHome() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">
        Sign In With Hardware Wallet
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        Wallet authentication for hardware wallets that cannot sign arbitrary
        off-chain messages. The wallet signs a memo transaction carrying a
        server nonce; the server verifies the signature off-chain and never
        broadcasts the transaction. Built on @solana/kit, the kit plugin client,
        and @solana/react.
      </p>
      <SignInCard />
    </main>
  );
}
