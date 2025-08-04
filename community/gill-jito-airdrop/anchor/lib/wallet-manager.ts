import * as fs from "fs";
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";
import type { WalletInfo, TestWalletsData } from "./types";

/**
 * Manages wallet operations: generation, loading, saving, and funding
 */
export class WalletManager {
  private connection: Connection;

  constructor(rpcUrl: string = "https://api.devnet.solana.com") {
    this.connection = new Connection(rpcUrl, "confirmed");
  }

  /**
   * Generate a new wallet
   */
  generateWallet(name: string): WalletInfo {
    const keypair = Keypair.generate();
    const secretKey = keypair.secretKey;
    const privateKey = secretKey.slice(0, 32);

    return {
      name,
      publicKey: keypair.publicKey.toString(),
      keypairFile: `${name}.json`,
      privateKey: {
        hex: Buffer.from(privateKey).toString("hex"),
        base58: bs58.encode(privateKey),
        array: Array.from(privateKey),
      },
      secretKey: {
        hex: Buffer.from(secretKey).toString("hex"),
        base58: bs58.encode(secretKey),
        array: Array.from(secretKey),
      },
      balance: "0 SOL",
      funded: false,
    };
  }

  /**
   * Create wallet from existing private key
   */
  createWalletFromKey(name: string, privateKeyInput: string): WalletInfo {
    let secretKeyArray: number[];
    
    if (privateKeyInput.length === 128) {
      // Hex format (64 bytes)
      const secretKeyBuffer = Buffer.from(privateKeyInput, "hex");
      secretKeyArray = Array.from(secretKeyBuffer);
    } else if (privateKeyInput.length === 88) {
      // Base58 format (64 bytes)
      const secretKeyBuffer = bs58.decode(privateKeyInput);
      secretKeyArray = Array.from(secretKeyBuffer);
    } else {
      throw new Error("Invalid private key format. Expected 128 char hex or 88 char base58");
    }

    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
    const privateKey = secretKeyArray.slice(0, 32);

    return {
      name,
      publicKey: keypair.publicKey.toString(),
      keypairFile: `${name}.json`,
      privateKey: {
        hex: Buffer.from(privateKey).toString("hex"),
        base58: bs58.encode(new Uint8Array(privateKey)),
        array: privateKey,
      },
      secretKey: {
        hex: privateKeyInput.length === 128 ? privateKeyInput : Buffer.from(secretKeyArray).toString("hex"),
        base58: privateKeyInput.length === 88 ? privateKeyInput : bs58.encode(new Uint8Array(secretKeyArray)),
        array: secretKeyArray,
      },
    };
  }

  /**
   * Check wallet balance
   */
  async checkBalance(publicKey: string): Promise<number> {
    try {
      const balance = await this.connection.getBalance(new PublicKey(publicKey));
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error(`❌ Error checking balance for ${publicKey}:`, error);
      return 0;
    }
  }

