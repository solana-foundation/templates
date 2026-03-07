'use client';

/**
 * WalletConnectButton — dropdown to connect / disconnect a Solana wallet.
 *
 * Lists common Wallet Standard connectors. Styled to match the zinc-based
 * design used across the rest of the staking template.
 */

import { useConnectWallet, useDisconnectWallet, useWallet } from '@solana/react-hooks';
import { useState } from 'react';

const CONNECTORS: ReadonlyArray<{ id: string; label: string }> = [
	{ id: 'wallet-standard:phantom', label: 'Phantom' },
	{ id: 'wallet-standard:solflare', label: 'Solflare' },
	{ id: 'wallet-standard:backpack', label: 'Backpack' },
	{ id: 'wallet-standard:metamask', label: 'MetaMask' },
];

function truncate(address: string): string {
	return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletConnectButton() {
	const wallet = useWallet();
	const connectWallet = useConnectWallet();
	const disconnectWallet = useDisconnectWallet();
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	const isConnected = wallet.status === 'connected';
	const address = isConnected ? wallet.session.account.address.toString() : null;

	async function handleConnect(connectorId: string) {
		setError(null);
		try {
			await connectWallet(connectorId);
			setOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unable to connect');
		}
	}

	async function handleDisconnect() {
		setError(null);
		try {
			await disconnectWallet();
			setOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unable to disconnect');
		}
	}

	return (
		<div className="relative">
			{/* ── Toggle button ───────────────────────────── */}
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-2 rounded border border-zinc-300 px-3 py-1.5
					text-sm font-medium transition-colors hover:bg-zinc-100
					dark:border-zinc-700 dark:hover:bg-zinc-800"
			>
				{address ? (
					<>
						<span className="inline-block h-2 w-2 rounded-full bg-green-500" />
						<span className="font-mono">{truncate(address)}</span>
					</>
				) : (
					<span>Connect Wallet</span>
				)}
				<span className="text-[10px] text-zinc-400">{open ? '▲' : '▼'}</span>
			</button>

			{/* ── Dropdown ────────────────────────────────── */}
			{open ? (
				<div
					className="absolute right-0 z-10 mt-2 w-56 rounded border border-zinc-200
						bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
				>
					{isConnected ? (
						<div className="space-y-3">
							<div className="rounded border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/50">
								<p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
									Connected
								</p>
								<p className="mt-0.5 truncate font-mono text-sm">{address}</p>
							</div>
							<button
								type="button"
								onClick={() => void handleDisconnect()}
								className="w-full rounded border border-zinc-300 py-1.5 text-sm font-medium
									transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
							>
								Disconnect
							</button>
						</div>
					) : (
						<div className="space-y-2">
							<p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
								Select Wallet
							</p>
							<div className="space-y-1.5">
								{CONNECTORS.map((c) => (
									<button
										key={c.id}
										type="button"
										onClick={() => void handleConnect(c.id)}
										className="flex w-full items-center justify-between rounded border
											border-zinc-200 px-3 py-1.5 text-sm transition-colors
											hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
									>
										<span>{c.label}</span>
										<span className="text-xs text-zinc-400">→</span>
									</button>
								))}
							</div>
						</div>
					)}
					{error ? (
						<p className="mt-2 text-xs font-medium text-red-600">{error}</p>
					) : null}
				</div>
			) : null}
		</div>
	);
}