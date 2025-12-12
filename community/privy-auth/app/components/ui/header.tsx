"use client";

import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import { PrivyLogo } from "../privy-logo";

export function Header() {
  const { authenticated } = usePrivy();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-row w-full items-center text-xs font-bold text-black">
            <PrivyLogo />
            <span className="mx-2">x</span>
            <Image src={'/solana-logo.svg'} alt="solana" width={25} height={25} className="text-black" />{' '}
            <span className="ml-2 font-mono uppercase">Template</span>
          </Link>
          <nav className="flex items-center gap-6">
            {authenticated && (
              <Link href="/protected" className="text-gray-600 hover:text-gray-900 transition-colors">
                Protected
              </Link>
            )}
            <a
              href="https://docs.privy.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Docs
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}