import { WalletMultiButton } from "@solana/wallet-adapter";
import type { Theme } from "../lib/hooks/use-theme";
import { ClusterSelect } from "./cluster-select";
import { ThemeToggle } from "./theme-toggle";

type AppHeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function AppHeader({ theme, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
      <span className="text-sm font-semibold tracking-tight">
        Web3.js v3 Starter
      </span>
      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <ClusterSelect />
        <WalletMultiButton />
      </div>
    </header>
  );
}
