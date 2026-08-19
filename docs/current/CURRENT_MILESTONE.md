# Current Execution Milestone — M10 P10 Direction Selection & First Construction Sprint

## Goal

Close the production credentials blocker `TD-P4-05` via a production-grade, replaceable SecretResolver, and close `TD-P8-02` via positive TLS server-identity verification under the human-accepted ADR-0015. The first construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` is implemented, CI-validated and **merged** through PR #201; the second construction Sprint `P10-TLS-SERVER-IDENTITY-01` is **materialized as COMMITTED**.

## Integrated predecessor

`P10-PRODUCTION-SECRETRESOLVER-01` merged through PR #201 at `4301936` (Deterministic CI run `32136056276` PASS on closure head `a1e0ed6`), with `main` freshly reconstructed. `TD-P4-05` is closed.

## Direction selection (from integrated evidence)

Selected: **A — Production SecretResolver + TLS/server-identity hardening** (`TD-P4-05` + `TD-P8-02`).

- The P9 review ranked this HIGH security importance and `READY TO BE CONSIDERED`, naming it the principal production blocker.
- B (Observe publication, `TD-P7-03`/WBS 10.3.3) retained as MEDIUM forecast.
- C (milestone pivot, `TD-P9-01`/`TD-P9-02`) not assumed; requires explicit milestone re-scope.

## Governance escalation (resolved)

`TD-P8-02` (positive TLS identity/certificate verification; removing `rejectUnauthorized: false`) is an **L3/L4-adjacent security-policy change** and was escalated to an ADR. **ADR-0015 is accepted by a human** through PR #206 (`docs/adr/ADR-0015-tls-server-identity-verification.md`, Status: Accepted), which authorizes Construction Sprint 2 bounded to the PostgreSQL transport and its rendered Runtime counterpart and their tests/docs.

## Constructed first construction Sprint

`P10-PRODUCTION-SECRETRESOLVER-01` — PASS, **MERGED** through PR #201 at `4301936`.
- Goal: production replaceable SecretResolver providers, fail-closed, no value leakage, managed-Runtime integration proof (`TD-P4-05`, L2/L3).
- Committed TASKs: TASK-128 (providers `d39d1fb`), TASK-129 (fail-closed/no-leakage `f153e8d`), TASK-130 (managed-Runtime E2E `a1e0ed6`).
- Branch: `sprint/P10-PRODUCTION-SECRETRESOLVER-01`; PR #201 merged.

## Materialized second construction Sprint

`P10-TLS-SERVER-IDENTITY-01` — COMMITTED (manifest + TASK-131/132/133 specs, status `ready`), not yet constructed.
- Goal: positive PostgreSQL TLS server-identity verification (`verify-ca`/`verify-full`) in the shared transport and the rendered autonomous Runtime, fail-closed, closing `TD-P8-02` under ADR-0015.
- Committed TASKs: TASK-131 (transport identity modes), TASK-132 (fail-closed safety), TASK-133 (rendered-Runtime + authenticated positive-verification E2E).
- Branch: `sprint/P10-TLS-SERVER-IDENTITY-01` (declared; not created by this planning transition).
- **Revalidated** after the real Sprint 1 merge from freshly reconstructed `main` `e9f1b4d` (after PR #212): remains the sole eligible COMMITTED successor; TASK-131/132/133 validate.
- **Re-confirmed** on the post-credential-fix re-dispatch from freshly reconstructed `main` `e9f1b4d`: Sprint 2 remains the sole eligible COMMITTED successor; no blocker or explicit human gate is present.
- **Revalidated** on this fresh re-dispatch from freshly reconstructed `main` `e9f1b4d`: Sprint 2 remains the sole eligible COMMITTED successor; no blocker or explicit human gate is present.

## Current gate

**Eligible successor Sprint materialized.** `TD-P8-02` is unblocked (ADR-0015 accepted by a human, PR #206). Construction Sprint 2 `P10-TLS-SERVER-IDENTITY-01` is **COMMITTED** and eligible under repository authority. It executes on `sprint/P10-TLS-SERVER-IDENTITY-01` with TASK-131/132/133 in dependency order. The package Integration & Technical Debt Review stays FORECAST until Sprint 2 merges.
