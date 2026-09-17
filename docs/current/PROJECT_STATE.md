# Project State

Date: 2026-09-17

## Generation 2 — G2-WP-11 CONSTRUCTION B
G2-WP-01..G2-WP-10 are CANONICALLY CLOSED. G2-WP-11 Planning & Materialization is integrated. Construction A / `G2-WBS-17` (`TASK-555 -> TASK-556 -> TASK-557 -> TASK-558`) is fully integrated. Construction B / `G2-WBS-18` is materialized as `TASK-559 -> TASK-560 -> TASK-561 -> TASK-562`.

## Current commitment horizon
TASK-555..561 are COMPLETED and integrated. Only TASK-562 is READY.

TASK-559 establishes ACK != effect/convergence. TASK-560 preserves authority across operator surfaces. TASK-561 requires qualified reconnect reconciliation before retry or convergence claims. TASK-562 closes integrated Product Proof for auditable manual/emergency paths.

## Preserved truth
`Signal != ConfirmedConflict`; signal != condition != alert != incident. Telemetry gaps/currentness remain visible. Reconciliation evidence is population-qualified. Command/API/job ACK != converged effect. Emergency/manual operator paths preserve authority/evidence and reconnect reconciliation. Projection != canonical truth; visibility != authority != action eligibility; AI inference != authority. Source, candidate and canonical identity/revision/currentness remain distinct. Stale/PARTIAL/UNKNOWN/INCONCLUSIVE/CONFLICTED remain explicit and non-strengthening. Local/Station/Fleet qualification is preserved. Product Proof remains distinct from Production Readiness.

## Package boundary
G2-WP-11 covers only its materialized WBS-17/WBS-18 observability, incident, reconciliation and operator-surface slices. Current execution is limited to the dependency-safe Construction B chain, with TASK-562 as the current executable gate. G2-WP-12/13, autonomous-agent authority, generic direct side-effect authority, Production Readiness claims and unmaterialized DEFER/DO_NOT_BUILD findings remain excluded.

## CI evidence truth
Each exact PR head requires its own Deterministic CI and Heavy Product Tests evidence, while Merge Candidate CI separately proves the synthetic candidate against current `main`. Workflow changes require Workflow Lint, and `npm run verify` includes `check:docs`.
