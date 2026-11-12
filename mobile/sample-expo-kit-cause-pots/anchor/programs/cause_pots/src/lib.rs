pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("potsngHK65NFVwYXfSSJykdJ9WZfdQdsqeSFNk6fyMW");

#[program]
pub mod cause_pots {
    use super::*;

    pub fn add_contributor(ctx: Context<AddContributor>, new_contributor: Pubkey) -> Result<()> {
        crate::instructions::add_contributor::handle_add_contributor(ctx, new_contributor)
    }

    pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
        crate::instructions::contribute::handle_contribute(ctx, amount)
    }

    #[allow(clippy::too_many_arguments)]
    pub fn create_pot(
        ctx: Context<CreatePot>,
        name: String,
        description: String,
        category: PotCategory,
        currency: Currency,
        target_amount: u64,
        unlock_days: i64,
        signers_required: u8,
    ) -> Result<()> {
        crate::instructions::create_pot::handle_create_pot(
            ctx,
            name,
            description,
            category,
            currency,
            target_amount,
            unlock_days,
            signers_required,
        )
    }

    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        crate::instructions::release_funds::handle_release_funds(ctx)
    }

    pub fn sign_release(ctx: Context<SignRelease>) -> Result<()> {
        crate::instructions::sign_release::handle_sign_release(ctx)
    }
}
