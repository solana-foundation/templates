import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { DashboardContent } from "@/components/staking/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              Loading...
            </div>
          }
        >
          <DashboardContent />
        </Suspense>
      </main>

      <footer className="border-t border-border/60 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>
              Solana Staking Protocol &copy; 2026. Built with Next.js, Tailwind,
              and Anchor.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
