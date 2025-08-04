#!/usr/bin/env ts-node

import * as readline from "readline";
import { ProgramManager } from "../lib/program-manager";
import { WalletManager } from "../lib/wallet-manager";
import type { WalletInfo } from "../lib/types";

/**
 * Simplified deployment setup that uses the new modular architecture
 */
class SolanaDeploymentSetup {
  private rl: readline.Interface;
  private programManager: ProgramManager;
  private walletManager: WalletManager;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.programManager = new ProgramManager(".");
    this.walletManager = new WalletManager();
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  /**
   * Interactive setup for deploy wallet
   */
  private async setupDeployWallet(): Promise<WalletInfo> {
    console.log("\n🚀 Setting up deployment wallet...\n");
    
    // Check for existing wallets first
    const { deployWallet: existingDeployWallet } = this.walletManager.loadExistingWallets("test-wallets.json");
    
    if (existingDeployWallet) {
      const useExisting = await this.question(
        `Found existing deploy wallet: ${existingDeployWallet.publicKey}\n` +
        "Do you want to use this existing wallet? (y/n): "
      );
      
      if (useExisting.toLowerCase() === 'y' || useExisting.toLowerCase() === 'yes') {
        console.log(`✅ Using existing deployment wallet`);
        const updatedWallet = await this.walletManager.ensureWalletFunded(existingDeployWallet, 1, 2);
        this.walletManager.saveWalletFile(updatedWallet);
        return updatedWallet;
      }
    }
    
    const choice = await this.question(
      "Do you want to:\n" +
      "1. Use an existing wallet (provide private key)\n" +
      "2. Create a new wallet\n" +
      "Enter choice (1 or 2): "
    );

    let deployWallet: WalletInfo;

    if (choice === "1") {
      const privateKeyInput = await this.question("Enter your private key (base58 or hex): ");
      
      try {
        deployWallet = this.walletManager.createWalletFromKey("deploy-wallet", privateKeyInput);
        deployWallet.isDeployWallet = true;
        console.log(`✅ Using existing wallet: ${deployWallet.publicKey}`);
      } catch {
        console.error("❌ Invalid private key format. Please try again.");
        process.exit(1);
      }
    } else {
      deployWallet = this.walletManager.generateWallet("deploy-wallet");
      deployWallet.isDeployWallet = true;
      console.log(`✅ Generated new deployment wallet: ${deployWallet.publicKey}`);
    }

    // Fund and save the wallet
    const fundedWallet = await this.walletManager.ensureWalletFunded(deployWallet, 1, 2);
    this.walletManager.saveWalletFile(fundedWallet);
    
    return fundedWallet;
  }

  /**
   * Interactive setup for test wallets
   */
  private async setupTestWallets(): Promise<WalletInfo[]> {
    console.log("\n🧪 Setting up test wallets...\n");
    
    // Check for existing test wallets first
    const { testWallets: existingTestWallets } = this.walletManager.loadExistingWallets("test-wallets.json");
    
    if (existingTestWallets.length > 0) {
      console.log(`Found ${existingTestWallets.length} existing test wallets:`);
      existingTestWallets.forEach((wallet, i) => {
        console.log(`  ${i + 1}. ${wallet.name}: ${wallet.publicKey} (${wallet.funded ? 'Funded' : 'Unfunded'})`);
      });
      
      const useExisting = await this.question(
        "\nDo you want to use these existing test wallets? (y/n): "
      );
      
      if (useExisting.toLowerCase() === 'y' || useExisting.toLowerCase() === 'yes') {
        console.log("✅ Using existing test wallets");
        
        // Update their statuses
        const updatedWallets: WalletInfo[] = [];
        for (const wallet of existingTestWallets) {
          const updated = await this.walletManager.updateWalletStatus(wallet);
          console.log(`💰 ${updated.name}: ${updated.balance}`);
          updatedWallets.push(updated);
        }
        
        return updatedWallets;
      }
    }
    
    const numWallets = await this.question("How many test wallets do you want to create? (default: 3): ");
    const walletCount = parseInt(numWallets) || 3;

    return await this.walletManager.generateTestWallets(walletCount);
  }

