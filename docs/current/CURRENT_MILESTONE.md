# Current Execution Milestone — M10 P10 Direction Selection & First Construction Sprint

## Goal

Close the production credentials blocker `TD-P4-05` via a production-grade, replaceable SecretResolver, and register the TLS/server-identity hardening (`TD-P8-02`) as an ADR-gated escalation. The first construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` is implemented and promoted to human Sprint Review.

## Integrated predecessor

The P10 materialization merged through PR #200 at `d178445` (direction A selected + 1st construction Sprint manifest + TASK-128/129/130 specs), with `main` freshly reconstructed.

## Direction selection (from integrated evidence)

Selected: **A — Production SecretResolver + TLS/server-identity hardening** (`TD-P4-05` + `TD-P8-02`).

- The P9 review ranked this HIGH security importance and `READY TO BE CONSIDERED`, naming it the principal production blocker.
- B (Observe publication, `TD-P7-03`/WBS 10.3.3) retained as MEDIUM forecast.
- C (milestone pivot, `TD-P9-01`/`TD-P9-02`) not assumed; requires explicit milestone re-scope.

## Governance escalation

`TD-P8-02` (positive TLS identity/certificate verification; removing `rejectUnauthorized: false`) is an **L3/L4-adjacent security-policy change**. It is escalated to an ADR and must be accepted by a human before any TLS construction. It is NOT built inside a Sprint. Construction Sprint 2 remains FORECAST pending that ADR.

## Constructed first construction Sprint

`P10-PRODUCTION-SECRETRESOLVER-01` — PASS (head `a1e0ed6`, Deterministic CI run `32136056276`).
- Goal: production replaceable SecretResolver providers, fail-closed, no value leakage, managed-Runtime integration proof (`TD-P4-05`, L2/L3).
- Committed TASKs: TASK-128 (providers `d39d1fb`), TASK-129 (fail-closed/no-leakage `f153e8d`), TASK-130 (managed-Runtime E2E `a1e0ed6`).
- Branch: `sprint/P10-PRODUCTION-SECRETRESOLVER-01`; PR #201 promoted to human Sprint Review.

## Current gate

The 1st construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` is promoted to human Sprint Review via PR #201 after Deterministic CI PASS. Merge and any TLS construction are human decisions; do not merge automatically. Construction Sprint 2 (TLS) stays FORECAST pending the `TD-P8-02` ADR.
