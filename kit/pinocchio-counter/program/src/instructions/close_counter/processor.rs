use pinocchio::{account::AccountView, Address, ProgramResult};

use crate::{
    events::CounterClosedEvent,
    instructions::CloseCounter,
    state::Counter,
    traits::{AccountDeserialize, EventSerialize, PdaSeeds},
    utils::{close_pda_account, emit_event},
};

/// Processes the CloseCounter instruction.
///
/// Closes the counter account and transfers lamports to the destination.
pub fn process_close_counter(
    program_id: &Address,
    accounts: &[AccountView],
    instruction_data: &[u8],
) -> ProgramResult {
    let ix = CloseCounter::try_from((instruction_data, accounts))?;

    // Get counter data
    let counter_data = ix.accounts.counter.try_borrow()?;
    let counter = Counter::from_bytes(&counter_data)?;

    // Validate PDA
    counter.validate_pda(ix.accounts.counter, program_id, counter.bump)?;

    // Validate authority
    counter.validate_authority(ix.accounts.authority.address())?;

    // Store values needed for event before zeroing
    let authority = counter.authority;
    let final_count = counter.count;

    // Drop the borrow before modifying the account
    drop(counter_data);

    // Close the counter PDA account
    close_pda_account(ix.accounts.counter, ix.accounts.destination)?;

    // Emit event via CPI
    let event = CounterClosedEvent::new(authority, final_count);
    emit_event(
        program_id,
        ix.accounts.event_authority,
        ix.accounts.program,
        &event.to_bytes(),
    )?;

    Ok(())
}
