/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/cause_pots.json`.
 */
export type CausePots = {
  "address": "potsngHK65NFVwYXfSSJykdJ9WZfdQdsqeSFNk6fyMW",
  "metadata": {
    "name": "causePots",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addContributor",
      "discriminator": [
        125,
        221,
        162,
        182,
        191,
        26,
        206,
        219
      ],
      "accounts": [
        {
          "name": "pot",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "pot"
          ]
        }
      ],
      "args": [
        {
          "name": "newContributor",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "contribute",
      "discriminator": [
        82,
        33,
        68,
        131,
        32,
        0,
        205,
        95
      ],
      "accounts": [
        {
          "name": "pot",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pot"
              }
            ]
          }
        },
        {
          "name": "contributorAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pot"
              },
              {
                "kind": "account",
                "path": "contributor"
              }
            ]
          }
        },
        {
          "name": "contributor",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createPot",
      "discriminator": [
        232,
        45,
        123,
        181,
        204,
        121,
        131,
        9
      ],
      "accounts": [
        {
          "name": "pot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pot"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "category",
          "type": {
            "defined": {
              "name": "potCategory"
            }
          }
        },
        {
          "name": "currency",
          "type": {
            "defined": {
              "name": "currency"
            }
          }
        },
        {
          "name": "targetAmount",
          "type": "u64"
        },
        {
          "name": "unlockDays",
          "type": "i64"
        },
        {
          "name": "signersRequired",
          "type": "u8"
        }
      ]
    },
    {
      "name": "releaseFunds",
      "discriminator": [
        225,
        88,
        91,
        108,
        126,
        52,
        2,
        26
      ],
      "accounts": [
        {
          "name": "pot",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pot"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "pot"
          ]
        },
        {
          "name": "recipient",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "signRelease",
      "discriminator": [
        111,
        211,
        85,
        96,
        119,
        69,
        197,
        105
      ],
      "accounts": [
        {
          "name": "pot",
          "writable": true
        },
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "contributor",
      "discriminator": [
        222,
        222,
        255,
        212,
        133,
        49,
        27,
        93
      ]
    },
    {
      "name": "pot",
      "discriminator": [
        238,
        118,
        60,
        175,
        178,
        191,
        59,
        58
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyAContributor",
      "msg": "Already a contributor"
    },
    {
      "code": 6001,
      "name": "alreadySigned",
      "msg": "You have already signed the release"
    },
    {
      "code": 6002,
      "name": "descriptionTooLong",
      "msg": "Pot description is too long (max 200 characters)"
    },
    {
      "code": 6003,
      "name": "invalidAmount",
      "msg": "Contribution amount must be greater than 0"
    },
    {
      "code": 6004,
      "name": "invalidSignersRequired",
      "msg": "Signers required must be between 1 and the maximum number of contributors"
    },
    {
      "code": 6005,
      "name": "invalidTargetAmount",
      "msg": "Target amount must be greater than 0"
    },
    {
      "code": 6006,
      "name": "invalidUnlockDays",
      "msg": "Unlock days must not be negative"
    },
    {
      "code": 6007,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in pot"
    },
    {
      "code": 6008,
      "name": "insufficientSignatures",
      "msg": "Insufficient signatures for release"
    },
    {
      "code": 6009,
      "name": "maxContributorsReached",
      "msg": "Pot has reached the maximum number of contributors"
    },
    {
      "code": 6010,
      "name": "nameTooLong",
      "msg": "Pot name is too long (max 32 characters)"
    },
    {
      "code": 6011,
      "name": "notAContributor",
      "msg": "You are not a contributor to this pot"
    },
    {
      "code": 6012,
      "name": "overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6013,
      "name": "potAlreadyReleased",
      "msg": "Pot has already been released"
    },
    {
      "code": 6014,
      "name": "recipientIsPot",
      "msg": "The pot cannot receive its own funds"
    },
    {
      "code": 6015,
      "name": "timeLockNotExpired",
      "msg": "Time-lock period has not expired yet"
    }
  ],
  "types": [
    {
      "name": "contributor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pot",
            "type": "pubkey"
          },
          {
            "name": "contributor",
            "type": "pubkey"
          },
          {
            "name": "totalContributed",
            "type": "u64"
          },
          {
            "name": "contributionCount",
            "type": "u32"
          },
          {
            "name": "lastContributionAt",
            "type": "i64"
          },
          {
            "name": "joinedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "currency",
      "docs": [
        "Display unit for amounts. Contributions always move SOL; `Usd` only changes",
        "how the app renders the numbers."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "sol"
          },
          {
            "name": "usd"
          }
        ]
      }
    },
    {
      "name": "pot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "Creator of the pot; the only account that can add contributors and release funds."
            ],
            "type": "pubkey"
          },
          {
            "name": "vault",
            "docs": [
              "Vault PDA that holds the pooled SOL."
            ],
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "category",
            "type": {
              "defined": {
                "name": "potCategory"
              }
            }
          },
          {
            "name": "currency",
            "type": {
              "defined": {
                "name": "currency"
              }
            }
          },
          {
            "name": "targetAmount",
            "docs": [
              "Savings target in lamports."
            ],
            "type": "u64"
          },
          {
            "name": "totalContributed",
            "type": "u64"
          },
          {
            "name": "unlockTimestamp",
            "docs": [
              "Release becomes possible once the cluster clock passes this timestamp."
            ],
            "type": "i64"
          },
          {
            "name": "signersRequired",
            "docs": [
              "How many contributor signatures a release requires."
            ],
            "type": "u8"
          },
          {
            "name": "signatures",
            "docs": [
              "Contributors that have approved the release. Each contributor can sign",
              "once, so this never grows past the contributor list."
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "contributors",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "isReleased",
            "type": "bool"
          },
          {
            "name": "releasedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "recipient",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "potCategory",
      "docs": [
        "Category shown in the app, stored on-chain so every contributor sees the same pot."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "goal"
          },
          {
            "name": "emergency"
          },
          {
            "name": "bills"
          },
          {
            "name": "events"
          },
          {
            "name": "others"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "contributorSeed",
      "type": "bytes",
      "value": "[99, 111, 110, 116, 114, 105, 98, 117, 116, 111, 114]"
    },
    {
      "name": "potSeed",
      "type": "bytes",
      "value": "[112, 111, 116]"
    },
    {
      "name": "vaultSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116]"
    }
  ]
};
