use anchor_lang::prelude::*;

#[cfg(test)]
mod tests;

declare_id!("4kPRv6rHokrameuxL5jsALKpzqS852bLnqGmUubs4nRp");

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
