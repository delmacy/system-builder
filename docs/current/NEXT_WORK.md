# Next Work — G2-WP-10 / Package Integration & Review

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WBS-15 Construction A is integrated and accepted.

## Integrated chain
G2-WBS-16 Construction B (`TASK-551 -> TASK-552 -> TASK-553 -> TASK-554`) is fully integrated. Its fresh-main Sprint Review is integrated on `main@5e079e61d8893125a87aa0ac637691656166d584` with outcome PASS and no bounded product rework required.

## Current mandatory gate
Execute only **G2-WP-10 Package Integration & Review** on fresh main. Revalidate the package as an integrated whole against its materialized DAG, ownership and boundary contracts, including provenance/lineage, provider qualification, `AI inference != authority`, governed owner disposition, uncertainty/currentness non-strengthening, coexistence/manual paths, Local/Station/Fleet qualification where applicable, and Product Proof distinct from Production Readiness.

Any bounded finding inside the materialized G2-WP-10 package must be repaired before closure. After a PASS package review revision integrates, proceed only through fresh-main repository-memory reconciliation to the next package gate defined by the materialized DAG. Do not absorb WP-11+ or successor implementation during review.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, replaceable provider qualification, coexistence/manual paths and Product Proof distinct from Production Readiness. Do not implement autonomous-agent authority, direct side effects, concrete UI, persistence/DB, runtime-core, vendor SDKs/providers/adapters, WP-11+, Production Readiness or unmaterialized DEFER/DO_NOT_BUILD findings.
