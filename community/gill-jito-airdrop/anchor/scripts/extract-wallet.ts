#!/usr/bin/env ts-node

import { WalletManager } from "../lib/wallet-manager";

/**
 * Extract a specific wallet file from test-wallets.json
 * @param walletName Name of the wallet to extract (e.g., "test-wallet-1", "deploy-wallet")
 * @param outputPath Optional output path, defaults to the wallet's keypairFile
 */
export function extractWallet(walletName: string, outputPath?: string): boolean {
  const walletManager = new WalletManager();
  return walletManager.extractWallet(walletName, outputPath, "test-wallets.json");
}

/**
 * Extract all wallets from test-wallets.json to individual files
 */
export function extractAllWallets(): boolean {
  try {
    const walletManager = new WalletManager();
    const { deployWallet, testWallets } = walletManager.loadExistingWallets("test-wallets.json");
    
    const allWallets = deployWallet ? [deployWallet, ...testWallets] : testWallets;
    
    if (allWallets.length === 0) {
      console.error("❌ No wallets found in test-wallets.json");
      return false;
    }
    
    console.log(`🔧 Extracting ${allWallets.length} wallets...`);
    
    let success = true;
    for (const wallet of allWallets) {
      if (walletManager.extractWallet(wallet.name, undefined, "test-wallets.json")) {
        console.log(`✅ ${wallet.name} → ${wallet.keypairFile}`);
      } else {
        console.error(`❌ Failed to extract ${wallet.name}`);
        success = false;
      }
    }
    
    return success;
  } catch (error) {
    console.error("❌ Error extracting wallets:", error);
    return false;
  }
}

/**
 * List all available wallets in test-wallets.json
 */
export function listWallets(): void {
  try {
    const walletManager = new WalletManager();
    const { deployWallet, testWallets } = walletManager.loadExistingWallets("test-wallets.json");
    
    const allWallets = deployWallet ? [deployWallet, ...testWallets] : testWallets;
    
    if (allWallets.length === 0) {
      console.error("❌ No wallets found in test-wallets.json");
      return;
    }
    
    console.log(`📋 Available wallets (${allWallets.length}):`);
    allWallets.forEach((wallet, i) => {
      const status = wallet.isDeployWallet || wallet.name === "deploy-wallet" ? "🔑 Deploy" : "🧪 Test";
      console.log(`  ${i + 1}. ${status} - ${wallet.name}`);
      console.log(`     Public Key: ${wallet.publicKey}`);
      console.log(`     Keypair File: ${wallet.keypairFile}`);
      console.log(`     Balance: ${wallet.balance || 'Unknown'}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error listing wallets:", error);
  }
}

// Script execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("🔧 Wallet Extraction Utility\n");
    console.log("Usage:");
    console.log("  extract-wallet <wallet-name>           # Extract specific wallet");
    console.log("  extract-wallet --all                   # Extract all wallets"); 
    console.log("  extract-wallet --list                  # List available wallets");
    console.log("");
    console.log("Examples:");
    console.log("  extract-wallet test-wallet-1");
    console.log("  extract-wallet deploy-wallet");
    console.log("  extract-wallet --all");
    process.exit(0);
  }
  
  const command = args[0];
  
  try {
    if (command === "--list") {
      listWallets();
    } else if (command === "--all") {
      const success = extractAllWallets();
      process.exit(success ? 0 : 1);
    } else {
      const walletName = command;
      const outputPath = args[1]; // Optional
      const success = extractWallet(walletName, outputPath);
      process.exit(success ? 0 : 1);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
} 