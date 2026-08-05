import type { Metadata } from "next";
import { NftViewer } from "../components/nft/nft-viewer";

export const metadata: Metadata = {
  title: "NFTs — Solana Kit Starter",
  description:
    "Browse the assets a wallet holds through the Metaplex DAS API, read with a custom @solana/kit RPC and plugin",
};

export default function NftsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">NFTs</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        Assets held by a wallet, read through{" "}
        <code className="font-mono">client.das.getAssetsByOwner</code> — a
        custom DAS RPC and kit plugin living in{" "}
        <code className="font-mono">app/lib/das</code>. Set{" "}
        <code className="font-mono">NEXT_PUBLIC_DAS_URL</code> to an indexing
        provider to use this off mainnet.
      </p>
      <NftViewer />
    </main>
  );
}
