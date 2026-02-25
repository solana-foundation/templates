/// Validate the length of the data.
///
/// # Arguments
/// * `data` - The data to validate.
/// * `len` - The expected length.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[macro_export]
macro_rules! require_len {
    ($data:expr, $len:expr) => {
        if $data.len() < $len {
            return Err(ProgramError::InvalidInstructionData);
        }
    };
}

/// Validate the discriminator of the account.
///
/// # Arguments
/// * `data` - The account's data to validate.
/// * `discriminator` - The expected discriminator.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[macro_export]
macro_rules! validate_discriminator {
    ($data:expr, $discriminator:expr) => {
        if $data.is_empty() || $data[0] != $discriminator {
            return Err(ProgramError::InvalidAccountData);
        }
    };
}

/// Compile-time assertion that a struct has no implicit padding.
/// Use this for zero-copy structs to ensure memory layout matches serialized format.
///
/// # Example
/// ```ignore
/// assert_no_padding!(Counter, 1 + 32 + 8);
/// ```
#[macro_export]
macro_rules! assert_no_padding {
    ($struct:ty, $expected_size:expr) => {
        const _: () = assert!(
            core::mem::size_of::<$struct>() == $expected_size,
            concat!(
                stringify!($struct),
                " struct size mismatch - check for padding"
            )
        );
    };
}

/// Implement boilerplate `From` and `TryFrom` traits for instruction structs.
///
/// # Example
/// ```ignore
/// impl_instruction!(CreateCounter, CreateCounterAccounts, CreateCounterData);
/// ```
#[macro_export]
macro_rules! impl_instruction {
    ($name:ident, $accounts:ident, $data:ident) => {
        impl<'a> From<($accounts<'a>, $data)> for $name<'a> {
            #[inline(always)]
            fn from((accounts, data): ($accounts<'a>, $data)) -> Self {
                Self { accounts, data }
            }
        }

        impl<'a> TryFrom<(&'a [u8], &'a [pinocchio::account::AccountView])> for $name<'a> {
            type Error = pinocchio::error::ProgramError;

            #[inline(always)]
            fn try_from(
                (data, accounts): (&'a [u8], &'a [pinocchio::account::AccountView]),
            ) -> Result<Self, Self::Error> {
                Self::parse(data, accounts)
            }
        }
    };
}
