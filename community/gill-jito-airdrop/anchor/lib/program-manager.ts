import { execSync } from "child_process";
import * as fs from "fs";
import { BuildCoordinator } from "./build-coordinator";
import { WalletManager } from "./wallet-manager";
import { FileManager } from "./file-manager";
import { MerkleTreeManager } from "./merkle-tree-manager";
import type { WalletInfo, DeploymentResult } from "./types";

/**
 * High-level program management that coordinates all deployment operations
 */
export class ProgramManager {
  private buildCoordinator: BuildCoordinator;
  private walletManager: WalletManager;
  private fileManager: FileManager;

  constructor(workingDir: string = "anchor", rpcUrl: string = "https://api.devnet.solana.com") {
    this.buildCoordinator = new BuildCoordinator(workingDir);
    this.walletManager = new WalletManager(rpcUrl);
    this.fileManager = new FileManager(workingDir);
  }

  /**
   * Generate a new program ID and keypair
   */
  generateNewProgramId(): { programId: string; keypairPath: string } {
    try {
      console.log("🆔 Generating new program ID...");
      
      // Generate new program keypair
      const keypairPath = "new-program-keypair.json";
      
      // Remove existing keypair if it exists
      if (fs.existsSync(keypairPath)) {
        fs.unlinkSync(keypairPath);
      }
      
      execSync(`solana-keygen new --outfile ${keypairPath} --no-bip39-passphrase --force`, { stdio: "pipe" });
      
      // Get the program ID
      const programId = execSync(`solana address -k ${keypairPath}`, { encoding: "utf8" }).trim();
      
      console.log(`✅ Generated new program ID: ${programId}`);
      return { programId, keypairPath };
    } catch (error) {
      console.error("❌ Error generating program ID:", error);
      throw error;
    }
  }

