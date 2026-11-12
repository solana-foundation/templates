pub mod increment;
pub mod initialize;

use codama::CodamaInstructions;

pub const INITIALIZE_DISCRIMINATOR: u8 = HelloWorldInstruction::Initialize as u8;
pub const INCREMENT_DISCRIMINATOR: u8 = HelloWorldInstruction::Increment as u8;

/// The program's instructions. The first byte of instruction data selects one.
#[derive(CodamaInstructions)]
#[repr(u8)]
pub enum HelloWorldInstruction {
    #[codama(account(name = "payer", signer, writable))]
    #[codama(account(name = "counter", writable, default_value = pda("counter", [seed("authority", account("payer"))])))]
    #[codama(account(name = "system_program", default_value = program("system")))]
    Initialize = 0,

    #[codama(account(name = "counter", writable, default_value = pda("counter", [seed("authority", account("authority"))])))]
    #[codama(account(name = "authority", signer))]
    Increment = 1,
}
