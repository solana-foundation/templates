'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { PrivyLogo } from './privy-logo'
import Image from 'next/image'

export function LoginScreen() {
  const { login } = usePrivy()

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Heading */}
        <div className="flex flex-col justify-center">
          <div className='flex flex-row items-center'>
            <PrivyLogo className="w-[188] h-[37]" />
            <span className="mr-3">x</span>
            <Image src={'/solana-logo.svg'} alt="solana" width={40} height={40} className="text-black" />{' '}
          </div>
          <span className="text-xs mt-1 font-mono uppercase">Template</span>
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Authenticate with social logins or a Solana wallet. Create embedded wallets for users who don't have one.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center  gap-4 pt-4">
          <Button
            size="lg"
            className="bg-indigo-400 cursor-pointer hover:opacity-90 transition-opacity text-white font-semibold px-8 h-12 text-base shadow-lg shadow-primary/25"
            onClick={login}
          >
            Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Supported Platforms */}
        <p className="text-sm text-muted-foreground pt-8">Supports Google, Twitter, Discord, and more</p>
      </div>
    </div>
  )
}
