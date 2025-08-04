import { execSync } from "child_process";
import * as fs from "fs";
import type { BuildResult, DeploymentResult } from "./types";

/**
 * Coordinates all build and deployment operations to avoid redundant builds
 */
export class BuildCoordinator {
  private lastBuildHash: string | null = null;
  private lastDeployHash: string | null = null;

  constructor(private workingDir: string = "anchor") {}

  /**
   * Get hash of source files to detect if rebuild is needed
   */
  private getSourceHash(): string {
    try {
      const libPath = `${this.workingDir}/programs/solana-distributor/src/lib.rs`;
      const cargoPath = `${this.workingDir}/programs/solana-distributor/Cargo.toml`;
      const anchorPath = `${this.workingDir}/Anchor.toml`;
      
      const sources = [
        fs.existsSync(libPath) ? fs.readFileSync(libPath, "utf8") : "",
        fs.existsSync(cargoPath) ? fs.readFileSync(cargoPath, "utf8") : "",
        fs.existsSync(anchorPath) ? fs.readFileSync(anchorPath, "utf8") : "",
      ].join("");
      
      // Simple hash - could use a proper hash function if needed
      return Buffer.from(sources).toString("base64");
    } catch {
      return Date.now().toString();
    }
  }

  /**
   * Check if program ID is consistent across all files
   */
  private checkProgramIdConsistency(): {
    consistent: boolean;
    declaredId: string | null;
    deployedId: string | null;
    anchorId: string | null;
  } {
    const declaredId = this.getDeclaredProgramId();
    const deployedId = this.getDeployedProgramId();
    const anchorId = this.getAnchorProgramId();

    const consistent = declaredId && deployedId && anchorId && 
      declaredId === deployedId && declaredId === anchorId;

    return { consistent, declaredId, deployedId, anchorId };
  }

  private getDeclaredProgramId(): string | null {
    try {
      const libContent = fs.readFileSync(`${this.workingDir}/programs/solana-distributor/src/lib.rs`, "utf8");
      const match = libContent.match(/declare_id!\("([^"]+)"\);/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  private getDeployedProgramId(): string | null {
    try {
      const output = execSync(
        `solana address -k ${this.workingDir}/target/deploy/solana_distributor-keypair.json`,
        { encoding: "utf8" }
      );
      return output.trim();
    } catch {
      return null;
    }
  }

  private getAnchorProgramId(): string | null {
    try {
      const anchorContent = fs.readFileSync(`${this.workingDir}/Anchor.toml`, "utf8");
      const match = anchorContent.match(/solana_distributor = "([^"]+)"/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Build the program only if necessary
   */
  async buildIfNeeded(force: boolean = false): Promise<BuildResult> {
    try {
      const currentHash = this.getSourceHash();
      
      if (!force && this.lastBuildHash === currentHash) {
        console.log("✅ Build is up to date, skipping...");
        const programId = this.getDeclaredProgramId();
        return { success: true, programId: programId || undefined };
      }

      console.log("🔨 Building program...");
      execSync("anchor build", { stdio: "inherit", cwd: this.workingDir });
      
      this.lastBuildHash = currentHash;
      const programId = this.getDeclaredProgramId();
      
      console.log("✅ Build completed successfully!");
      return { success: true, programId: programId || undefined };
    } catch (error) {
      console.error("❌ Build failed:", error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Deploy the program with proper build coordination
   */
  async deployProgram(programKeypairPath?: string): Promise<DeploymentResult> {
    try {
      // First ensure we have a current build
      const buildResult = await this.buildIfNeeded();
      if (!buildResult.success) {
        return { success: false, error: "Build failed before deployment" };
      }

      // Copy program keypair if provided
      if (programKeypairPath) {
        console.log("📋 Setting up program keypair...");
        execSync(`mkdir -p ${this.workingDir}/target/deploy`);
        execSync(`cp ${programKeypairPath} ${this.workingDir}/target/deploy/solana_distributor-keypair.json`);
        console.log("✅ Program keypair configured");
      }

      console.log("📡 Deploying program...");
      const deployOutput = execSync("anchor deploy", { 
        stdio: "pipe", 
        cwd: this.workingDir,
        encoding: "utf8"
      });

      // Extract program ID from deploy output if possible
      const programIdMatch = deployOutput.match(/Program Id: (\w+)/);
      const programId = programIdMatch ? programIdMatch[1] : this.getDeployedProgramId();

      console.log("✅ Program deployed successfully!");
      
      // Update our deploy hash to avoid unnecessary rebuilds
      this.lastDeployHash = this.getSourceHash();
      
      return { success: true, programId: programId || undefined };
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Ensure program ID consistency with minimal rebuilds
   */
  async ensureProgramIdConsistency(targetProgramId?: string): Promise<boolean> {
    const consistency = this.checkProgramIdConsistency();
    
    if (consistency.consistent && !targetProgramId) {
      console.log("✅ Program ID consistency verified!");
      return true;
    }

    const newProgramId = targetProgramId || consistency.deployedId || consistency.declaredId;
    if (!newProgramId) {
      console.error("❌ No valid program ID found to ensure consistency");
      return false;
    }

    console.log("🔧 Updating program ID references...");
    
    // Update lib.rs
    try {
      const libPath = `${this.workingDir}/programs/solana-distributor/src/lib.rs`;
      let libContent = fs.readFileSync(libPath, "utf8");
      libContent = libContent.replace(/declare_id!\(".*"\);/, `declare_id!("${newProgramId}");`);
      fs.writeFileSync(libPath, libContent);
      console.log("   ✅ Updated lib.rs");
    } catch (error) {
      console.error("   ❌ Failed to update lib.rs:", error);
      return false;
    }

    // Update Anchor.toml
    try {
      const anchorPath = `${this.workingDir}/Anchor.toml`;
      let anchorContent = fs.readFileSync(anchorPath, "utf8");
      anchorContent = anchorContent.replace(/solana_distributor = ".*"/, `solana_distributor = "${newProgramId}"`);
      fs.writeFileSync(anchorPath, anchorContent);
      console.log("   ✅ Updated Anchor.toml");
    } catch (error) {
      console.error("   ❌ Failed to update Anchor.toml:", error);
      return false;
    }

    // Force rebuild after ID changes
    console.log("🔄 Rebuilding with updated program ID...");
    const buildResult = await this.buildIfNeeded(true);
    
    if (!buildResult.success) {
      console.error("❌ Failed to rebuild after program ID update");
      return false;
    }

    console.log("✅ Program ID consistency ensured!");
    return true;
  }

  /**
   * Clean build artifacts
   */
  async clean(): Promise<void> {
    try {
      console.log("🧹 Cleaning build artifacts...");
      execSync("anchor clean", { stdio: "inherit", cwd: this.workingDir });
      this.lastBuildHash = null;
      this.lastDeployHash = null;
      console.log("✅ Clean completed!");
    } catch (error) {
      console.error("❌ Clean failed:", error);
      throw error;
    }
  }

  /**
   * Get current program status
   */
  getProgramStatus(): {
    built: boolean;
    deployed: boolean;
    consistent: boolean;
    programId: string | null;
  } {
    const consistency = this.checkProgramIdConsistency();
    const targetExists = fs.existsSync(`${this.workingDir}/target/deploy/solana_distributor-keypair.json`);
    const idlExists = fs.existsSync(`${this.workingDir}/target/idl/solana_distributor.json`);
    
    return {
      built: targetExists && idlExists,
      deployed: !!consistency.deployedId,
      consistent: consistency.consistent,
      programId: consistency.declaredId
    };
  }
}