import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SESSION_COOKIE, readSessionToken } from "../lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function ProtectedPage() {
  const store = await cookies();
  const address = readSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!address) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/50">
        This page is server-gated. It rendered because a valid, HMAC-signed
        session cookie proved ownership of the address below — a forged or
        missing cookie is redirected home.
      </p>

      <div className="mt-8 rounded-2xl border border-border-low bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <h2 className="text-sm font-semibold">Authenticated</h2>
        </div>
        <p className="mt-3 break-all rounded-lg border border-border-low bg-cream/50 px-3 py-2 font-mono text-xs">
          {address}
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href="/"
            className="flex-1 rounded-lg border border-border-low bg-card px-4 py-2.5 text-center text-sm font-medium transition hover:bg-cream"
          >
            Home
          </Link>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
