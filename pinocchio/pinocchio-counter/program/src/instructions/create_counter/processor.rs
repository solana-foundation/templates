use alloc::vec::Vec;
use pinocchio::{account::AccountView, cpi::Seed, error::ProgramError, Address, ProgramResult};

use crate::{
    events::CounterCreatedEvent,
    instructions::CreateCounter,
    state::Counter,
    traits::{AccountSerialize, AccountSize, EventSerialize, PdaSeeds},
    utils::{create_pda_account, emit_event},
};

/// Processes the CreateCounter instruction.
///
/// Creates a Counter PDA with the specified authority.
pub fn process_create_counter(
    program_id: &Address,
    accounts: &[AccountView],
    instruction_data: &[u8],
) -> ProgramResult {
    let ix = CreateCounter::try_from((instruction_data, accounts))?;

    // Create Counter state
    let counter = Counter::new(ix.data.bump, *ix.accounts.authority.address());

    // Validate Counter PDA
    counter.validate_pda(ix.accounts.counter, program_id, ix.data.bump)?;

    // Get seeds for Counter account creation
    let counter_bump_seed = [ix.data.bump];
    let counter_seeds: Vec<Seed> = counter.seeds_with_bump(&counter_bump_seed);
    let counter_seeds_array: [Seed; 3] = counter_seeds
        .try_into()
        .map_err(|_| ProgramError::InvalidArgument)?;

    // Create the Counter account
    create_pda_account(
        ix.accounts.payer,
        Counter::LEN,
        program_id,
        ix.accounts.counter,
        counter_seeds_array,
    )?;

    // Write serialized Counter data to the account
    let mut counter_data_slice = ix.accounts.counter.try_borrow_mut()?;
    counter.write_to_slice(&mut counter_data_slice)?;

    // Emit event via CPI
    let event = CounterCreatedEvent::new(*ix.accounts.authority.address());
    emit_event(
        program_id,
        ix.accounts.event_authority,
        ix.accounts.program,
        &event.to_bytes(),
    )?;

    Ok(())
}
