use pinocchio_counter_client::PINOCCHIO_COUNTER_ID;

use crate::utils::Address;

const COUNTER_SEED: &[u8] = b"counter";
const EVENT_AUTHORITY_SEED: &[u8] = b"event_authority";

pub fn find_counter_pda(authority: &Address) -> (Address, u8) {
    Address::find_program_address(&[COUNTER_SEED, authority.as_ref()], &PINOCCHIO_COUNTER_ID)
}

pub fn find_event_authority_pda() -> (Address, u8) {
    Address::find_program_address(&[EVENT_AUTHORITY_SEED], &PINOCCHIO_COUNTER_ID)
}
