use pinocchio_counter_client::PINOCCHIO_COUNTER_ID;
use solana_sdk::pubkey::Pubkey;

const COUNTER_SEED: &[u8] = b"counter";
const EVENT_AUTHORITY_SEED: &[u8] = b"event_authority";

pub fn find_counter_pda(authority: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[COUNTER_SEED, authority.as_ref()], &PINOCCHIO_COUNTER_ID)
}

pub fn find_event_authority_pda() -> (Pubkey, u8) {
    Pubkey::find_program_address(&[EVENT_AUTHORITY_SEED], &PINOCCHIO_COUNTER_ID)
}
