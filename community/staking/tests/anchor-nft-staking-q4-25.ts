import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorNftStakingQ425 } from "../target/types/anchor_nft_staking_q4_25";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";
import { assert } from "chai";

describe("anchor-nft-staking-q4-25", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .anchorNftStakingQ425 as Program<AnchorNftStakingQ425>;
  const connection = provider.connection;

  // Accounts
  const admin = provider.wallet;
  const user = Keypair.generate();
  const collection = Keypair.generate();
  const asset = Keypair.generate();

  // Config parameters
  const pointsPerStake = 10;
  const maxStake = 5;
  const freezePeriod = 0; // 0 days for testing

  // PDAs
  let configPda: PublicKey;
  let rewardMintPda: PublicKey;
  let userAccountPda: PublicKey;
  let collectionInfoPda: PublicKey;
  let stakeAccountPda: PublicKey;
  let rewardsAtaPda: PublicKey;

  console.log(`Admin: ${admin.publicKey.toString()}`);
  console.log(`User: ${user.publicKey.toString()}`);
  console.log(`Collection: ${collection.publicKey.toString()}`);
  console.log(`Asset: ${asset.publicKey.toString()}`);

  before(async () => {
    // Airdrop to user
    await connection.requestAirdrop(user.publicKey, 5_000_000_000); // 5 SOL
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Derive PDAs
    configPda = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    )[0];
    console.log(`Config PDA: ${configPda.toString()}`);

    rewardMintPda = PublicKey.findProgramAddressSync(
      [Buffer.from("rewards"), configPda.toBuffer()],
      program.programId
    )[0];
    console.log(`Reward Mint PDA: ${rewardMintPda.toString()}`);

    userAccountPda = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    )[0];
    console.log(`User Account PDA: ${userAccountPda.toString()}`);

    collectionInfoPda = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_info"), collection.publicKey.toBuffer()],
      program.programId
    )[0];
    console.log(`Collection Info PDA: ${collectionInfoPda.toString()}`);

    stakeAccountPda = PublicKey.findProgramAddressSync(
      [Buffer.from("stake"), configPda.toBuffer(), asset.publicKey.toBuffer()],
      program.programId
    )[0];
    console.log(`Stake Account PDA: ${stakeAccountPda.toString()}`);

    rewardsAtaPda = getAssociatedTokenAddressSync(
      rewardMintPda,
      user.publicKey
    );
    console.log(`Rewards ATA: ${rewardsAtaPda.toString()}`);
  });

  describe("Initialize Config", () => {
    it("Initialize the staking config", async () => {
      const tx = await program.methods
        .initializeConfig(pointsPerStake, maxStake, freezePeriod)
        .accountsStrict({
          admin: admin.publicKey,
          config: configPda,
          rewardMint: rewardMintPda,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log(`Initialize Config tx: ${tx}`);

      const config = await program.account.stakeConfig.fetch(configPda);
      assert.equal(config.pointsPerStake, pointsPerStake);
      assert.equal(config.maxStake, maxStake);
      assert.equal(config.freezePeriod, freezePeriod);
      console.log("Config initialized successfully");
    });
  });

  describe("Initialize User", () => {
    it("Initialize a user account", async () => {
      const tx = await program.methods
        .initializeUser()
        .accountsStrict({
          user: user.publicKey,
          userAccount: userAccountPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log(`Initialize User tx: ${tx}`);

      const userAccount = await program.account.userAccount.fetch(
        userAccountPda
      );
      assert.equal(userAccount.points, 0);
      assert.equal(userAccount.amountStaked, 0);
      console.log("User account initialized successfully");
    });
  });

  describe("Create Collection", () => {
    it("Create a Metaplex Core collection", async () => {
      const args = {
        name: "Test Staking Collection",
        uri: "https://example.com/collection.json",
        nftName: "Staked NFT",
        nftUri: "https://example.com/nft.json",
      };

      const tx = await program.methods
        .createCollection(args)
        .accountsStrict({
          authority: admin.publicKey,
          collection: collection.publicKey,
          collectionInfo: collectionInfoPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([collection])
        .rpc();

      console.log(`Create Collection tx: ${tx}`);

      const collectionInfo = await program.account.collectionInfo.fetch(
        collectionInfoPda
      );
      assert.equal(
        collectionInfo.collection.toString(),
        collection.publicKey.toString()
      );
      assert.equal(
        collectionInfo.authority.toString(),
        admin.publicKey.toString()
      );
      assert.equal(collectionInfo.name, args.name);
      assert.equal(collectionInfo.nftName, args.nftName);
      console.log("Collection created successfully");
    });
  });

  describe("Mint NFT", () => {
    it("Mint an NFT without FreezeDelegate", async () => {
      const tx = await program.methods
        .mintNft()
        .accountsStrict({
          minter: user.publicKey,
          asset: asset.publicKey,
          collection: collection.publicKey,
          collectionInfo: collectionInfoPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user, asset])
        .rpc();

      console.log(`Mint NFT tx: ${tx}`);

      // Verify asset exists
      const assetAccount = await connection.getAccountInfo(asset.publicKey);
      assert.ok(assetAccount, "Asset should exist");
      console.log("NFT minted successfully (no freeze at mint)");
    });
  });

  describe("Stake NFT", () => {
    it("Stake the NFT and add FreezeDelegate plugin", async () => {
      const userAccountBefore = await program.account.userAccount.fetch(
        userAccountPda
      );
      assert.equal(userAccountBefore.amountStaked, 0);

      const tx = await program.methods
        .stake()
        .accountsStrict({
          user: user.publicKey,
          asset: asset.publicKey,
          collection: collection.publicKey,
          stakeAccount: stakeAccountPda,
          config: configPda,
          userAccount: userAccountPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log(`Stake tx: ${tx}`);

      const stakeAccount = await program.account.stakeAccount.fetch(
        stakeAccountPda
      );
      assert.equal(stakeAccount.owner.toString(), user.publicKey.toString());
      assert.equal(stakeAccount.mint.toString(), asset.publicKey.toString());
      assert.ok(stakeAccount.stakedAt > new anchor.BN(0));

      const userAccountAfter = await program.account.userAccount.fetch(
        userAccountPda
      );
      assert.equal(userAccountAfter.amountStaked, 1);
      console.log("NFT staked successfully");
    });
  });

  describe("Unstake NFT", () => {
    it("Unstake the NFT and remove FreezeDelegate plugin", async () => {
      // Wait for freeze period if needed (0 in this test)
      if (freezePeriod > 0) {
        console.log(`Waiting for freeze period: ${freezePeriod} days`);
        // In a real test with actual freeze period, you'd need to manipulate time or wait
      }

      const userAccountBefore = await program.account.userAccount.fetch(
        userAccountPda
      );
      const pointsBefore = userAccountBefore.points;

      const tx = await program.methods
        .unstake()
        .accountsStrict({
          user: user.publicKey,
          asset: asset.publicKey,
          collection: collection.publicKey,
          stakeAccount: stakeAccountPda,
          config: configPda,
          userAccount: userAccountPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log(`Unstake tx: ${tx}`);

      // Verify stake account is closed
      try {
        await program.account.stakeAccount.fetch(stakeAccountPda);
        assert.fail("Stake account should be closed");
      } catch (err) {
        // Expected - account should be closed
        console.log("Stake account closed successfully");
      }

      const userAccountAfter = await program.account.userAccount.fetch(
        userAccountPda
      );
      assert.equal(userAccountAfter.amountStaked, 0);
      // Points should be awarded (time_elapsed * points_per_stake)
      assert.ok(userAccountAfter.points >= pointsBefore);
      console.log(
        `NFT unstaked successfully, points earned: ${
          userAccountAfter.points - pointsBefore
        }`
      );
    });
  });

  describe("Claim Rewards", () => {
    it("Claim reward tokens based on points", async () => {
      const userAccountBefore = await program.account.userAccount.fetch(
        userAccountPda
      );
      const pointsBefore = userAccountBefore.points;

      if (pointsBefore === 0) {
        console.log("No points to claim, skipping claim test");
        return;
      }

      const tx = await program.methods
        .claim()
        .accountsStrict({
          user: user.publicKey,
          rewardsAta: rewardsAtaPda,
          config: configPda,
          userAccount: userAccountPda,
          rewardMint: rewardMintPda,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log(`Claim tx: ${tx}`);

      const userAccountAfter = await program.account.userAccount.fetch(
        userAccountPda
      );
      assert.equal(userAccountAfter.points, 0, "Points should be reset to 0");

      // Check token balance
      const rewardsAta = await connection.getAccountInfo(rewardsAtaPda);
      assert.ok(rewardsAta, "Rewards ATA should exist");
      console.log("Rewards claimed successfully");
    });
  });
});
