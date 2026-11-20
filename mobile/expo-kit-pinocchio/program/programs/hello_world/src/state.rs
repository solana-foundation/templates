use codama::{CodamaAccount, CodamaPda};
use pinocchio::{error::ProgramError, Address};

/// Seeds of the counter PDA: `[b"counter", authority]`.
#[derive(CodamaPda)]
#[codama(name = "counter")]
#[codama(seed(type = string(utf8), value = "counter"))]
#[codama(seed(name = "authority", type = public_key))]
pub struct CounterPda;

/// Account data: a 1-byte discriminator followed by the fields, little-endian.
#[derive(CodamaAccount)]
#[codama(discriminator(field = "discriminator"))]
#[codama(pda = "counter")]
pub struct Counter {
    #[codama(default_value = 1)]
    pub discriminator: u8,
    pub count: u64,
    pub authority: Address,
}

impl Counter {
    pub const DISCRIMINATOR: u8 = 1;
    pub const LEN: usize = 1 + 8 + 32;

    pub fn load(data: &[u8]) -> Result<Self, ProgramError> {
        if data.len() != Self::LEN || data[0] != Self::DISCRIMINATOR {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(Self {
            discriminator: data[0],
            count: u64::from_le_bytes(data[1..9].try_into().unwrap()),
            authority: Address::new_from_array(data[9..41].try_into().unwrap()),
        })
    }

    pub fn store(&self, data: &mut [u8]) -> Result<(), ProgramError> {
        if data.len() != Self::LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        data[0] = Self::DISCRIMINATOR;
        data[1..9].copy_from_slice(&self.count.to_le_bytes());
        data[9..41].copy_from_slice(self.authority.as_ref());
        Ok(())
    }
}
