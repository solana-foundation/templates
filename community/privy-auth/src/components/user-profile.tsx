"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy, LogOut, User } from "lucide-react";

function truncate(str: string) {
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
}

export function UserProfile() {
  const { user, logout } = usePrivy();
  const { embedded, external } = useSolanaWallet();

  if (!user) return null;

  const linkedMethods = user.linkedAccounts
    .map((a) => a.type)
    .filter((t) => t !== "wallet" && t !== "smart_wallet");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/10 bg-primary/5">
            <User className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">Profile</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            User ID
          </p>
          <p className="font-mono text-sm">{truncate(user.id)}</p>
        </div>

        {embedded && (
          <>
            <Separator />
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Embedded Wallet
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(embedded.address);
                  toast.success("Copied to clipboard");
                }}
                className="group inline-flex items-center gap-2 font-mono text-sm transition-colors hover:text-primary"
              >
                {truncate(embedded.address)}
                <Copy className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-primary" />
              </button>
            </div>
          </>
        )}

        {external.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                External Wallets
              </p>
              <div className="space-y-1.5">
                {external.map((w) => (
                  <div key={w.address} className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {truncate(w.address)}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-normal"
                    >
                      {w.walletClientType}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {linkedMethods.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Linked Accounts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {linkedMethods.map((method) => (
                  <Badge
                    key={method}
                    variant="secondary"
                    className="capitalize"
                  >
                    {method.replace("_oauth", "")}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
