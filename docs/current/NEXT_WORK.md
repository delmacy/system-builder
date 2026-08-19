# Next Work — P10 Sprint 2 (TLS/server-identity) Materialized as COMMITTED

The repository is authoritative. Do not use chat history as technical authority.

## Just integrated

`P10-PRODUCTION-SECRETRESOLVER-01` (1st construction Sprint of P10-PACKAGE-01, direction A) **MERGED** through PR #201 at `4301936`.

Branch: `sprint/P10-PRODUCTION-SECRETRESOLVER-01`
Head: `a1e0ed6` (Deterministic CI run `32136056276` PASS)
TASKs: TASK-128 `d39d1fb`, TASK-129 `f153e8d`, TASK-130 `a1e0ed6`.
Outcome: production SecretResolver gap `TD-P4-05` closed.

The `TD-P8-02` human/ADR gate is **satisfied**: **ADR-0015 accepted by a human** through PR #206 (`docs/adr/ADR-0015-tls-server-identity-verification.md`, Status: Accepted).

## Committed successor Sprint

`P10-TLS-SERVER-IDENTITY-01` — Construction Sprint 2 of `P10-PACKAGE-01`, **COMMITTED** (manifest + TASK-131/132/133 specs, status `ready`). Not yet constructed.

- Goal: positive PostgreSQL TLS server-identity verification (`verify-ca`/`verify-full`) in the shared transport and the rendered autonomous Runtime, fail-closed, closing `TD-P8-02` under ADR-0015.
- TASK dependency order: TASK-131 (transport identity modes) -> TASK-132 (fail-closed safety) -> TASK-133 (rendered-Runtime + authenticated positive-verification E2E).
- Branch: `sprint/P10-TLS-SERVER-IDENTITY-01` (declared declaratively; created only when the Sprint executes).
- **Revalidated** after the real Sprint 1 merge from freshly reconstructed `main` `e9f1b4d` (after PR #212); TASK-131/132/133 validate (`check:tasks`: 134 specs).
- **Re-confirmed** on the post-credential-fix re-dispatch from freshly reconstructed `main` `e9f1b4d`: Sprint 2 remains the sole eligible COMMITTED successor; TASK-131/132/133 validate (`check:tasks`: 134 specs).

## Required action

Execute the committed Sprint `P10-TLS-SERVER-IDENTITY-01` on its own branch (`sprint/P10-TLS-SERVER-IDENTITY-01`), one authoritative commit per TASK in dependency order, running each TASK's declared validations and repository-wide `npm run verify` before closure. Positive-verification E2E proof stays inside `tests/product/**` (test-local TLS termination with a generated CA/certificate) so the ADR-0015 scope boundary holds.

## Boundary

- Do not construct TLS product code inside this planning transition; Sprint execution happens later on `sprint/P10-TLS-SERVER-IDENTITY-01`.
- Do not start the package Integration & Technical Debt Review; it stays FORECAST until Sprint 2 merges.
- Do not modify `.github/**` / `tooling/**`.
- Do not merge anything.
