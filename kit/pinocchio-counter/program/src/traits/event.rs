use alloc::vec::Vec;

use crate::events::EVENT_IX_TAG_LE;

/// Length of event discriminator bytes (EVENT_IX_TAG_LE + discriminator byte)
pub const EVENT_DISCRIMINATOR_LEN: usize = 8 + 1;

/// Event discriminator values for this program
#[repr(u8)]
pub enum EventDiscriminators {
    CounterCreated = 0,
    CounterIncremented = 1,
    CounterClosed = 2,
}

/// Event discriminator with Anchor-compatible prefix
pub trait EventDiscriminator {
    /// Event discriminator byte
    const DISCRIMINATOR: u8;

    /// Full discriminator bytes including EVENT_IX_TAG_LE prefix
    #[inline(always)]
    fn discriminator_bytes() -> Vec<u8> {
        let mut data = Vec::with_capacity(EVENT_DISCRIMINATOR_LEN);
        data.extend_from_slice(EVENT_IX_TAG_LE);
        data.push(Self::DISCRIMINATOR);
        data
    }
}

/// Event serialization
pub trait EventSerialize: EventDiscriminator {
    /// Serialize event data (without discriminator)
    fn to_bytes_inner(&self) -> Vec<u8>;

    /// Serialize with full discriminator prefix
    #[inline(always)]
    fn to_bytes(&self) -> Vec<u8> {
        let mut data = Self::discriminator_bytes();
        data.extend_from_slice(&self.to_bytes_inner());
        data
    }
}
