# P10-TLS-SERVER-IDENTITY-01 — Positive TLS Server-Identity Verification

Status: COMMITTED / MATERIALIZED (manifest + TASK specs) / NOT_YET_CONSTRUCTED
Base: `e9f1b4d` (main reconstruído após PR #212; revalidated after real Sprint 1 merge)
Branch: `sprint/P10-TLS-SERVER-IDENTITY-01`
Package: `P10-PACKAGE-01`
Milestone: M10

## Sprint Goal

Add positive PostgreSQL TLS server-identity verification to the shared transport (`packages/postgres`) and render the same behavior into the autonomous Runtime entrypoint (`packages/runtime-core/postgres-state.ts`): `verify-ca` / `verify-full` sslmode modes with chain-trust and, for `verify-full`, hostname binding; deterministic fail-closed diagnostics; no silent downgrade; and no CA/credential material in durable Release/Deployment evidence. This closes `TD-P8-02` under ADR-0015 while preserving the existing `disable | prefer | require` contract (compatibility before replacement, invariant 5).

## Predecessor gate

SATISFIED.

- `P10-PRODUCTION-SECRETRESOLVER-01` (Sprint 1, TASK-128/129/130) **merged** through PR #201 at `4301936` (Deterministic CI run `32136056276` PASS on closure head `a1e0ed6`).
- `TD-P8-02` is **unblocked**: **ADR-0015 accepted by a human** through PR #206 (`docs/adr/ADR-0015-tls-server-identity-verification.md`, Status: Accepted). The ADR explicitly scopes and authorizes this construction Sprint.
- **Revalidated after the real Sprint 1 merge** from freshly reconstructed `main` (`e9f1b4d`, after PR #212): this Sprint remains the sole eligible COMMITTED successor; TASK-131/132/133 are `ready` and validate.
- No remaining blocker, ADR, L3/L4, destructive-migration or security-weakening gate blocks this Sprint boundary.

## Committed TASK set (dependency order)

1. TASK-131 — `P10-TLS-TRANSPORT-IDENTITY-MODES` (`ready`) — extend the transport `sslmode` set with `verify-ca`/`verify-full`, deterministic parse/validation of positive modes and CA source, chain-trust and hostname binding, fail-closed diagnostics.
2. TASK-132 — `P10-TLS-IDENTITY-FAILCLOSED-SAFETY` (`ready`) — prove fail-closed negative cases: missing/untrusted CA, hostname mismatch, unknown/malformed positive modes, no silent downgrade, no credential/CA leakage.
3. TASK-133 — `P10-TLS-RUNTIME-POSITIVE-E2E` (`ready`) — render the same positive verification into the autonomous Runtime entrypoint and prove the rendered-Runtime E2E plus an authenticated (SCRAM) positive-verification E2E.

## Growing integration proof expected at exit

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> durable authority A -> production SecretResolver resolves symbolic secret bindings -> managed Runtime process starts with resolved ephemeral values -> no resolved value in durable Release/Deployment evidence -> Runtime continuity with Builder/Observe unavailable -> shared Transport and rendered Runtime perform positive PostgreSQL TLS server-identity verification (verify-ca/verify-full, fail-closed) -> authenticated SCRAM positive-verification E2E`

## Final validation

Repository-wide `npm run verify` through GitHub Deterministic CI on the Sprint closure head. Positive-verification E2E proof stays inside `tests/product/**` (test-local TLS termination with a generated CA/certificate so no `.github/**` or `tooling/**` change is required and the ADR scope boundary holds).

## Stop / escalation

- Stop if implementation requires changing canonical contracts, the SecretResolver no-leakage invariants, the `disable | prefer | require` parsing contract, migration defaults, or any other package boundary (ADR-0015 scope).
- Stop before adding an external TLS/npm dependency or changing `.github/**` / `tooling/**`.
- Do not start the package Integration & Technical Debt Review; it remains FORECAST until this Sprint merges and the package revalidation gate passes.
