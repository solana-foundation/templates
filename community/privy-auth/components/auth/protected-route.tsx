"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      // Redirect to home page if not authenticated
      router.push("/");
    }
  }, [ready, authenticated, router]);

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            <div className="absolute inset-2 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
          </div>
          <p className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent dark:from-purple-400 dark:to-pink-400">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔒</div>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
