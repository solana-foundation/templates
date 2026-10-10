import { ActionsPanel } from "./components/actions/actions-panel";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">Web3.js v3 Starter</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        A wallet + on-chain actions demo built on @solana/web3.js v3 and
        @solana/wallet-adapter v3. Connect a wallet, switch networks from the
        header, sign in with Solana, and try SOL transfers and SPL token
        actions.
      </p>
      <ActionsPanel />
    </main>
  );
}
