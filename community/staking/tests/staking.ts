import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Staking } from "../target/types/staking";
import { 
  TOKEN_PROGRAM_ID, 
  createMint, 
  createAccount, 
  mintTo, 
  getAccount, 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";
import { assert } from "chai";
import bs58 from "bs58"; // <--- ADDED: Required to decode your string secret keys

describe("staking", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Staking as Program<Staking>;
  const admin = anchor.web3.Keypair.fromSecretKey(
    bs58.decode("")
  );
  const user = anchor.web3.Keypair.fromSecretKey(
    bs58.decode("")
  );

  let rewardMint: anchor.web3.PublicKey;
  let receiptMint: anchor.web3.PublicKey;

  let adminRewardAccount: anchor.web3.PublicKey;


  let poolStatePda: anchor.web3.PublicKey;
  let rewardVaultPda: anchor.web3.PublicKey;
  let stakeAccountPda: anchor.web3.PublicKey;
  let solVaultPda: anchor.web3.PublicKey;
  let mintAuthorityPda: anchor.web3.PublicKey;
  let mintAuthBump: number;

  before(async () => {
  
    [mintAuthorityPda, mintAuthBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint_authority")],
      program.programId
    );

    // Create the 2 Mints (Reward & Receipt)
    rewardMint = await createMint(provider.connection, admin, admin.publicKey, null, 6);
    receiptMint = await createMint(provider.connection, admin, mintAuthorityPda, null, 9);
  console.log("reward mint",rewardMint);
  console.log("recipent mint",receiptMint);
    [poolStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool_state"), rewardMint.toBuffer()],
      program.programId
    );
    [rewardVaultPda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("reward_vault"), rewardMint.toBuffer()], program.programId);
    [stakeAccountPda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("client1"), user.publicKey.toBuffer()], program.programId);
    [solVaultPda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), user.publicKey.toBuffer()], program.programId);

    // Give the Admin some reward tokens to fund the pool with
    adminRewardAccount = await createAccount(provider.connection, admin, rewardMint, admin.publicKey);
    await mintTo(provider.connection, admin, rewardMint, adminRewardAccount, admin, 1_000_000_000); // 1,000 Tokens
  });

  
  it("Initializes the Global Pool", async () => {
    const rewardRate = new anchor.BN(100); 

    await program.methods
      .initializePool(rewardRate)
      .accountsStrict({
        admin: admin.publicKey,
        poolState: poolStatePda,
        rewardMint: rewardMint,
        rewardVault: rewardVaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([admin])
      .rpc();

    const state = await program.account.poolState.fetch(poolStatePda);
    assert.isTrue(state.admin.equals(admin.publicKey));
    assert.isTrue(state.rewardMint.equals(rewardMint));
  });

  it("Funds the Reward Vault", async () => {
    const fundAmount = new anchor.BN(500_000_000); 

    await program.methods
      .fundRewardVault(fundAmount)
      .accountsStrict({
        admin: admin.publicKey,
        poolState: poolStatePda,
        rewardMint: rewardMint,
        adminTokenAccount: adminRewardAccount,
        rewardVault: rewardVaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([admin])
      .rpc();

    const vaultBalance = await getAccount(provider.connection, rewardVaultPda);
    assert.equal(Number(vaultBalance.amount), 500_000_000);
  });



  it("Initializes User Stake Account", async () => {
    const seed = new anchor.BN(1);

    await program.methods
      .initialize(seed)
      .accountsStrict({
        signer: user.publicKey,
        stakeAccount: stakeAccountPda, // Note: Ensure your Rust struct uses `pub stake_account: Account...`
        vault: solVaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const userState = await program.account.stakeAccount.fetch(stakeAccountPda);
    // Assuming your Rust struct has `pub owner: Pubkey`, not `signer`
    assert.isTrue(userState.signer.equals(user.publicKey)); 
    assert.equal(userState.stakedAmount.toNumber(), 0);
  });

  it("Stakes SOL and mints receipt tokens", async () => {
    const stakeAmount = new anchor.BN(2); 
    const userReceiptAta = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        receiptMint,
        user.publicKey
      )
    ).address;

    await program.methods
      .stake(new anchor.BN(stakeAmount)) // Passed mintAuthBump here in case your Rust expects it!
      .accountsStrict({
        signer: user.publicKey,
        stakeAccount: stakeAccountPda, // Changed to `pda` to match our previous Rust code struct
        poolState: poolStatePda,
        rewardMint: rewardMint,
        mintAccount: receiptMint,
        associatedTokenAccount: userReceiptAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        vault: solVaultPda,
        mintAuthority: mintAuthorityPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const vaultBalance = await provider.connection.getBalance(solVaultPda);
    assert.isAtLeast(vaultBalance, stakeAmount.toNumber());

    const receiptBalance = await getAccount(provider.connection, userReceiptAta);
    assert.isTrue(Number(receiptBalance.amount) > 0);
  });

  it("Claims rewards after waiting", async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const userRewardAta = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        rewardMint,
        user.publicKey
      )
    ).address;

    await program.methods
      .claimReward()
      .accountsStrict({
        signer: user.publicKey,
      stakeAccount: stakeAccountPda,
        rewardMint: rewardMint,
        userRewardAccount: userRewardAta,
        rewardVault: rewardVaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const rewardBalance = await getAccount(provider.connection, userRewardAta);
    assert.isTrue(Number(rewardBalance.amount) > 0, "User should have received reward tokens");
  });

  it("Unstakes SOL and burns receipt tokens", async () => {
    const unstakeAmount = new anchor.BN(2); 
    const userReceiptAta = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        user,
        receiptMint,
        user.publicKey
      )
    ).address;

    await program.methods
      .unstake(unstakeAmount)
      .accountsStrict({
        signer: user.publicKey,
        stakeAccount: stakeAccountPda, 
        poolState: poolStatePda,
        rewardMint: rewardMint,
        mintAccount: receiptMint,
        associatedTokenAccount: userReceiptAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        vault: solVaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const userState = await program.account.stakeAccount.fetch(stakeAccountPda);
    assert.equal(userState.stakedAmount.toNumber(), 0);
  });
});