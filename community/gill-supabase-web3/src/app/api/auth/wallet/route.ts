import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, supabaseUserId } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    // First, check if user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    })

    let user = existingUser

    if (!existingUser) {
      // Create new user record in database
      user = await prisma.user.create({
        data: {
          walletAddress: walletAddress,
          supabaseUserId: supabaseUserId,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
      })
    } else {
      // Update last login and supabase user ID for existing user
      user = await prisma.user.update({
        where: {
          walletAddress: walletAddress,
        },
        data: {
          lastLogin: new Date(),
          supabaseUserId: supabaseUserId || existingUser.supabaseUserId,
        },
      })
    }

    return NextResponse.json({
      message: 'Wallet authenticated successfully!',
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        supabaseUserId: user.supabaseUserId,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error('Wallet auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
