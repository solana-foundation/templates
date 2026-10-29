use pinocchio::{
    cpi::{Seed, Signer},
    error::ProgramError,
    sysvars::{rent::Rent, Sysvar},
    AccountView, Address, ProgramResult,
};
use pinocchio_system::instructions::{Allocate, Assign, CreateAccount, Transfer};

use crate::{constants::*, state::Counter};

pub fn handle_initialize(program_id: &Address, accounts: &mut [AccountView]) -> ProgramResult {
    let [payer, counter, _system_program] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };
    if !payer.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let (counter_address, bump) =
        Address::find_program_address(&[COUNTER_SEED, payer.address().as_ref()], program_id);
    if counter.address() != &counter_address {
        return Err(ProgramError::InvalidSeeds);
    }

    let bump = [bump];
    let seeds = [
        Seed::from(COUNTER_SEED),
        Seed::from(payer.address().as_ref()),
        Seed::from(&bump),
    ];
    let signer = [Signer::from(&seeds)];

    // The counter address is public, so anyone can send it lamports before it exists, and
    // `CreateAccount` refuses an account that already holds lamports. Top it up, then allocate and
    // assign it instead. Either way the system program rejects a counter that already exists,
    // because it only allocates and assigns empty accounts it owns.
    if counter.lamports() == 0 {
        CreateAccount::with_minimum_balance(
            payer,
            &*counter,
            Counter::LEN as u64,
            program_id,
            None,
        )?
        .invoke_signed(&signer)?;
    } else {
        let required = Rent::get()?.try_minimum_balance(Counter::LEN)?;
        if counter.lamports() < required {
            Transfer {
                from: payer,
                to: &*counter,
                lamports: required - counter.lamports(),
            }
            .invoke()?;
        }
        Allocate {
            account: &*counter,
            space: Counter::LEN as u64,
        }
        .invoke_signed(&signer)?;
        Assign {
            account: &*counter,
            owner: program_id,
        }
        .invoke_signed(&signer)?;
    }

    Counter {
        discriminator: Counter::DISCRIMINATOR,
        count: 0,
        authority: *payer.address(),
    }
    .store(&mut counter.try_borrow_mut()?)
}
