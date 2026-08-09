# Security

## Read this before deployment

This project is a sandbox reference implementation. It demonstrates payment-gated inference; it is not an audited production platform, custody system, authentication layer, or substitute for a security review.

The software is provided as-is under the [MIT License](LICENSE), without warranty of any kind. No configuration can eliminate all risk. You are responsible for reviewing, testing, operating, and monitoring your deployment and for meeting any legal, privacy, tax, sanctions, licensing, or regulatory obligations. Nothing in this project is legal, security, tax, or compliance advice.

## Default security boundary

The included Ubuntu playbook:

- binds `llama-server` to `127.0.0.1:8081`;
- binds the Pay.sh sandbox gateway publicly on port `8080`;
- exposes SSH and the gateway through UFW;
- disables the gateway's diagnostic web UI;
- runs llama.cpp and Pay.sh as separate non-login system users;
- stores Pay.sh state under `/var/lib/pay-gateway` with private permissions;
- pins the reviewed llama.cpp tag to its commit;
- downloads the default GGUF from an immutable revision and verifies its SHA-256;
- verifies downloaded Pay.sh release archives against the published checksum;
- enables unattended Ubuntu security upgrades; and
- applies systemd filesystem, device, kernel, capability, namespace, and address-family restrictions.

These controls are defense in depth, not a security guarantee.

## Known limitations

- Sandbox tokens do not make a publicly reachable gateway safe. An attacker may still consume compute, probe endpoints, exploit dependencies, or exhaust memory, disk, bandwidth, and model context.
- The playbook does not configure TLS, a reverse proxy, request-size limits, rate limits, quotas, DDoS protection, intrusion detection, backups, or centralized monitoring.
- The public gateway root exposes provider availability, model names, and configured prices. The diagnostic web UI is disabled, but this metadata remains intentionally discoverable.
- The inference engine has no application-level authentication. Keep it on loopback.
- Prompts, responses, token usage, wallet metadata, and service logs may contain sensitive information. Define retention and access policies before handling user data.
- The host downloads software and model artifacts from third parties. Pins and checksums reduce supply-chain risk but do not establish trust in upstream code or model behavior.
- The optional `llamacpp_hf_repo` path delegates model selection and downloading to llama.cpp at runtime and cannot use this playbook's checksum verification. It is rejected unless you explicitly set `llamacpp_allow_unverified_hf_repo: true`.
- Models can produce unsafe, inaccurate, copyrighted, or policy-violating output. Payment gating does not provide model safety.
- Mainnet token metering is outside this template's tested scope. Do not remove `--sandbox` based only on this guide.

## Before handling real traffic or funds

- Put the gateway behind a hardened HTTPS edge. Do not expose port `8080` directly.
- Add authentication or an equivalent admission-control layer in addition to payment.
- Enforce request-body, context, concurrency, token, time, and spend limits.
- Restrict SSH at the cloud firewall to known source addresses and require key-based login.
- Patch the OS, Pay.sh, llama.cpp, and transitive dependencies on a defined schedule.
- Review every version, commit, model revision, checksum, and pricing change before deployment.
- Store production signing material in an approved secret manager or hardware-backed signer. Never place it in this repository, inventory, group variables, shell history, or logs.
- Add alerting for service restarts, repeated 402 failures, unusual inference volume, disk pressure, memory pressure, and settlement failures.
- Test restore, rollback, key revocation, incident response, and shutdown procedures.
- Obtain independent security and legal review appropriate to your users, jurisdictions, data, and transaction values.

## Public sandbox exposure

`pay_gateway_expose_publicly` defaults to `true`. This binds the gateway to `0.0.0.0` and opens the configured UFW port. The default is intentional so external clients can prove that unpaid inference receives `HTTP 402`; it is an explicit risk acceptance for sandbox testing, not a production-ready configuration.

Set it to `false` and change `pay_public_url` to the loopback URL when public reachability is unnecessary. Then connect through an SSH tunnel:

```bash
just tunnel ubuntu@<host>
```

Then use <http://127.0.0.1:8080/>.

## Reporting a vulnerability

Do not include private keys, wallet files, prompts, user data, or live host credentials in a report.

- Report Pay.sh vulnerabilities through the security reporting channel for [solana-foundation/pay](https://github.com/solana-foundation/pay/security).
- Report llama.cpp vulnerabilities through the security reporting channel for [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp/security).
- Report template-specific issues through the security reporting channel for [solana-foundation/templates](https://github.com/solana-foundation/templates/security).

If private reporting is unavailable, open a minimal issue that asks maintainers for a secure contact method without disclosing exploit details.
