use alloc::vec::Vec;
use pinocchio::error::ProgramError;

use crate::{require_len, validate_discriminator};

/// Discriminator for account types
pub trait Discriminator {
    const DISCRIMINATOR: u8;
}

/// Version marker for account types
pub trait Versioned {
    const VERSION: u8;
}

/// Account size constants
pub trait AccountSize: Discriminator + Versioned + Sized {
    /// Size of the account data (excluding discriminator and version)
    const DATA_LEN: usize;

    /// Total size including discriminator and version
    const LEN: usize = 1 + 1 + Self::DATA_LEN;
}

/// Zero-copy account deserialization
pub trait AccountDeserialize: AccountSize {
    /// Zero-copy read from byte slice (validates discriminator, skips version)
    #[inline(always)]
    fn from_bytes(data: &[u8]) -> Result<&Self, ProgramError> {
        require_len!(data, Self::LEN);
        validate_discriminator!(data, Self::DISCRIMINATOR);

        // Skip discriminator (byte 0) and version (byte 1)
        unsafe { Self::from_bytes_unchecked(&data[2..]) }
    }

    /// Zero-copy read without discriminator validation
    ///
    /// # Safety
    /// Caller must ensure data is valid, properly sized, and aligned.
    /// Struct must be `#[repr(C)]` with no padding.
    #[inline(always)]
    unsafe fn from_bytes_unchecked(data: &[u8]) -> Result<&Self, ProgramError> {
        if data.len() < Self::DATA_LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(&*(data.as_ptr() as *const Self))
    }

    /// Mutable zero-copy access
    #[inline(always)]
    fn from_bytes_mut(data: &mut [u8]) -> Result<&mut Self, ProgramError> {
        require_len!(data, Self::LEN);
        validate_discriminator!(data, Self::DISCRIMINATOR);

        // Skip discriminator (byte 0) and version (byte 1)
        unsafe { Self::from_bytes_mut_unchecked(&mut data[2..]) }
    }

    /// Mutable zero-copy access without validation
    ///
    /// # Safety
    /// Caller must ensure data is valid, properly sized, and aligned.
    /// Struct must be `#[repr(C)]` with no padding.
    #[inline(always)]
    unsafe fn from_bytes_mut_unchecked(data: &mut [u8]) -> Result<&mut Self, ProgramError> {
        if data.len() < Self::DATA_LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(&mut *(data.as_mut_ptr() as *mut Self))
    }
}

/// Account discriminator values for this program
#[repr(u8)]
pub enum PinocchioCounterAccountDiscriminators {
    CounterDiscriminator = 0,
}

/// Account serialization with discriminator and version prefix
pub trait AccountSerialize: Discriminator + Versioned {
    /// Serialize account data without discriminator/version
    fn to_bytes_inner(&self) -> Vec<u8>;

    /// Serialize with discriminator and version prefix
    #[inline(always)]
    fn to_bytes(&self) -> Vec<u8> {
        let inner = self.to_bytes_inner();
        let mut data = Vec::with_capacity(1 + 1 + inner.len());
        data.push(Self::DISCRIMINATOR);
        data.push(Self::VERSION);
        data.extend_from_slice(&inner);
        data
    }

    /// Write directly to a mutable slice
    #[inline(always)]
    fn write_to_slice(&self, dest: &mut [u8]) -> Result<(), ProgramError> {
        let bytes = self.to_bytes();
        if dest.len() < bytes.len() {
            return Err(ProgramError::AccountDataTooSmall);
        }
        dest[..bytes.len()].copy_from_slice(&bytes);
        Ok(())
    }
}
