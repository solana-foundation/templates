use pinocchio::error::ProgramError;

use crate::traits::InstructionData;

/// Instruction data for CloseCounter
///
/// # Layout
/// (no additional data required)
pub struct CloseCounterData;

impl<'a> TryFrom<&'a [u8]> for CloseCounterData {
    type Error = ProgramError;

    #[inline(always)]
    fn try_from(_data: &'a [u8]) -> Result<Self, Self::Error> {
        Ok(Self)
    }
}

impl<'a> InstructionData<'a> for CloseCounterData {
    const LEN: usize = 0;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_close_counter_data_try_from_empty() {
        let data: [u8; 0] = [];
        let result = CloseCounterData::try_from(&data[..]);
        assert!(result.is_ok());
    }

    #[test]
    fn test_close_counter_data_try_from_with_extra_data() {
        let data = [1u8, 2, 3];
        let result = CloseCounterData::try_from(&data[..]);
        assert!(result.is_ok());
    }
}
