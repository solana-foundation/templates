import { Keypair, Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token'
import { log } from './logger'
import { getCurrentNetwork } from './network'
import { getNetworkConfig } from '../config'

let wallet: Keypair | null = null
let connection: Connection | null = null

export function getWallet(): Keypair | null {
  return wallet
}

export function getConnection(): Connection | null {
  return connection
}

export function setConnection(rpcUrl: string): Connection {
  connection = new Connection(rpcUrl, 'confirmed')
  return connection
}

export function loadWallet(): Keypair | null {
  try {
    const keypairEnv = import.meta.env.VITE_SIGNER_KEYPAIR
    if (!keypairEnv) {
      alert('VITE_SIGNER_KEYPAIR not found in .env file')
      log('error', 'VITE_SIGNER_KEYPAIR not found in .env file')
      return null
    }

    const keypairArray: number[] = JSON.parse(keypairEnv)
    wallet = Keypair.fromSecretKey(new Uint8Array(keypairArray))

    const addressEl = document.getElementById('wallet-address')
    if (addressEl) {
      addressEl.textContent = wallet.publicKey.toBase58()
    }

    log('success', `Wallet loaded: ${wallet.publicKey.toBase58()}`)
    return wallet
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert('Failed to load wallet: ' + errorMessage)
    log('error', `Failed to load wallet: ${errorMessage}`)
    return null
  }
}

export async function fetchBalance(): Promise<void> {
  if (!wallet || !connection) {
    log('error', 'Wallet or connection not initialized')
    return
  }

  try {
    log('info', 'Fetching balances...')

    // Fetch SOL balance
    const balance = await connection.getBalance(wallet.publicKey)
    const solBalance = (balance / 1_000_000_000).toFixed(4)

    const solBalanceEl = document.getElementById('sol-balance')
    if (solBalanceEl) {
      solBalanceEl.textContent = `${solBalance} SOL`
    }

    log('success', `SOL Balance: ${solBalance} SOL`)

    // Fetch USDC balance
    await fetchUSDCBalance()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    log('error', `Failed to fetch balance: ${errorMessage}`)
    const solBalanceEl = document.getElementById('sol-balance')
    if (solBalanceEl) {
      solBalanceEl.textContent = 'Error'
    }
  }
}

async function fetchUSDCBalance(): Promise<void> {
  if (!wallet || !connection) return

  try {
    const network = getCurrentNetwork()
    const config = getNetworkConfig()
    const usdcMint = new PublicKey(config[network].usdcMint)

    // Get associated token account
    const tokenAccount = await getAssociatedTokenAddress(usdcMint, wallet.publicKey)

    // Get account info
    const accountInfo = await getAccount(connection, tokenAccount)
    const usdcBalance = (Number(accountInfo.amount) / 1_000_000).toFixed(2)

    const usdcBalanceEl = document.getElementById('usdc-balance')
    if (usdcBalanceEl) {
      usdcBalanceEl.textContent = `${usdcBalance} USDC`
    }

    log('success', `USDC Balance: ${usdcBalance} USDC`)
  } catch (error) {
    // Account might not exist yet
    const usdcBalanceEl = document.getElementById('usdc-balance')
    if (usdcBalanceEl) {
      usdcBalanceEl.textContent = '0.00 USDC'
    }
    log('info', 'No USDC token account found (balance: 0)')
  }
}

/**
 * Setup wallet UI event listeners
 */
export function setupWallet(): void {
  const loadWalletBtn = document.getElementById('load-wallet-btn')
  const refreshBalanceBtn = document.getElementById('refresh-balance-btn')

  if (loadWalletBtn) {
    loadWalletBtn.addEventListener('click', () => {
      const loadedWallet = loadWallet()
      if (loadedWallet) {
        fetchBalance()
      }
    })
  }

  if (refreshBalanceBtn) {
    refreshBalanceBtn.addEventListener('click', () => {
      fetchBalance()
    })
  }
}
