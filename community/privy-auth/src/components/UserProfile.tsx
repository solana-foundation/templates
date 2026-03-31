"use client";

import { usePrivy } from "@privy-io/react-auth";
import type { LinkedAccountWithMetadata } from "@privy-io/react-auth";

const PROVIDER_LABELS: Record<string, string> = {
  email: "Email",
  google_oauth: "Google",
  twitter_oauth: "X (Twitter)",
  discord_oauth: "Discord",
  github_oauth: "GitHub",
};

const PROVIDER_ICONS: Record<string, string> = {
  email: "✉",
  google_oauth: "G",
  twitter_oauth: "𝕏",
  discord_oauth: "D",
  github_oauth: "⌥",
};

function getIdentifier(account: LinkedAccountWithMetadata): string {
  switch (account.type) {
    case "email":
      return account.address ?? "Unknown";
    case "google_oauth":
      return account.email ?? "Google Account";
    case "twitter_oauth":
      return account.username ? `@${account.username}` : "X Account";
    case "discord_oauth":
      return account.username ?? "Discord Account";
    case "github_oauth":
      return account.username ?? "GitHub Account";
    default:
      return account.type;
  }
}

export default function UserProfile() {
  const { user } = usePrivy();

  if (!user) return null;

  const accounts = user.linkedAccounts.filter(
    (a): a is LinkedAccountWithMetadata =>
      a.type !== "wallet" && a.type !== "smart_wallet"
  );

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-400">
        Linked Accounts
      </h3>
      {accounts.length === 0 ? (
        <p className="text-sm text-gray-500">No linked accounts.</p>
      ) : (
        <ul className="space-y-2">
          {accounts.map((account) => (
            <li
              key={`${account.type}-${getIdentifier(account)}`}
              className="flex items-center gap-3 rounded-md border border-gray-700/50 bg-gray-800/50 px-3 py-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 text-xs">
                {PROVIDER_ICONS[account.type] ?? "?"}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-400">
                  {PROVIDER_LABELS[account.type] ?? account.type}
                </span>
                <span className="text-sm text-white">
                  {getIdentifier(account)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-500">
          User ID:{" "}
          <code className="text-gray-400">{user.id}</code>
        </p>
        {user.createdAt && (
          <p className="mt-1 text-xs text-gray-500">
            Joined:{" "}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
