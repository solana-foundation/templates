"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {active && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      )}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${active ? "bg-green-500" : "bg-muted-foreground/30"}`}
      />
    </span>
  );
}

export function WalletInfo() {
  const { ready, authenticated } = usePrivy();
  const { embedded, all } = useSolanaWallet();

  if (!ready) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Initializing...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/10 bg-primary/5">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">Wallet Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <StatusDot active={authenticated} />
          <span className="text-sm">
            {authenticated ? "Authenticated" : "Not authenticated"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <StatusDot active={!!embedded} />
          <span className="text-sm">
            {embedded ? "Embedded wallet active" : "No embedded wallet"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <StatusDot active={all.length > 0} />
          <span className="text-sm">
            {all.length} wallet{all.length !== 1 ? "s" : ""} connected
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
