# Security

## Read this before deployment

This project is a sandbox reference implementation. It demonstrates a high-throughput payment gateway; it is not an audited production platform, custody system, authentication layer, or substitute for a security review.

The software is provided as-is under the [MIT License](LICENSE), without warranty of any kind. No configuration can eliminate all risk. You are responsible for reviewing, testing, operating, and monitoring your deployment and for meeting any legal, privacy, tax, sanctions, licensing, or regulatory obligations. Nothing in this project is legal, security, tax, or compliance advice.

## Default security boundary

The included Ubuntu playbook:

- builds Pay from a pinned commit and Rust toolchain and verifies the checked-out revision;
- verifies the rustup bootstrap binary against a pinned SHA-256;
- verifies the built binary contains the expected AVX-512 instructions;
- terminates TLS in the gateway using a private benchmark CA and an IP-SAN certificate;
- keeps the CA private key root-only and the server key readable only by the service group;
- runs the gateway as a non-login `pay-proxy` system user;
- disables the gateway's diagnostic web UI;
- installs socket/file-descriptor tuning under `/etc/sysctl.d`;
- applies systemd filesystem, capability, and namespace restrictions (only `CAP_NET_BIND_SERVICE`); and
- installs the secret environment file with mode 0640, group-readable only.

These controls are defense in depth, not a security guarantee.

## Known limitations

- The default paywall is **devnet-only** and uses test funds. Sandbox tokens do not make a publicly reachable gateway safe.
- The public listener has no rate limits, request-size limits, quotas, DDoS protection, intrusion detection, backups, or centralized monitoring beyond the payment challenge itself. An attacker can still probe endpoints, exploit dependencies, or exhaust CPU, memory, disk, and bandwidth.
- The private benchmark CA is intended for controlled load generators, not public clients. Replace it with your normal certificate process for a public service.
- The default session store is in-memory. A process restart can forfeit vouchers accepted but not yet settled. A durable store adds a write to the request path and must be benchmarked separately.
- The gateway root publishes endpoint paths, provider availability, and configured prices.
- The native build uses `-C target-cpu=native` and is not portable to older CPUs.

## Operator responsibilities

- Put a hardened HTTPS edge with abuse controls (WAF, rate limiting, request-size limits) in front of the gateway before real traffic.
- Keep `proxy.env`, operator keypairs, and the session secret out of version control. `proxy.env`, `inventory.yml`, and `artifacts/` are git-ignored.
- Patch the host, restrict SSH, set network policy, and monitor the service.
- Complete a threat review before handling real users or funds. Change the currency, `operator.network`, and RPC together when moving off devnet.

## Reporting

Report vulnerabilities in Pay.sh through the [solana-foundation/pay](https://github.com/solana-foundation/pay) security policy. For issues specific to this template, open an issue in [solana-foundation/templates](https://github.com/solana-foundation/templates).