  /**
   * Main deployment workflow
   */
  public async run(): Promise<void> {
    try {
      console.log("🎉 Welcome to Solana Distributor Deployment Setup!\n");
      console.log("This script will help you:");
      console.log("1. Set up your deployment wallet");
      console.log("2. Create test wallets for examples");
      console.log("3. Deploy the Solana program");
      console.log("4. Generate configuration files");
      console.log("\n" + "=".repeat(50) + "\n");

      // Step 1: Interactive wallet setup
      const deployWallet = await this.setupDeployWallet();
      const testWallets = await this.setupTestWallets();

      // Step 2: Ask about deployment
      const deployChoice = await this.question("\nDo you want to deploy the program now? (y/n): ");
      const shouldDeploy = deployChoice.toLowerCase() === 'y' || deployChoice.toLowerCase() === 'yes';
      
      const generateNewProgram = shouldDeploy ? 
        (await this.question("Do you want to generate a new program ID? (y/n): ")).toLowerCase() === 'y' : 
        false;

      // Step 3: Save the wallets we created interactively first
      console.log("\n💾 Saving wallets to test-wallets.json...");
      const allWallets = [deployWallet, ...testWallets];
      this.walletManager.saveTestWalletsJson(allWallets);

      // Step 4: Use ProgramManager for the complete setup with our wallets
      console.log("\n🚀 Running complete setup workflow...");
      const result = await this.programManager.completeSetup({
        useExistingWallets: true,
        numTestWallets: testWallets.length,
        deployProgram: shouldDeploy,
        generateNewProgramId: generateNewProgram,
        deployWallet: deployWallet, // Pass the wallet we created
        testWallets: testWallets    // Pass the test wallets we created
      });

      if (!result.success) {
        console.error(`❌ Setup failed: ${result.error}`);
        process.exit(1);
      }

      // Step 4: Show final summary
      this.showFinalSummary(result, shouldDeploy);

    } catch (error) {
      console.error("❌ Setup failed:", error);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Show final summary of what was accomplished
   */
  private showFinalSummary(result: {
    success: boolean;
    deployWallet?: WalletInfo;
    testWallets?: WalletInfo[];
    programId?: string;
    error?: string;
  }, deploymentAttempted: boolean): void {
    console.log("\n" + "=".repeat(50));
    console.log("✅ Setup completed successfully!\n");
    
    console.log("📁 Files created/updated:");
    console.log("   - anchor/deploy-wallet.json");
    console.log("   - anchor/test-wallets.json");
    console.log("   - anchor/recipients.json");
          console.log("   - ../src/lib/recipients.ts");
    console.log("   - anchor/Anchor.toml");
    
    if (deploymentAttempted && result.programId) {
      console.log("   - .env.local (updated with program ID)");
    }
    
    console.log("\n🚀 Status summary:");
    console.log("1. ✅ Wallets created and configured");
    console.log("2. ✅ Merkle tree generated");
    console.log("3. ✅ Configuration files updated");
    
    if (deploymentAttempted && result.programId) {
      console.log("4. ✅ Program deployed successfully");
      console.log("\n🎯 Next step - Initialize the airdrop:");
      console.log("   cd anchor && npx ts-node scripts/initialize-airdrop.ts");
    } else {
      console.log("4. ⏭️  Program deployment skipped");
      console.log("\n📋 Next steps:");
      console.log("   1. Deploy: cd anchor && anchor deploy");
      console.log("   2. Initialize: npx ts-node scripts/initialize-airdrop.ts");
    }
    
    console.log("\n💡 Wallet information saved in anchor/test-wallets.json");
    console.log("   View with: cat anchor/test-wallets.json");
  }

  /**
   * Program ID fixer for troubleshooting
   */
  public async fixProgramIdMismatch(): Promise<void> {
    try {
      console.log("🔧 Program ID Mismatch Fixer\n");
      console.log("This will ensure program ID consistency across all files.\n");
      
      const status = this.programManager.getProgramStatus();
      console.log("Current status:");
      console.log(`  Built: ${status.built ? '✅' : '❌'}`);
      console.log(`  Deployed: ${status.deployed ? '✅' : '❌'}`);
      console.log(`  Consistent: ${status.consistent ? '✅' : '❌'}`);
      console.log(`  Program ID: ${status.programId || 'Unknown'}\n`);

      if (status.consistent) {
        console.log("✅ No issues detected - all program IDs are consistent!");
        return;
      }

      // Load deploy wallet for potential rebuild
      const { deployWallet } = this.walletManager.loadExistingWallets("test-wallets.json");
      if (!deployWallet) {
        console.error("❌ No deploy wallet found. Please run the setup first.");
        return;
      }

      const result = await this.programManager.forceRebuildAndDeploy(deployWallet);
      
      if (result.success) {
        console.log("✅ Program ID issues fixed successfully!");
        console.log("💡 You can now run: npx ts-node scripts/initialize-airdrop.ts");
      } else {
        console.error(`❌ Fix failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error("❌ Fix failed:", error);
    } finally {
      this.rl.close();
    }
  }
}

export { SolanaDeploymentSetup }; 