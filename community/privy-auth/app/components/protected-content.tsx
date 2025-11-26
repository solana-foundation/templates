"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SessionClaims } from "@/types";
import { decodeToken, formatTimestamp } from "@/lib/utils";

export function ProtectedContent() {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const router = useRouter();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionClaims, setSessionClaims] = useState<SessionClaims | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [copied, setCopied] = useState(false);

  const hydrateSession = useCallback(async () => {
    if (!authenticated) return;
    setLoadingSession(true);
    try {
      const token = await getAccessToken();
      setSessionToken(token);
      setSessionClaims(token ? decodeToken(token) : null);
    } finally {
      setLoadingSession(false);
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (authenticated) {
      hydrateSession();
    }
  }, [authenticated, hydrateSession]);

  const copyToken = useCallback(async () => {
    if (!sessionToken || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(sessionToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.warn("Unable to copy token", error);
    }
  }, [sessionToken]);

  const metaRows = useMemo(
    () =>
      [
        user?.id && { label: "User ID", value: user.id },
        sessionClaims?.sid && { label: "Session ID", value: sessionClaims.sid },
        sessionClaims?.sub && { label: "Subject", value: sessionClaims.sub },
        {
          label: "Audience",
          value: Array.isArray(sessionClaims?.aud)
            ? sessionClaims?.aud.join(", ")
            : sessionClaims?.aud,
        },
        {
          label: "Issued At",
          value: formatTimestamp(sessionClaims?.iat),
        },
        {
          label: "Expires At",
          value: formatTimestamp(sessionClaims?.exp),
        },
      ].filter(Boolean) as { label: string; value: string }[],
    [sessionClaims, user?.id]
  );

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ← Back
              </button>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">Session Observability</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                This surface renders the authenticated Privy user object and a decoded session payload to demonstrate
                how routes can inspect identity context.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-500">Account Snapshot</p>
                  <h2 className="text-xl font-semibold text-slate-900">Privy User Object</h2>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Authenticated
                </span>
              </div>
              <dl className="mt-6 space-y-3">
                {metaRows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <dt className="text-sm text-slate-500">{row.label}</dt>
                    <dd className="text-right text-sm font-semibold text-slate-900">{row.value ?? '—'}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6">
                <p className="text-xs uppercase text-slate-500">User JSON</p>
                <pre className="mt-2 max-h-80 overflow-auto rounded-2xl bg-slate-900/90 p-4 text-xs text-slate-100">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase text-slate-500">Session Payload</p>
                  <h2 className="text-xl font-semibold text-slate-900">Decoded Access Token</h2>
                  <p className="text-sm text-slate-500">Rehydrate the session to view updated claims.</p>
                </div>
                <button
                  onClick={hydrateSession}
                  disabled={loadingSession}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingSession ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">JWT ID</span>
                  <span className="font-mono text-slate-900">{sessionClaims?.jti ?? '—'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Expires</span>
                  <span className="font-semibold text-slate-900">{formatTimestamp(sessionClaims?.exp)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-4">
                <div className="flex items-center justify-between text-xs">
                  <p className="uppercase text-slate-500">Access Token</p>
                  {sessionToken && (
                    <button onClick={copyToken} className="font-semibold text-indigo-600 hover:text-indigo-500">
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
                <p className="mt-2 line-clamp-3 break-all font-mono text-[11px] text-slate-600">
                  {sessionToken ?? 'No token issued'}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase text-slate-500">Session Object</p>
                <pre className="mt-2 max-h-80 overflow-auto rounded-2xl bg-slate-900/90 p-4 text-xs text-slate-100">
                  {sessionClaims ? JSON.stringify(sessionClaims, null, 2) : 'No session claims available.'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

