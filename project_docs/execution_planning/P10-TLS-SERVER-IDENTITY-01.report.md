# P10-TLS-SERVER-IDENTITY-01 — Sprint Report

Date: 2026-08-19
Status: PASS / OPEN (PR #<PR> pending) / IMPLEMENTED_ON_SPRINT_BRANCH

## Result

Sprint Goal: PASS.

Positive PostgreSQL TLS server-identity verification is now part of the shared transport (`packages/postgres`) and rendered into the autonomous Runtime entrypoint (`packages/runtime-core/postgres-state.ts`): `verify-ca` / `verify-full` sslmode modes with chain-trust and, for `verify-full`, hostname binding; deterministic fail-closed diagnostics; no silent downgrade; and no CA/credential material in durable Release/Deployment evidence. This closes `TD-P8-02` under the accepted ADR-0015 while preserving the existing `disable | prefer | require` contract (compatibility before replacement, invariant 5).

## Authoritative TASK commits

- TASK-131 `528c92e` — `feat(TASK-131): add positive TLS server-identity verification modes to the Postgres transport`.
- TASK-132 `36dbe3a` — `feat(TASK-132): prove TLS identity verification fails closed with deterministic safety`.
- TASK-133 `ae17052` — `feat(TASK-133): render positive TLS identity verification into the autonomous Runtime entrypoint`.

Each committed TASK has one authoritative commit in dependency order (131 -> 132 -> 133). Local validation of the non-live TASK suites passed (see Verification); the live Postgres E2E suites are validated objectively by GitHub Deterministic CI on the Sprint Review PR head.

## Scope / implementation

Additive, bounded to the transport, the Runtime rendering and product tests.

- `packages/postgres/index.ts`: extended `PostgresSslMode` with `verify-ca` / `verify-full`; `parsePostgresConnection` requires a `sslrootcert` CA source for positive modes (`POSTGRES_SSLMODE_CA_REQUIRED` when absent) and keeps rejecting unknown/malformed modes deterministically; the TLS handshake now performs positive server-identity verification with `rejectUnauthorized: true` and the trusted CA, binding the hostname for `verify-full` (`checkServerIdentity`) while `verify-ca` trusts the chain; deterministic diagnostics distinguish `TLS_HOSTNAME_MISMATCH` (`ERR_TLS_CERT_ALTNAME_INVALID`) from `TLS_CERT_UNTRUSTED`, and `TLS_CA_UNAVAILABLE` when the CA source cannot be read. `disable | prefer | require` behavior is unchanged.
- `packages/runtime-core/postgres-state.ts`: `renderPostgresRuntimeStateSupport` now renders the same positive-mode parsing, required-CA gate and verified TLS handshake (with hostname binding for `verify-full`) into the autonomous Runtime entrypoint so a deployed Runtime performs the same positive verification and reads CA configuration from its runtime environment (resolved by SecretResolver), never embedding CA/credential material in rendered artifacts.
- `tests/product/postgres-tls.test.ts` (TASK-131/132): deterministic parse/validation of positive modes, required-CA fail-closed, no-downgrade when the server refuses TLS, plus live chain-trust/hostname/untrusted-CA/CA-unavailable E2E against a test-local TLS-terminating proxy with a generated CA/certificate. 11 tests.
- `tests/product/postgres-tls-rendered-runtime-e2e.test.ts` (TASK-133): rendered autonomous Runtime performs `verify-full`/`verify-ca` positive verification with authenticated (SCRAM) sessions, fails closed on hostname mismatch and unavailable CA, and rejects a positive mode without a CA source. 5 tests.
- `tests/product/deploy-postgres.test.ts`: updated the unsupported-sslmode case to use a genuinely unknown mode and added the fail-closed `verify-full`-without-CA case at the Deploy boundary (`DEPLOY_POSTGRES_SSLMODE_CA_REQUIRED`).
- TASK specs updated to `status: verification`.
- No changes to `packages/contracts/**`, `packages/deploy/**`, `packages/release/**`, `packages/artifact-store/**`, `packages/compiler/**`, `apps/**`, `.github/**`, `tooling/**`, `package.json`, `package-lock.json`, or `docs/adr/**`.

## Integrated proof

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> durable authority A -> production SecretResolver resolves symbolic secret bindings -> managed Runtime process starts with resolved ephemeral values -> no resolved value in durable Release/Deployment evidence -> Runtime continuity with Builder/Observe unavailable -> shared Transport and rendered Runtime perform positive PostgreSQL TLS server-identity verification (verify-ca/verify-full, fail-closed) -> authenticated SCRAM positive-verification E2E`

## Verification

- Local lint: PASS. Local typecheck: PASS. Local `npm run test:unit`: 309 pass. Local focused TLS suites (non-live): `postgres-tls.test.ts` 4 pass / 7 skipped (live Postgres E2E require a provisioned database and are not claimed locally).
- Objective final validation: GitHub Deterministic CI `npm run verify` (Postgres provisioned) on the Sprint Review PR head — pending.

## Architecture / scope

PASS inside the package boundary.

- additive L2 transport/Runtime behavior behind the existing `sslmode` parsing contract and the canonical `PostgresConnection` shape (new optional `ca` field, non-breaking);
- positive verification is fail-closed and never downgrades to the lenient session;
- ADR-0015 scope honored: no canonical contract change, no external TLS/npm dependency, no `.github/**`/`tooling/**` change, no CA/credential material in durable evidence or rendered artifacts.

## Residual / next

- Merge this Sprint through its Sprint Review PR (Deterministic CI PASS required) before starting the package Integration & Technical Debt Review.
- Remaining carried debt: production traffic/fleet/infrastructure rollback, Observe publication and migration/fleet coordination (unchanged).

## Escalations / discoveries

None required this Sprint. No canonical contract, ADR/L4 boundary, or forbidden path was touched.