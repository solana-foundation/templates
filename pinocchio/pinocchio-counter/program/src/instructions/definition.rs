use codama::CodamaInstructions;

/// Instructions for the Pinocchio Counter Program.
#[allow(clippy::large_enum_variant)]
#[repr(C, u8)]
#[derive(Clone, Debug, PartialEq, CodamaInstructions)]
pub enum PinocchioCounterInstruction {
    /// Create a new counter for the authority.
    #[codama(account(name = "payer", signer, writable))]
    #[codama(account(name = "authority", signer))]
    #[codama(account(name = "counter", writable))]
    #[codama(account(name = "system_program"))]
    #[codama(account(name = "event_authority"))]
    #[codama(account(name = "pinocchioCounterProgram"))]
    CreateCounter {
        /// Bump for the counter PDA
        bump: u8,
    } = 0,

    /// Increment the counter value by 1.
    #[codama(account(name = "authority", signer))]
    #[codama(account(name = "counter", writable))]
    #[codama(account(name = "event_authority"))]
    #[codama(account(name = "pinocchioCounterProgram"))]
    Increment {} = 1,

    /// Invoked via CPI to emit event data in instruction args (prevents log truncation).
    #[codama(account(name = "event_authority", signer))]
    EmitEvent {} = 228,
}
