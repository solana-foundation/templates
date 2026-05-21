use alloc::vec::Vec;
use codama::CodamaType;
use pinocchio::Address;

use crate::traits::{EventDiscriminator, EventDiscriminators, EventSerialize};

#[derive(CodamaType)]
pub struct CounterIncrementedEvent {
    pub authority: Address,
    pub new_count: u8,
}

impl EventDiscriminator for CounterIncrementedEvent {
    const DISCRIMINATOR: u8 = EventDiscriminators::CounterIncremented as u8;
}

impl EventSerialize for CounterIncrementedEvent {
    #[inline(always)]
    fn to_bytes_inner(&self) -> Vec<u8> {
        let mut data = Vec::with_capacity(Self::DATA_LEN);
        data.extend_from_slice(self.authority.as_ref());
        data.push(self.new_count);
        data
    }
}

impl CounterIncrementedEvent {
    pub const DATA_LEN: usize = 32 + 1; // authority + new_count

    #[inline(always)]
    pub fn new(authority: Address, new_count: u8) -> Self {
        Self {
            authority,
            new_count,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::events::EVENT_IX_TAG_LE;
    use crate::traits::EVENT_DISCRIMINATOR_LEN;

    #[test]
    fn test_counter_incremented_event_new() {
        let authority = Address::new_from_array([1u8; 32]);
        let event = CounterIncrementedEvent::new(authority, 42);

        assert_eq!(event.authority, authority);
        assert_eq!(event.new_count, 42);
    }

    #[test]
    fn test_counter_incremented_event_to_bytes_inner() {
        let authority = Address::new_from_array([1u8; 32]);
        let event = CounterIncrementedEvent::new(authority, 42);

        let bytes = event.to_bytes_inner();
        assert_eq!(bytes.len(), CounterIncrementedEvent::DATA_LEN);
        assert_eq!(&bytes[..32], authority.as_ref());
        assert_eq!(bytes[32], 42);
    }

    #[test]
    fn test_counter_incremented_event_to_bytes() {
        let authority = Address::new_from_array([1u8; 32]);
        let event = CounterIncrementedEvent::new(authority, 42);

        let bytes = event.to_bytes();
        assert_eq!(
            bytes.len(),
            EVENT_DISCRIMINATOR_LEN + CounterIncrementedEvent::DATA_LEN
        );
        assert_eq!(&bytes[..8], EVENT_IX_TAG_LE);
        assert_eq!(bytes[8], 1); // CounterIncremented discriminator
        assert_eq!(&bytes[9..41], authority.as_ref());
        assert_eq!(bytes[41], 42);
    }
}
