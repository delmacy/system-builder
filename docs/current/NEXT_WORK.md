# Next Work — G2-WP-10 / Construction B

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WBS-15 Construction A (`TASK-547 -> TASK-548 -> TASK-549 -> TASK-550`) is integrated and accepted after fresh-main Sprint Review and bounded TASK-548 authority-invariant repair.

## Materialized chain
G2-WBS-16 Construction B is materialized as `TASK-551 -> TASK-552 -> TASK-553 -> TASK-554`.

TASK-551 and TASK-552 are integrated. Only **TASK-553 — Govern AI candidate generation and owner disposition** is READY after this reconciliation revision integrates. TASK-554 remains blocked by its explicit predecessor.

## Current mandatory gate
After this reconciliation revision integrates, execute only TASK-553 from the resulting fresh `main`. Preserve candidate identity/revision/provenance independently from canonical artifacts, attribute disposition to the governing human/canonical owner, keep UNKNOWN/conflict non-strengthening and preserve coexistence with non-AI/manual paths.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not implement autonomous-agent authority, direct side-effect execution, workflow ownership transfer, concrete UI, persistence/DB, runtime-core, vendor SDKs/providers/adapters, WP-11+, Production Readiness or unmaterialized DEFER/DO_NOT_BUILD findings.
