use anchor_lang::prelude::*;
use secret_code_verifier as verifier;

use interface::{PublicInputs, PROOF_LEN};

use crate::{constants::*, error::ErrorCode, state::Code};

#[derive(Accounts)]
#[instruction(proof: [u8; PROOF_LEN], public_inputs: [u8; PublicInputs::LEN])]
pub struct Claim<'info> {
    pub claimant: Signer<'info>,
    // `public_inputs[..32]` is the commitment.
    #[account(mut, seeds = [CODE_SEED, &public_inputs[..32]], bump = code.bump)]
    pub code: Account<'info, Code>,
}

pub fn handle_claim(
    ctx: Context<Claim>,
    proof: [u8; PROOF_LEN],
    public_inputs: [u8; PublicInputs::LEN],
) -> Result<()> {
    let public = PublicInputs::from_bytes(&public_inputs).ok_or(ErrorCode::InvalidPublicInputs)?;
    let claimant = ctx.accounts.claimant.key();

    require!(
        public.signer().map(|a| a.to_bytes()) == Some(claimant.to_bytes()),
        ErrorCode::SignerMismatch
    );

    let code = &mut ctx.accounts.code;
    require!(
        code.claimed_by == Pubkey::default(),
        ErrorCode::AlreadyClaimed
    );

    let mut calldata = [0u8; PROOF_LEN + PublicInputs::LEN];
    calldata[..PROOF_LEN].copy_from_slice(&proof);
    calldata[PROOF_LEN..].copy_from_slice(&public_inputs);
    require!(
        verifier::verify_instruction_data_strict(&calldata),
        ErrorCode::InvalidProof
    );

    code.claimed_by = claimant;

    // TODO: your logic.
    msg!("code claimed by {}", claimant);
    Ok(())
}
