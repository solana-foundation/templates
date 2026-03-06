"use client";

import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function LoginButton() {
  const router = useRouter();

  const { login } = useLogin({
    onComplete: ({ user }) => {
      if (user) {
        router.replace("/dashboard");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return (
    <Button
      onClick={login}
      size="lg"
      className="w-full gap-2 text-sm font-semibold shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30"
    >
      <LogIn className="h-4 w-4" />
      Sign In with Privy
    </Button>
  );
}
