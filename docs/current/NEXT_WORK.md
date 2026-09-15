# Next Work — G2-WP-10 / Package Integration & Review

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WBS-15 Construction A is integrated and accepted. G2-WBS-16 Construction B (`TASK-551 -> TASK-552 -> TASK-553 -> TASK-554`) is fully integrated and its fresh-main Sprint Review is PASS on `main@5e079e61d8893125a87aa0ac637691656166d584`.

## Current mandatory gate
Execute only **G2-WP-10 Package Integration & Review** on fresh main. Reconcile the accepted Construction A and Construction B evidence against package ownership, the materialized WBS/DAG, compatibility/currentness/non-authority invariants, source-of-truth/coexistence boundaries and residual risks. Any bounded finding inside the already-materialized G2-WP-10 slice must be repaired before package closure.

After a PASS Package Integration & Review revision integrates, proceed only to G2-WP-10 Documentation & Closure. Do not absorb WP-11+ or successor implementation during package review.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, replaceable provider qualification, coexistence/manual paths and Product Proof distinct from Production Readiness. Do not implement autonomous-agent authority, direct side effects, concrete UI, persistence/DB, runtime-core, vendor SDKs/providers/adapters, WP-11+, Production Readiness or unmaterialized DEFER/DO_NOT_BUILD findings.
