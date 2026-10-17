import { Toaster } from "sonner";
import { ActionsPanel } from "./components/actions/actions-panel";
import { AppHeader } from "./components/app-header";
import { GridBackground } from "./components/grid-background";
import { useTheme } from "./lib/hooks/use-theme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <GridBackground />
      <div className="relative z-10">
        <AppHeader theme={theme} onToggleTheme={toggleTheme} />
        <main className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-3xl font-black tracking-tight">
            Web3.js v3 Starter
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            A React + Vite starter built on @solana/web3.js v3 and
            @solana/wallet-adapter v3. Connect a wallet, switch networks from
            the header, and try SOL transfers, message signing, and SPL token
            actions powered by @solana-program/token.
          </p>
          <ActionsPanel />
        </main>
      </div>
      <Toaster position="bottom-right" richColors theme={theme} />
    </div>
  );
}
