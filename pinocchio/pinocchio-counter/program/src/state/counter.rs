use alloc::vec;
use alloc::vec::Vec;
use codama::CodamaAccount;
use pinocchio::{account::AccountView, cpi::Seed, error::ProgramError, Address};

use crate::assert_no_padding;
use crate::errors::PinocchioCounterProgramError;
use crate::traits::{
    AccountDeserialize, AccountSerialize, AccountSize, Discriminator, PdaSeeds,
    PinocchioCounterAccountDiscriminators, Versioned,
};

/// Counter account state
///
/// # PDA Seeds
/// `[b"counter", authority.as_ref()]`
///
/// # Layout (41 bytes)
/// - bump: 1 byte
/// - _padding: 7 bytes (reserved for future use / alignment)
/// - authority: 32 bytes
/// - count: 1 byte
#[derive(Clone, Debug, PartialEq, CodamaAccount)]
#[repr(C)]
pub struct Counter {
    pub bump: u8,
    pub _padding: [u8; 7],
    pub authority: Address,
    pub count: u8,
}

assert_no_padding!(Counter, 1 + 32 + 8);

impl Discriminator for Counter {
    const DISCRIMINATOR: u8 = PinocchioCounterAccountDiscriminators::CounterDiscriminator as u8;
}

impl Versioned for Counter {
    const VERSION: u8 = 1;
}

impl AccountSize for Counter {
    const DATA_LEN: usize = 1 + 7 + 32 + 1; // bump + padding + authority + count
}

impl AccountDeserialize for Counter {}

impl AccountSerialize for Counter {
    #[inline(always)]
    fn to_bytes_inner(&self) -> Vec<u8> {
        let mut data = Vec::with_capacity(Self::DATA_LEN);
        data.push(self.bump);
        data.extend_from_slice(&self._padding);
        data.extend_from_slice(self.authority.as_ref());
        data.push(self.count);
        data
    }
}

impl PdaSeeds for Counter {
    const PREFIX: &'static [u8] = b"counter";

    #[inline(always)]
    fn seeds(&self) -> Vec<&[u8]> {
        vec![Self::PREFIX, self.authority.as_ref()]
    }

    #[inline(always)]
    fn seeds_with_bump<'a>(&'a self, bump: &'a [u8; 1]) -> Vec<Seed<'a>> {
        vec![
            Seed::from(Self::PREFIX),
            Seed::from(self.authority.as_ref()),
            Seed::from(bump.as_slice()),
        ]
    }
}

impl Counter {
    #[inline(always)]
    pub fn new(bump: u8, authority: Address) -> Self {
        Self {
            bump,
            _padding: [0u8; 7],
            authority,
            count: 0,
        }
    }

    #[inline(always)]
    pub fn from_account<'a>(
        data: &'a [u8],
        account: &AccountView,
        program_id: &Address,
    ) -> Result<&'a Self, ProgramError> {
        let state = Self::from_bytes(data)?;
        state.validate_pda(account, program_id, state.bump)?;
        Ok(state)
    }

    #[inline(always)]
    pub fn validate_authority(&self, provided_authority: &Address) -> Result<(), ProgramError> {
        if self.authority != *provided_authority {
            return Err(PinocchioCounterProgramError::InvalidAuthority.into());
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_counter() -> Counter {
        let authority = Address::new_from_array([1u8; 32]);
        Counter {
            bump: 255,
            _padding: [0u8; 7],
            authority,
            count: 42,
        }
    }

    #[test]
    fn test_counter_new() {
        let authority = Address::new_from_array([1u8; 32]);
        let counter = Counter::new(200, authority);

        assert_eq!(counter.bump, 200);
        assert_eq!(counter.authority, authority);
        assert_eq!(counter.count, 0);
    }

    #[test]
    fn test_counter_validate_authority_success() {
        let counter = create_test_counter();
        let valid_authority = Address::new_from_array([1u8; 32]);

        assert!(counter.validate_authority(&valid_authority).is_ok());
    }

    #[test]
    fn test_counter_validate_authority_invalid() {
        let counter = create_test_counter();
        let invalid_authority = Address::new_from_array([99u8; 32]);

        let result = counter.validate_authority(&invalid_authority);
        assert_eq!(
            result,
            Err(PinocchioCounterProgramError::InvalidAuthority.into())
        );
    }

    #[test]
    fn test_counter_to_bytes_inner() {
        let counter = create_test_counter();
        let bytes = counter.to_bytes_inner();

        assert_eq!(bytes.len(), Counter::DATA_LEN);
        assert_eq!(bytes[0], 255); // bump
        assert_eq!(&bytes[1..8], &[0u8; 7]); // padding
        assert_eq!(&bytes[8..40], &[1u8; 32]); // authority
        assert_eq!(bytes[40], 42); // count
    }

    #[test]
    fn test_counter_to_bytes() {
        let counter = create_test_counter();
        let bytes = counter.to_bytes();

        assert_eq!(bytes.len(), Counter::LEN);
        assert_eq!(bytes[0], Counter::DISCRIMINATOR);
        assert_eq!(bytes[1], Counter::VERSION);
        assert_eq!(bytes[2], 255); // bump
    }

    #[test]
    fn test_counter_from_bytes() {
        let counter = create_test_counter();
        let bytes = counter.to_bytes();

        let deserialized = Counter::from_bytes(&bytes).unwrap();

        assert_eq!(deserialized.bump, counter.bump);
        assert_eq!(deserialized._padding, counter._padding);
        assert_eq!(deserialized.authority, counter.authority);
        assert_eq!(deserialized.count, counter.count);
    }

    #[test]
    fn test_counter_seeds() {
        let counter = create_test_counter();
        let seeds = counter.seeds();

        assert_eq!(seeds.len(), 2);
        assert_eq!(seeds[0], Counter::PREFIX);
        assert_eq!(seeds[1], counter.authority.as_ref());
    }
}
