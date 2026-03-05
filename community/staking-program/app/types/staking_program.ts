/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/staking_program.json`.
 */
export type StakingProgram = {
  address: '55UVMV1TKf7qMeY66xffEeTzom9BSt6oeaoVQMZkZXCp'
  metadata: {
    name: 'stakingProgram'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'addRewards'
      discriminator: [88, 186, 25, 227, 38, 137, 81, 23]
      accounts: [
        {
          name: 'admin'
          writable: true
          signer: true
        },
        {
          name: 'globalState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 108, 111, 98, 97, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'rewardPool'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [114, 101, 119, 97, 114, 100, 95, 112, 111, 111, 108]
              },
            ]
          }
        },
        {
          name: 'rewardPoolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  95,
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
            ]
          }
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
        {
          name: 'rewardRate'
          type: 'u64'
        },
      ]
    },
    {
      name: 'claim'
      discriminator: [62, 198, 214, 193, 213, 159, 108, 210]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'staker'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101, 114]
              },
              {
                kind: 'account'
                path: 'signer'
              },
            ]
          }
        },
        {
          name: 'globalState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 108, 111, 98, 97, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'rewardPool'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [114, 101, 119, 97, 114, 100, 95, 112, 111, 111, 108]
              },
            ]
          }
        },
        {
          name: 'rewardPoolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  95,
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
            ]
          }
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
      ]
      args: []
    },
    {
      name: 'initialize'
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'admin'
          writable: true
          signer: true
        },
        {
          name: 'vaultAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
              },
            ]
          }
        },
        {
          name: 'rewardPoolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  95,
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
            ]
          }
        },
        {
          name: 'mint'
        },
        {
          name: 'globalState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 108, 111, 98, 97, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'vault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 105, 110, 103, 95, 118, 97, 117, 108, 116]
              },
            ]
          }
        },
        {
          name: 'rewardPool'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [114, 101, 119, 97, 114, 100, 95, 112, 111, 111, 108]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'rent'
          address: 'SysvarRent111111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'stake'
      discriminator: [206, 176, 202, 18, 200, 209, 179, 108]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'staker'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101, 114]
              },
              {
                kind: 'account'
                path: 'signer'
              },
            ]
          }
        },
        {
          name: 'globalState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 108, 111, 98, 97, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'rent'
          address: 'SysvarRent111111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'unstake'
      discriminator: [90, 95, 107, 42, 205, 124, 50, 225]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'staker'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [115, 116, 97, 107, 101, 114]
              },
              {
                kind: 'account'
                path: 'signer'
              },
            ]
          }
        },
        {
          name: 'globalState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 108, 111, 98, 97, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'vaultAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]
              },
            ]
          }
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'globalState'
      discriminator: [163, 46, 74, 168, 216, 123, 133, 98]
    },
    {
      name: 'staker'
      discriminator: [171, 229, 193, 85, 67, 177, 151, 4]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'insufficientStake'
      msg: 'Insufficient stake amount.'
    },
    {
      code: 6001
      name: 'emptyRewardPool'
      msg: 'Reward pool is empty.'
    },
    {
      code: 6002
      name: 'invalidOperation'
      msg: 'Invalid operation.'
    },
  ]
  types: [
    {
      name: 'globalState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'admin'
            type: 'pubkey'
          },
          {
            name: 'stakingTokenMint'
            type: 'pubkey'
          },
          {
            name: 'vault'
            type: 'pubkey'
          },
          {
            name: 'totalStaked'
            type: 'u64'
          },
          {
            name: 'rewardRate'
            type: 'u64'
          },
          {
            name: 'lastRewardTime'
            type: 'i64'
          },
          {
            name: 'rewardPool'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'staker'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'address'
            type: 'pubkey'
          },
          {
            name: 'stakedAmount'
            type: 'u64'
          },
          {
            name: 'rewardDebt'
            type: 'u64'
          },
        ]
      }
    },
  ]
}
