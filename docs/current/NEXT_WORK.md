# Next Work — Generation 2 / G2-WP-11 Construction B

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01..G2-WP-10 are canonically closed. G2-WP-11 Planning & Materialization is integrated, and Construction A / `G2-WBS-17`, materialized as `TASK-555 -> TASK-556 -> TASK-557 -> TASK-558`, is fully completed and integrated.

## Integrated progress
TASK-555 is completed and integrated via PR #813. TASK-556 is completed and integrated via PR #815. TASK-557 is completed and integrated via PR #818. TASK-558 is completed and integrated via PR #820.

## Current executable gate
G2-WBS-18 / Construction B is materialized as `TASK-559 -> TASK-560 -> TASK-561 -> TASK-562`. Only TASK-559 is READY. TASK-560..562 remain blocked by their explicit predecessors.

TASK-559 establishes ACK != effect/convergence. TASK-560 preserves authority across operator surfaces. TASK-561 requires reconnect reconciliation before retry/convergence claims. TASK-562 closes integrated Product Proof for auditable manual/emergency paths. No concrete UI, persistence, provider SDK, workflow mutation, WP-12/13 or Production Readiness claim is included.

Preserve `Signal != ConfirmedConflict`; signal != condition != alert != incident; telemetry gaps/currentness remain visible; stale/PARTIAL/UNKNOWN evidence cannot strengthen state; provenance, population and Local/Station/Fleet qualification remain explicit.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, source-of-truth/coexistence/residual drainage, replaceable provider qualification, Local/Station/Fleet semantics and Product Proof distinct from Production Readiness. Do not absorb G2-WP-12/13, autonomous-agent authority, direct side-effect authority, unmaterialized DEFER/DO_NOT_BUILD findings, or unrelated product scope.
