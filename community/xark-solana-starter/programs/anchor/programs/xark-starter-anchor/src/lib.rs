pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use interface::{PublicInputs, PROOF_LEN};

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Bm8G39aXoNKtWNAr35bcPJKctwTsqTfAgXCDDQNPpe2Q");

#[program]
pub mod xark_starter_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        crate::instructions::initialize::handle_initialize(ctx)
    }

    pub fn register(ctx: Context<Register>, commitment: [u8; 32]) -> Result<()> {
        crate::instructions::register::handle_register(ctx, commitment)
    }

    pub fn claim(
        ctx: Context<Claim>,
        proof: [u8; PROOF_LEN],
        public_inputs: [u8; PublicInputs::LEN],
    ) -> Result<()> {
        crate::instructions::claim::handle_claim(ctx, proof, public_inputs)
    }
}
