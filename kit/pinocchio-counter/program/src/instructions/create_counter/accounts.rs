use pinocchio::{account::AccountView, error::ProgramError};

use crate::{
    traits::InstructionAccounts,
    utils::{
        verify_current_program, verify_empty, verify_event_authority, verify_signer,
        verify_system_account, verify_system_program, verify_writable,
    },
};

/// Accounts for the CreateCounter instruction
///
/// # Account Layout
/// 0. `[signer, writable]` payer - Pays for account creation
/// 1. `[signer]` authority - Authority of the counter
/// 2. `[writable]` counter - Counter PDA to be created
/// 3. `[]` system_program - System program for account creation
/// 4. `[]` event_authority - Event authority PDA
/// 5. `[]` program - Current program
pub struct CreateCounterAccounts<'a> {
    pub payer: &'a AccountView,
    pub authority: &'a AccountView,
    pub counter: &'a AccountView,
    pub system_program: &'a AccountView,
    pub event_authority: &'a AccountView,
    pub program: &'a AccountView,
}

impl<'a> TryFrom<&'a [AccountView]> for CreateCounterAccounts<'a> {
    type Error = ProgramError;

    #[inline(always)]
    fn try_from(accounts: &'a [AccountView]) -> Result<Self, Self::Error> {
        let [payer, authority, counter, system_program, event_authority, program] = accounts else {
            return Err(ProgramError::NotEnoughAccountKeys);
        };

        verify_signer(payer)?;
        verify_writable(payer)?;
        verify_signer(authority)?;

        verify_writable(counter)?;
        verify_empty(counter)?;
        verify_system_account(counter)?;

        verify_system_program(system_program)?;
        verify_current_program(program)?;

        verify_event_authority(event_authority)?;

        Ok(Self {
            payer,
            authority,
            counter,
            system_program,
            event_authority,
            program,
        })
    }
}

impl<'a> InstructionAccounts<'a> for CreateCounterAccounts<'a> {}
