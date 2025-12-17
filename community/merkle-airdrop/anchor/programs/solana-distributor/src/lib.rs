use anchor_lang::prelude::*;
use anchor_lang::solana_program::keccak;

declare_id!("111111111111111111111111111111111111");

#[program]
pub mod solana_distributor {
    use super::*;

    pub fn initialize_airdrop(
        ctx: Context<Initialize>,
        merkle_root: [u8; 32],
        amount: u64,
    ) -> Result<()> {
        let airdrop_state = &mut ctx.accounts.airdrop_state;
        
        // Populate the airdrop state account data
        airdrop_state.merkle_root = merkle_root;
        airdrop_state.authority = ctx.accounts.authority.key();
        airdrop_state.airdrop_amount = amount;
        airdrop_state.amount_claimed = 0;
        airdrop_state.bump = ctx.bumps.airdrop_state;

        // Transfer SOL from authority to the vault (airdrop_state account)
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.authority.key(),
            &airdrop_state.key(),
            amount,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.authority.to_account_info(),
                airdrop_state.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn claim_airdrop(
        ctx: Context<Claim>,
        amount: u64,
        proof: Vec<[u8; 32]>,
        leaf_index: u64,
    ) -> Result<()> {
        let airdrop_state = &mut ctx.accounts.airdrop_state;
        let signer = &ctx.accounts.signer;

        // Step 1: Recreate the original leaf hash from the claimant's data
        let mut leaf_data = Vec::new();
        leaf_data.extend_from_slice(&signer.key().to_bytes());
        leaf_data.extend_from_slice(&amount.to_le_bytes());
        leaf_data.push(0u8); // isClaimed flag (0 = false)
        
        let leaf_hash = keccak::hash(&leaf_data).to_bytes();

        // Step 2: Verify the Merkle proof by recomputing the root
        let computed_root = verify_merkle_proof(&leaf_hash, &proof, leaf_index)?;
        
        require!(
            computed_root == airdrop_state.merkle_root,
            ErrorCode::InvalidProof
        );

        // Step 3: Transfer SOL from airdrop_state to the user
        **airdrop_state.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.signer.to_account_info().try_borrow_mut_lamports()? += amount;

        // Step 4: Update state accounting
        airdrop_state.amount_claimed = airdrop_state.amount_claimed.saturating_add(amount);

        Ok(())
    }

    pub fn update_merkle_root(
        ctx: Context<UpdateMerkleRoot>,
        new_merkle_root: [u8; 32],
        additional_amount: u64,
    ) -> Result<()> {
        let airdrop_state = &mut ctx.accounts.airdrop_state;
        
        // Only the authority can update the Merkle root
        require!(
            ctx.accounts.authority.key() == airdrop_state.authority,
            ErrorCode::Unauthorized
        );

        // Update the Merkle root
        airdrop_state.merkle_root = new_merkle_root;
        
        // Add additional SOL to the airdrop if provided
        if additional_amount > 0 {
            airdrop_state.airdrop_amount = airdrop_state.airdrop_amount.saturating_add(additional_amount);
            
            // Transfer additional SOL from authority to the vault
            let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.authority.key(),
                &airdrop_state.key(),
                additional_amount,
            );

            anchor_lang::solana_program::program::invoke(
                &transfer_ix,
                &[
                    ctx.accounts.authority.to_account_info(),
                    airdrop_state.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        }

        Ok(())
    }
}

// Helper function to verify Merkle proof
fn verify_merkle_proof(
    leaf: &[u8; 32],
    proof: &[[u8; 32]],
    leaf_index: u64,
) -> Result<[u8; 32]> {
    let mut computed_hash = *leaf;
    let mut index = leaf_index;

    for proof_element in proof.iter() {
        if index % 2 == 0 {
            // Hash(current computed hash + current element of the proof)
            let mut hash_input = Vec::new();
            hash_input.extend_from_slice(&computed_hash);
            hash_input.extend_from_slice(proof_element);
            computed_hash = keccak::hash(&hash_input).to_bytes();
        } else {
            // Hash(current element of the proof + current computed hash)
            let mut hash_input = Vec::new();
            hash_input.extend_from_slice(proof_element);
            hash_input.extend_from_slice(&computed_hash);
            computed_hash = keccak::hash(&hash_input).to_bytes();
        }
        index /= 2;
    }

    Ok(computed_hash)
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"merkle_tree"],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<AirdropState>()
    )]
    pub airdrop_state: Account<'info, AirdropState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(
        mut,
        seeds = [b"merkle_tree"],
        bump = airdrop_state.bump
    )]
    pub airdrop_state: Account<'info, AirdropState>,

    #[account(
        init,
        payer = signer,
        space = 8,
        seeds = [b"claim", airdrop_state.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub user_claim: Account<'info, ClaimStatus>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMerkleRoot<'info> {
    #[account(
        mut,
        seeds = [b"merkle_tree"],
        bump = airdrop_state.bump
    )]
    pub airdrop_state: Account<'info, AirdropState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct AirdropState {
    /// The Merkle root of the airdrop (32 bytes)
    pub merkle_root: [u8; 32],
    /// The authority allowed to update the merkle root
    pub authority: Pubkey,
    /// Total SOL allocated for this airdrop (in lamports)
    pub airdrop_amount: u64,
    /// Total SOL claimed so far (in lamports)
    pub amount_claimed: u64,
    /// Bump seed for the PDA
    pub bump: u8,
}

#[account]
pub struct ClaimStatus {}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid Merkle proof")]
    InvalidProof,
    #[msg("Unauthorized")]
    Unauthorized,
}
