"use client";

import { useState } from "react";
import { useSignMessage } from "@privy-io/react-auth/solana";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PenLine, Copy, Loader2 } from "lucide-react";

export function SignMessage() {
  const { embedded } = useSolanaWallet();
  const { signMessage } = useSignMessage();
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!embedded) return;

    setLoading(true);
    setSignature(null);

    try {
      const message = new TextEncoder().encode(
        "Hello from privy-auth! This is a demo message signed with your embedded Solana wallet.",
      );

      const result = await signMessage({
        message,
        options: { address: embedded.address },
      });

      const sig = Buffer.from(result).toString("base64");
      setSignature(sig);
      toast.success("Message signed!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to sign message",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/10 bg-primary/5">
            <PenLine className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Sign Message</CardTitle>
            <CardDescription className="text-xs">
              {embedded
                ? "Sign a demo message with your embedded wallet."
                : "Waiting for embedded wallet..."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleSign} disabled={loading || !embedded} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing...
            </>
          ) : (
            "Sign Message"
          )}
        </Button>

        {signature && (
          <div className="animate-fade-up">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Signature
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(signature);
                toast.success("Copied!");
              }}
              className="group flex w-full items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-3 text-left transition-colors hover:border-primary/20 hover:bg-muted/50"
            >
              <code className="flex-1 font-mono text-xs leading-relaxed break-all">
                {signature}
              </code>
              <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
