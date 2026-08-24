# Scale a Pay.sh Proxy to 1M Payments/sec

[Pay.sh](https://pay.sh) turns any HTTP endpoint into a pay-per-request API using stablecoin payment vouchers — no accounts, API keys, or subscriptions. This template provisions a single Ubuntu host as a hardened, throughput-tuned Pay proxy and shows how one machine verifies on the order of **one million payment vouchers per second**. It packages the deployment, the tuning, and the load-testing recipe from the "Sunburst" scaling work.

> This is a public sandbox reference implementation, not an audited production deployment. The default paywall is devnet-only. Treat the Pay gateway as an internet-facing attack surface, review [SECURITY.md](https://github.com/solana-foundation/templates/blob/main/community/pay-high-throughput-proxy/SECURITY.md), and complete your own security, legal, and compliance review before handling real traffic or funds.

## Why a Pay proxy scales

The trick is that **the hot request path never touches the chain.** A client opens a payment channel once (an on-chain transaction), then pays for each request with an ed25519-signed _voucher_ carrying a monotonically increasing cumulative amount. The gateway's per-request work is:

1. verify one ed25519 signature, and
2. atomically advance that channel's cumulative watermark in an in-process, sharded map (an older voucher can never move it backwards).

No transaction is submitted per request. A background lifecycle worker settles each channel's _latest_ watermark on-chain every few minutes and batches those settlements into size-bounded Solana transactions. So the RPC sees channel opens, periodic settlement batches, and idle closes — never request-rate traffic.

```text
plain curl ───GET──▶ Pay proxy ──402──▶ payment required (no work done)
paid client ──GET──▶ Pay proxy ──────▶ verify ed25519 voucher (off-chain)
   signed voucher       Pingora            advance cumulative watermark ──▶ 200
   (cumulative $)     thread-per-core      settle latest watermark on-chain
                                            every ~5 min, batched
```

Because verification is stateless CPU work, throughput scales with cores, and horizontally with more gateways.

## Measured results

On one 128-core AVX-512 host (`GET /api/v1/compute`, `routing: respond` so only the payment gate is measured, driven by separate load generators over TLS):

| Path                                  | Single-host throughput | Notes                                                                |
| ------------------------------------- | ---------------------: | -------------------------------------------------------------------- |
| Payment path (verify ed25519 voucher) |  **~1.09M vouchers/s** | 0 failures; held ≥1M/s every second across a 10-minute sustained run |
| Null path (no voucher verify)         |           ~2.47M req/s | the raw HTTP/2 + gateway plumbing ceiling                            |

The gap between the two rows is the cost of one ed25519 signature verification per request — that is the single-host ceiling. The generator side stayed ~50% idle at 1.09M/s, confirming the wall is the gateway's verification CPU, not the client. To go further: **compact/batch signature verification** raises the per-host ceiling toward the null path, and **horizontal scaling adds gateways roughly linearly** (~10 hosts ≈ ~11M/s).

> Provisioning this host does not by itself prove a million vouchers per second. That claim requires independent off-host generators, a real NIC, a sustained window, zero failed vouchers, and server-side CPU/RSS evidence. This template gives you the tuned host and the tooling to reproduce it.

## What makes it fast

The playbook builds and configures the gateway for throughput deliberately:

- **AVX-512 IFMA ed25519** — Pay is built with a pinned nightly Rust toolchain and `-C target-cpu=native`, selecting curve25519-dalek's IFMA backend (`vpmadd52` instructions). This is the largest single crypto speedup and the playbook verifies the instructions are present in the binary.
- **Thread-per-core Pingora** — the gateway terminates TLS and serves each connection on a dedicated worker, so persistent HTTP/2 connections spread across all cores with no shared-connection contention.
- **Sharded channel store** — voucher acceptance is an atomic cumulative compare-and-swap in a sharded in-memory map, not a global lock, so watermark updates don't serialize.
- **Socket + FD tuning** — larger accept backlogs, wider socket buffers, a high `nofile` limit, and a wide ephemeral-port range (see [`99-pay-proxy.conf.j2`](https://github.com/solana-foundation/templates/blob/main/community/pay-high-throughput-proxy/deploy/ansible/templates/99-pay-proxy.conf.j2)) keep connection bursts from being dropped.

## Prerequisites

- Ansible Core 2.14+ and [`just`](https://github.com/casey/just) on your machine.
- An x86_64 **Ubuntu** host reachable over SSH with passwordless sudo.
- At least **128 logical CPUs** and an **AVX-512 IFMA-capable** CPU to reproduce the recorded throughput. (Lower `pay_min_logical_cpus` or set `pay_require_avx512_ifma=false` for a smaller functional deployment that will not match the numbers above.)
- TCP port 443 open to the host.
- A devnet Solana RPC URL, a recipient address, a funded operator keypair, and a session secret.

## Deploy

```bash
brew install ansible just   # or your platform's equivalent
pnpm create solana-dapp@latest my-pay-proxy --template pay-high-throughput-proxy
cd my-pay-proxy
just setup
```

`just setup` creates two git-ignored files. Edit both:

- `deploy/ansible/inventory.yml` — your host, SSH user, and its literal public IP.
- `deploy/ansible/proxy.env` — `PAY_RPC_URL`, `PAY_PAYMENT_RECIPIENT`, `PAY_OPERATOR_KEYPAIR`, and `PAY_SESSION_SECRET`.

Preview, then provision:

```bash
just check
just deploy
```

The playbook builds Pay from a pinned commit with the AVX-512 toolchain, creates a private benchmark CA and an IP-SAN server certificate (TLS terminates directly in Pingora), applies the socket tuning, installs a hardened `pay-proxy` systemd unit, and fails the run if the endpoint does not return HTTP 402. It refuses a moving `pay_git_ref`, a non-Ubuntu target, and — by default — an undersized or non-AVX-512 host.

## Verify

The CA public certificate is fetched to `deploy/ansible/artifacts/<host>-ca.crt` for your load generators. Confirm the paid route challenges before payment:

```bash
just gate-test <public-ip>       # must print HTTP/2 402
just verify-build                # must print a non-zero vpmadd52 count
just logs
```

## Reproduce the throughput

The playbook installs the `pay-bench` load generator beside `pay` at `/opt/pay/bin/pay-bench`. **Run generators from separate, authorized hosts** — never on the proxy, or their CPU and traffic taint the server measurement. Point the generator config's `run.tls_ca_cert_env` at the fetched CA path (do not disable certificate verification), and drive the closed-loop workload against `https://<public-ip>/api/v1/compute`. See `rust/bench/README.md` in [solana-foundation/pay](https://github.com/solana-foundation/pay) for fixtures, safety caps, and the workload. `just loadtest-hint` prints a reminder.

## Set prices and add an upstream

The default paywall ([`deploy/ansible/files/paywall.yml`](https://github.com/solana-foundation/templates/blob/main/community/pay-high-throughput-proxy/deploy/ansible/files/paywall.yml)) uses `routing: respond` — it verifies the voucher and returns 200 without an upstream, so you measure the gate alone. To gate a real service, change `routing` to proxy your upstream and set the per-request price under `metering`:

```yaml
endpoints:
  - method: GET
    path: 'api/v1/compute'
    resource: 'compute'
    metering:
      schemes: [mpp-session]
      dimensions:
        - direction: usage
          unit: requests
          scale: 1
          tiers:
            - price_usd: 0.000001 # price per request
```

Establish the gate-only baseline first, then add upstream work and re-measure.

## Scaling past one host

- **Single host** tops out at the ed25519 verification ceiling (~1.09M/s here). Compact or batched signature verification moves that toward the null-path ceiling.
- **Horizontally**, gateways are independent and stateless on the hot path, so throughput adds roughly linearly. Put your channel-open and settlement RPC behind adequate capacity and run N proxies behind a load balancer for N× the rate.

## Security notice and operator responsibility

- The default paywall is devnet-only. The public listener has no rate limits, request-size limits, quotas, or DDoS protection beyond the payment challenge itself. Put a hardened HTTPS edge with abuse controls in front of it before real traffic.
- The playbook pins the Pay commit and Rust toolchain, verifies the checked-out revision and the AVX-512 instructions, verifies the rustup bootstrap checksum, uses a non-login service account, and applies systemd sandboxing. These controls reduce risk; they do not prove the deployment is secure.
- The private benchmark CA is for controlled load generators. Replace it with your normal certificate process for a public service. The CA private key stays root-only on the host.
- The gateway root publishes provider availability, endpoint paths, and configured prices. The diagnostic web UI is disabled by the service unit.
- Restarting the process can forfeit vouchers accepted but not yet settled (the default store is in-memory). For a restart-safe deployment, build Pay with a durable session store and benchmark that shape separately, because a durable write then joins the request path.
- No private key, seed phrase, API token, or wallet file belongs in this repository. `proxy.env` is git-ignored.
- You are responsible for host patching, SSH access, network policy, TLS at the edge, abuse controls, monitoring, key custody, and any legal, tax, sanctions, or regulatory obligations.

This template is provided as-is under the [MIT License](https://github.com/solana-foundation/templates/blob/main/community/pay-high-throughput-proxy/LICENSE), without warranties. It has not received a formal security audit. Read the full [security policy and deployment checklist](https://github.com/solana-foundation/templates/blob/main/community/pay-high-throughput-proxy/SECURITY.md).

## Pay resources

- [Pay.sh](https://pay.sh) — Browse pay-per-use APIs and see how Pay.sh works.
- [Getting started](https://pay.sh/docs/building-with-pay/getting-started) — Gate an API with Pay.sh and make its first paid request.
- [Deployment overview](https://pay.sh/docs/building-with-pay/deployment/overview) — Compare hosted Pay.sh deployment paths.
