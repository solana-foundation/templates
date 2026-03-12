'use client'

import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import type { WalletName } from '@solana/wallet-adapter-base'
import Image from 'next/image'

export function WalletConnectButton() {
  const { wallets, select, connecting, connected, publicKey, disconnect } = useWallet()
  const [modalOpen, setModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const installed = useMemo(() => wallets.filter((w) => w.readyState === 'Installed'), [wallets])

  const visible = showAll ? installed : installed.slice(0, 3)

  const handleSelect = useCallback(
    (name: WalletName) => {
      select(name)
      setModalOpen(false)
    },
    [select],
  )

  const handleCopy = useCallback(async () => {
    if (!publicKey) return
    await navigator.clipboard.writeText(publicKey.toBase58())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [publicKey])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const addr = publicKey?.toBase58() ?? ''
  const shortAddr = addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : ''

  // ─── Connected State ───
  if (connected && publicKey) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <div className="h-2 w-2 rounded-full bg-success" />
          <span className="font-mono text-xs">{shortAddr}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-3 w-3 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="animate-fade-in absolute right-0 top-full mt-1.5 w-48 rounded-lg border border-border bg-card p-1 shadow-lg z-50">
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5 text-success"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5 text-muted-foreground"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              <span>{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>
            <div className="my-1 h-px bg-border" />
            <button
              onClick={() => {
                disconnect()
                setDropdownOpen(false)
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── Disconnected State ───
  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        disabled={connecting}
        className="h-8 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {/* Modal */}
      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="animate-fade-in w-full max-w-sm mx-4 rounded-xl border border-border bg-card p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">Connect Wallet</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Wallet list */}
              {installed.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-3">No wallets detected</p>
                  <a
                    href="https://phantom.app"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
                  >
                    Install Phantom
                  </a>
                </div>
              ) : (
                <div className="space-y-1">
                  {visible.map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => handleSelect(wallet.adapter.name as WalletName)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      <Image
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        width={32}
                        height={32}
                        className="rounded-lg"
                      />
                      <span className="flex-1 text-left">{wallet.adapter.name}</span>
                      <span className="text-[11px] text-muted-foreground">Detected</span>
                    </button>
                  ))}

                  {installed.length > 3 && !showAll && (
                    <button
                      onClick={() => setShowAll(true)}
                      className="flex w-full items-center justify-center gap-1 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      More wallets
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-3 w-3"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