  /**
   * Request devnet airdrop
   */
  async requestAirdrop(publicKey: string, amount: number = 2): Promise<boolean> {
    try {
      console.log(`💧 Requesting ${amount} SOL airdrop for ${publicKey}...`);
      const signature = await this.connection.requestAirdrop(
        new PublicKey(publicKey),
        amount * LAMPORTS_PER_SOL
      );
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature);
      console.log(`✅ Airdrop successful! Signature: ${signature}`);
      
      // Wait a bit for balance to update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error(`❌ Airdrop failed for ${publicKey}:`, error);
      return false;
    }
  }

  /**
   * Update wallet balance and funding status
   */
  async updateWalletStatus(wallet: WalletInfo): Promise<WalletInfo> {
    const balance = await this.checkBalance(wallet.publicKey);
    return {
      ...wallet,
      balance: `${balance} SOL`,
      funded: balance > 0
    };
  }

  /**
   * Fund wallet if needed
   */
  async ensureWalletFunded(wallet: WalletInfo, minBalance: number = 1, airdropAmount: number = 2): Promise<WalletInfo> {
    const updatedWallet = await this.updateWalletStatus(wallet);
    const balance = parseFloat(updatedWallet.balance?.split(' ')[0] || '0');
    
    if (balance < minBalance) {
      console.log(`💧 Wallet needs funding (current: ${balance} SOL, required: ${minBalance} SOL)...`);
      const airdropSuccess = await this.requestAirdrop(wallet.publicKey, airdropAmount);
      
      if (airdropSuccess) {
        return await this.updateWalletStatus(updatedWallet);
      } else {
        console.log("⚠️  Automatic airdrop failed. Please fund manually:");
        console.log(`solana airdrop ${airdropAmount} ${wallet.publicKey} --url devnet`);
        return updatedWallet;
      }
    }
    
    return updatedWallet;
  }

  /**
   * Save individual wallet file (for deploy wallet)
   */
  saveWalletFile(wallet: WalletInfo, basePath: string = ""): void {
    if (wallet.isDeployWallet) {
      const walletPath = basePath ? `${basePath}/${wallet.keypairFile}` : wallet.keypairFile;
      fs.writeFileSync(walletPath, JSON.stringify(wallet.secretKey.array));
      console.log(`💾 Saved wallet file: ${walletPath}`);
    }
  }

  /**
   * Load existing wallets from test-wallets.json
   */
  loadExistingWallets(filePath: string = "test-wallets.json"): { 
    deployWallet: WalletInfo | null; 
    testWallets: WalletInfo[] 
  } {
    try {
      if (!fs.existsSync(filePath)) {
        return { deployWallet: null, testWallets: [] };
      }

      const testWalletsData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const wallets = testWalletsData.wallets || [];
      
      const deployWallet = wallets.find((w: WalletInfo) => w.isDeployWallet || w.name === "deploy-wallet");
      const testWallets = wallets.filter((w: WalletInfo) => !w.isDeployWallet && w.name !== "deploy-wallet");

      return { deployWallet, testWallets };
    } catch (error) {
      console.error("⚠️  Error loading existing wallets:", error);
      return { deployWallet: null, testWallets: [] };
    }
  }

  /**
   * Save all wallets to test-wallets.json
   */
  saveTestWalletsJson(allWallets: WalletInfo[], filePath: string = "test-wallets.json"): void {
    const testWalletsData: TestWalletsData = {
      network: "devnet",
      description: "Test wallets for Solana distributor development",
      createdAt: new Date().toISOString(),
      wallets: allWallets,
      usage: {
        description: "These test wallets can be used for development and testing",
        loadWallet: "solana config set --keypair <keypairFile>",
        checkBalance: "solana balance <publicKey>",
        fundWallet: "solana airdrop <amount> <publicKey>",
        transferFunds: "solana transfer <recipient> <amount> --keypair <keypairFile>",
        privateKeyFormats: {
          hex: "32-byte hexadecimal string (lowercase)",
          base58: "Base58 encoded string (most common format for Solana)",
          array: "Array of 32 integers (0-255)",
        },
        security: {
          warning: "⚠️ NEVER share private keys publicly or commit them to public repositories!",
          note: "These are test wallets for devnet only. Do not use for mainnet or real funds.",
        },
      },
    };

    fs.writeFileSync(filePath, JSON.stringify(testWalletsData, null, 2));
    console.log(`💾 Saved ${filePath}`);
  }

  /**
   * Generate multiple test wallets with funding
   */
  async generateTestWallets(count: number): Promise<WalletInfo[]> {
    const testWallets: WalletInfo[] = [];

    for (let i = 1; i <= count; i++) {
      console.log(`\n📱 Creating test wallet ${i}...`);
      
      const wallet = this.generateWallet(`test-wallet-${i}`);
      console.log(`✅ Created: ${wallet.publicKey}`);
      
      // Try to fund the wallet
      const fundedWallet = await this.ensureWalletFunded(wallet, 0.5, 1);
      testWallets.push(fundedWallet);
      
      // Add delay between airdrops to avoid rate limiting
      if (i < count) {
        console.log("⏳ Waiting 3 seconds before next wallet...");
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    return testWallets;
  }

  /**
   * Extract specific wallet from test-wallets.json to individual file
   */
  extractWallet(walletName: string, outputPath?: string, sourceFile: string = "test-wallets.json"): boolean {
    try {
      if (!fs.existsSync(sourceFile)) {
        console.error(`❌ ${sourceFile} not found`);
        return false;
      }

      const testWalletsData = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
      const wallets: WalletInfo[] = testWalletsData.wallets || [];
      
      const wallet = wallets.find((w: WalletInfo) => w.name === walletName);
      
      if (!wallet) {
        console.error(`❌ Wallet "${walletName}" not found in ${sourceFile}`);
        console.log("Available wallets:");
        wallets.forEach(w => console.log(`  - ${w.name}: ${w.publicKey}`));
        return false;
      }

      const outputFile = outputPath || wallet.keypairFile;
      fs.writeFileSync(outputFile, JSON.stringify(wallet.secretKey.array));
      
      console.log(`✅ Extracted ${walletName} to ${outputFile}`);
      console.log(`   Public Key: ${wallet.publicKey}`);
      
      return true;
    } catch (error) {
      console.error("❌ Error extracting wallet:", error);
      return false;
    }
  }
}