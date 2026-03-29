"use client";

import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
      className="w-full gap-2 text-sm font-semibold shadow-md transition-all hover:shadow-lg"
    >
      Get Started
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
