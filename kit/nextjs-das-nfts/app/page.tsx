import { NftViewer } from "./components/nft/nft-viewer";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">DAS NFT Viewer</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        The assets a wallet holds, read through{" "}
        <code className="font-mono">client.das.getAssetsByOwner</code>. The DAS
        RPC and the kit plugin that installs it are written from scratch in{" "}
        <code className="font-mono">app/lib/das</code> — a worked example of
        teaching a kit client an API it does not ship with.
      </p>
      <NftViewer />
    </main>
  );
}