  /**
   * Complete deployment workflow with proper build coordination
   */
  async deployProgram(options: {
    deployWallet: WalletInfo;
    generateNewProgramId?: boolean;
    minFunding?: number;
  }): Promise<DeploymentResult> {
    const { deployWallet, generateNewProgramId = false, minFunding = 2 } = options;

    try {
      console.log("\n🚀 Starting program deployment...\n");

      // Step 1: Ensure deploy wallet is funded
      console.log("💰 Ensuring deploy wallet has sufficient funds...");
      const fundedWallet = await this.walletManager.ensureWalletFunded(
        deployWallet, 
        minFunding, 
        minFunding
      );
      
      // Save the deploy wallet file (needed by Anchor)
      this.walletManager.saveWalletFile(fundedWallet);

      // Step 2: Handle program ID generation if requested
      let newKeypairPath: string | null = null;
      let targetProgramId: string | null = null;

      if (generateNewProgramId) {
        const { programId, keypairPath } = this.generateNewProgramId();
        targetProgramId = programId;
        newKeypairPath = keypairPath;
        
        // Update all program references before building
        this.fileManager.updateProgramReferences(programId);
      }

      // Step 3: Ensure program ID consistency and build if needed
      const currentProgramId = this.fileManager.getCurrentProgramId();
      const consistencyFixed = await this.buildCoordinator.ensureProgramIdConsistency(targetProgramId || currentProgramId);
      
      if (!consistencyFixed) {
        return { success: false, error: "Failed to ensure program ID consistency" };
      }

      // Step 4: Deploy the program
      const deployResult = await this.buildCoordinator.deployProgram(newKeypairPath);
      
      if (!deployResult.success) {
        return deployResult;
      }

      // Step 5: Clean up temporary files
      if (newKeypairPath && fs.existsSync(newKeypairPath)) {
        fs.unlinkSync(newKeypairPath);
      }

      console.log("✅ Program deployment completed successfully!");
      return {
        success: true,
        programId: deployResult.programId
      };

    } catch (error) {
      console.error("❌ Deployment failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Complete setup workflow including wallets, configuration, and merkle tree
   */
  async completeSetup(options: {
    useExistingWallets?: boolean;
    numTestWallets?: number;
    deployProgram?: boolean;
    generateNewProgramId?: boolean;
    deployWallet?: WalletInfo;
    testWallets?: WalletInfo[];
  }): Promise<{
    success: boolean;
    deployWallet?: WalletInfo;
    testWallets?: WalletInfo[];
    programId?: string;
    error?: string;
  }> {
    const { 
      useExistingWallets = false, 
      numTestWallets = 3, 
      deployProgram = false,
      generateNewProgramId = false,
      deployWallet: providedDeployWallet,
      testWallets: providedTestWallets
    } = options;

    try {
      console.log("🎉 Starting complete setup workflow...\n");

      // Step 1: Use provided deploy wallet or load/create one
      let deployWallet: WalletInfo;
      
      if (providedDeployWallet) {
        console.log("✅ Using provided deploy wallet");
        deployWallet = providedDeployWallet;
      } else {
        const { deployWallet: existingDeployWallet } = this.walletManager.loadExistingWallets();

        if (useExistingWallets && existingDeployWallet) {
          console.log("✅ Using existing deploy wallet");
          deployWallet = await this.walletManager.updateWalletStatus(existingDeployWallet);
        } else {
          console.log("🔑 Creating new deploy wallet");
          deployWallet = this.walletManager.generateWallet("deploy-wallet");
          deployWallet.isDeployWallet = true;
          deployWallet = await this.walletManager.ensureWalletFunded(deployWallet);
        }
      }

      // Step 2: Use provided test wallets or load/create ones
      let testWallets: WalletInfo[];
      
      if (providedTestWallets && providedTestWallets.length > 0) {
        console.log(`✅ Using ${providedTestWallets.length} provided test wallets`);
        testWallets = providedTestWallets;
      } else {
        const { testWallets: existingTestWallets } = this.walletManager.loadExistingWallets();

        if (useExistingWallets && existingTestWallets.length > 0) {
          console.log(`✅ Using ${existingTestWallets.length} existing test wallets`);
          testWallets = existingTestWallets;
          
          // Update their statuses
          for (let i = 0; i < testWallets.length; i++) {
            testWallets[i] = await this.walletManager.updateWalletStatus(testWallets[i]);
          }
        } else {
          console.log(`🧪 Creating ${numTestWallets} test wallets`);
          testWallets = await this.walletManager.generateTestWallets(numTestWallets);
        }
      }

      // Step 3: Get current program ID
      let programId = this.fileManager.getCurrentProgramId();

      // Step 4: Update configuration files
      console.log("\n📝 Updating configuration files...");
      this.fileManager.updateAnchorConfig(deployWallet, programId);
      
      const allWallets = [deployWallet, ...testWallets];
      this.walletManager.saveTestWalletsJson(allWallets);
      this.fileManager.generateRecipientsJson(testWallets, programId);

      // Step 5: Generate merkle tree
      console.log("\n🌳 Generating merkle tree...");
      const recipientsData = this.fileManager.loadRecipientsFile();
      const { merkleRoot } = MerkleTreeManager.generateMerkleTree(recipientsData);
      this.fileManager.updateRecipientsWithMerkleRoot(merkleRoot);

      // Step 6: Update TypeScript files
      console.log("\n📝 Updating TypeScript files...");
      this.fileManager.updateRecipientsTypeScript();

      // Step 7: Deploy program if requested
      if (deployProgram) {
        console.log("\n🚀 Deploying program...");
        const deployResult = await this.deployProgram({
          deployWallet,
          generateNewProgramId
        });

        if (!deployResult.success) {
          return {
            success: false,
            error: `Deployment failed: ${deployResult.error}`
          };
        }

        programId = deployResult.programId || programId;
        
        // Update environment file with final program ID
        this.fileManager.updateEnvironmentFile(programId);
      }

      console.log("\n✅ Complete setup finished successfully!");
      return {
        success: true,
        deployWallet,
        testWallets,
        programId
      };

    } catch (error) {
      console.error("❌ Setup failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get status of the current program
   */
  getProgramStatus(): {
    built: boolean;
    deployed: boolean;
    consistent: boolean;
    programId: string | null;
  } {
    return this.buildCoordinator.getProgramStatus();
  }

  /**
   * Force rebuild and redeploy
   */
  async forceRebuildAndDeploy(deployWallet: WalletInfo): Promise<DeploymentResult> {
    try {
      console.log("🔄 Forcing clean rebuild and deployment...");
      
      await this.buildCoordinator.clean();
      
      return await this.deployProgram({
        deployWallet,
        generateNewProgramId: false
      });
    } catch (error) {
      console.error("❌ Force rebuild failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}