use anchor_lang::prelude::*;

#[cfg(test)]
mod tests;

declare_id!("C9b6uv2JdjyzAwFvMGsGF6Qp8oXTXXFv67JJZbC4gRRM");

#[program]
pub mod basic {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
