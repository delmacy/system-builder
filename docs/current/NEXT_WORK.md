# Next Work — G2-WP-10 / Construction B

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WBS-15 Construction A (`TASK-547 -> TASK-548 -> TASK-549 -> TASK-550`) is integrated and accepted after fresh-main Sprint Review and bounded TASK-548 authority-invariant repair.

## Materialized chain
G2-WBS-16 Construction B is materialized as `TASK-551 -> TASK-552 -> TASK-553 -> TASK-554`.

TASK-551 — Establish AI workspace and provenance contracts — is integrated. Only **TASK-552 — Define replaceable model provider binding qualification** is READY. TASK-553..554 remain blocked by explicit predecessors.

## Current mandatory gate
After this reconciliation revision integrates, execute only TASK-552 from the resulting fresh `main`. Preserve provider/model replaceability, explicit binding identity/revision/currentness and inspectable qualification evidence without transferring provider ownership or authority into G2-WP-10.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not implement concrete vendor SDKs/providers/adapters, credentials, autonomous-agent authority, persistence/DB, runtime-core, apps-wide redesign, WP-11+, Production Readiness or unmaterialized DEFER/DO_NOT_BUILD findings.
