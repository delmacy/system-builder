# P10-PACKAGE-01 — Planning Skeleton (FORECAST / NOT_MATERIALIZED)

Status: SKELETON / FORECAST / NOT_COMMITTED
Base SHA: `a559d1af5d97562c0537cfb257de7dd2de889c84` (P9 Integration & Technical Debt Review)
Milestone: M10

## Authority

This is a planning skeleton materialized by the P9 Integration & Technical Debt Review. It authorizes **no** construction Sprint, TASK or product implementation. It is a readiness candidate for fresh successor-package planning after the review merges.

## Why this package is being scoped

The P9 Integration & Technical Debt Review reclassified the principal production blockers:

- `TD-P4-05` — production SecretResolver providers absent;
- `TD-P8-02` — positive TLS identity/certificate verification not proven;
- `WBS 10.3.3` / `TD-P7-03` — DeploymentRecord publication to Observe/operations absent.

Each is production-gating but independently plan-able. P10 is the first successor-package candidate horizon and must be selected from integrated evidence after the review merge, not pre-committed here.

## Candidate directions

### Candidate A — Production SecretResolver + TLS/server-identity hardening
- Goal: replace symbolic secret-reference handling with production-safe resolution and positive PostgreSQL server identity/certificate verification.
- Carried drivers: `TD-P4-05`, `TD-P8-02`.
- Exit would prove: production-grade secret resolution with no value leakage + verified CA/server-identity TLS.
- Note: positive TLS verification (`rejectUnauthorized: false` removal) is an L3/L4-adjacent security policy change and must be escalated/ADR'd rather than invented inside a Sprint.

### Candidate B — Observe publication (WBS 10.3.3)
- Goal: publish DeploymentRecord/operation events to Observe/operations while preserving Runtime autonomy (ADR-0002).
- Carried drivers: `TD-P7-03`, `WBS 10.3.3`, `TD-P4-08` executor/source metadata.
- Medium priority; must remain optional to Runtime operation.

### Candidate C — Milestone pivot
- Goal: re-scope from Deploy-local single-host reference orchestration toward production-lite operation.
- Carried drivers: `TD-P9-01`/`TD-P9-02` supervision/fleet gap, milestone M10 definition.
- Requires explicit milestone re-scope and cannot be assumed; competing on leverage during fresh planning.

## Candidate selection gate

Selection of P10 direction and its construction Sprints happens only **after** the P9 Integration & Technical Debt Review merges to `main`, `main` is freshly reconstructed, and successor readiness is revalidated from repository truth. No candidate is committed by this skeleton.

## Non-commitment notice

This skeleton does not create, name, select or commit any P10 Sprint, branch, TASK or implementation.
