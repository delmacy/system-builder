# Current Execution Milestone — M10 P10 Direction Selection & First Construction Sprint

## Goal

Close the production credentials blocker `TD-P4-05` via a production-grade, replaceable SecretResolver, and register the TLS/server-identity hardening (`TD-P8-02`) as an ADR-gated escalation. The first construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` is implemented, CI-validated and **merged** through PR #201.

## Integrated predecessor

`P10-PRODUCTION-SECRETRESOLVER-01` merged through PR #201 at `4301936` (Deterministic CI run `32136056276` PASS on closure head `a1e0ed6`), with `main` freshly reconstructed. `TD-P4-05` is closed.

## Direction selection (from integrated evidence)

Selected: **A — Production SecretResolver + TLS/server-identity hardening** (`TD-P4-05` + `TD-P8-02`).

- The P9 review ranked this HIGH security importance and `READY TO BE CONSIDERED`, naming it the principal production blocker.
- B (Observe publication, `TD-P7-03`/WBS 10.3.3) retained as MEDIUM forecast.
- C (milestone pivot, `TD-P9-01`/`TD-P9-02`) not assumed; requires explicit milestone re-scope.

## Governance escalation

`TD-P8-02` (positive TLS identity/certificate verification; removing `rejectUnauthorized: false`) is an **L3/L4-adjacent security-policy change**. It is escalated to an ADR and must be accepted by a human before any TLS construction. It is NOT built inside a Sprint. Construction Sprint 2 remains FORECAST pending that ADR.

## Constructed first construction Sprint

`P10-PRODUCTION-SECRETRESOLVER-01` — PASS, **MERGED** through PR #201 at `4301936`.
- Goal: production replaceable SecretResolver providers, fail-closed, no value leakage, managed-Runtime integration proof (`TD-P4-05`, L2/L3).
- Committed TASKs: TASK-128 (providers `d39d1fb`), TASK-129 (fail-closed/no-leakage `f153e8d`), TASK-130 (managed-Runtime E2E `a1e0ed6`).
- Branch: `sprint/P10-PRODUCTION-SECRETRESOLVER-01`; PR #201 merged.

## Current gate / blocker

**BLOCKER:** Construction Sprint 2 (TLS/server-identity hardening) is the next forecast Sprint and requires the `TD-P8-02` ADR accepted by a human. **No such ADR is accepted in the repository** (no TLS/server-identity ADR exists under `docs/adr/`). This is an explicit human/ADR gate: Construction Sprint 2 stays FORECAST/BLOCKED and the package Integration & Technical Debt Review is not started. Do not promote, materialize or construct any TLS Sprint until that ADR is accepted.
