# Memo v4 test fixture

`spl_memo_v4.so` is the unmodified official `spl_memo.so` asset from
[solana-program/memo program@v4.0.0](https://github.com/solana-program/memo/releases/tag/program%40v4.0.0).

- Program address: `Memo4c2pN8afCj432Lb7RMVKi9PbQnnW7ewFFaV3oAH`
- Size: 2,304 bytes
- Published SHA-256: `0c92063c6838d9ad8af50aaefea9a166b5bb41a2bfa2bc6327d7db320849bc78`
- Source: the release's source repository. License: Apache-2.0, reproduced in `LICENSE.memo`.

The test setup verifies the checksum and preloads this binary only into its
ephemeral local Agave test validator. It does not fetch programs or deploy to a
public cluster.
