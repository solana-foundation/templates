use alloc::vec::Vec;
use codama::CodamaType;
use pinocchio::Address;

use crate::traits::{EventDiscriminator, EventDiscriminators, EventSerialize};

#[derive(CodamaType)]
pub struct CounterCreatedEvent {
    pub authority: Address,
}

impl EventDiscriminator for CounterCreatedEvent {
    const DISCRIMINATOR: u8 = EventDiscriminators::CounterCreated as u8;
}

impl EventSerialize for CounterCreatedEvent {
    #[inline(always)]
    fn to_bytes_inner(&self) -> Vec<u8> {
        let mut data = Vec::with_capacity(Self::DATA_LEN);
        data.extend_from_slice(self.authority.as_ref());
        data
    }
}

impl CounterCreatedEvent {
    pub const DATA_LEN: usize = 32; // authority

    #[inline(always)]
    pub fn new(authority: Address) -> Self {
        Self { authority }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::events::EVENT_IX_TAG_LE;
    use crate::traits::EVENT_DISCRIMINATOR_LEN;

    #[test]
    fn test_counter_created_event_new() {
        let authority = Address::new_from_array([1u8; 32]);
        let event = CounterCreatedEvent::new(authority);

        assert_eq!(event.authority, authority);
    }

    #[test]
    fn test_counter_created_event_to_bytes_inner() {
        let authority = Address::new_from_array([1u8; 32]);
        let event = CounterCreatedEvent::new(authority);

        let bytes = event.to_bytes_inner();
        assert_eq!(bytes.len(), CounterCreatedEvent::DATA_LEN);
        assert_eq!(&bytes[..32], authority.as_ref());
    }

    #[test]
    fn test_counter_created_event_to_bytes() {
        let authority = Address::new_from_array([1u8; 32]);
        let event = CounterCreatedEvent::new(authority);

        let bytes = event.to_bytes();
        assert_eq!(
            bytes.len(),
            EVENT_DISCRIMINATOR_LEN + CounterCreatedEvent::DATA_LEN
        );
        assert_eq!(&bytes[..8], EVENT_IX_TAG_LE);
        assert_eq!(bytes[8], 0); // CounterCreated discriminator
        assert_eq!(&bytes[9..41], authority.as_ref());
    }
}
