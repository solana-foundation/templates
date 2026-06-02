use pinocchio::error::ProgramError;

use crate::{require_len, traits::InstructionData};

/// Instruction data for CreateCounter
///
/// # Layout
/// * `bump` (u8) - Bump for the counter PDA
pub struct CreateCounterData {
    pub bump: u8,
}

impl<'a> TryFrom<&'a [u8]> for CreateCounterData {
    type Error = ProgramError;

    #[inline(always)]
    fn try_from(data: &'a [u8]) -> Result<Self, Self::Error> {
        require_len!(data, Self::LEN);

        Ok(Self { bump: data[0] })
    }
}

impl<'a> InstructionData<'a> for CreateCounterData {
    const LEN: usize = 1;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_counter_data_try_from_valid() {
        let data = [255u8];
        let result = CreateCounterData::try_from(&data[..]);
        assert!(result.is_ok());
        assert_eq!(result.unwrap().bump, 255);

        let data = [0u8, 1, 2, 3];
        let result = CreateCounterData::try_from(&data[..]);
        assert!(result.is_ok());
        assert_eq!(result.unwrap().bump, 0);
    }

    #[test]
    fn test_create_counter_data_try_from_empty() {
        let data: [u8; 0] = [];
        let result = CreateCounterData::try_from(&data[..]);
        assert!(matches!(result, Err(ProgramError::InvalidInstructionData)));
    }
}
