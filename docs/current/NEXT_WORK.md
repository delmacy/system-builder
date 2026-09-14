# Next Work — G2-WP-10 / Construction B

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WBS-15 Construction A (`TASK-547 -> TASK-548 -> TASK-549 -> TASK-550`) is integrated and accepted after fresh-main Sprint Review and bounded TASK-548 authority-invariant repair. TASK-551 is integrated on fresh `main`.

## Materialized chain
G2-WBS-16 Construction B is materialized as `TASK-551 -> TASK-552 -> TASK-553 -> TASK-554`.

Only **TASK-552 — Define replaceable model provider binding qualification** is READY. TASK-553..554 are blocked by explicit predecessors.

## Current mandatory gate
Execute only TASK-552 from fresh `main`. Preserve replaceable provider/model binding identity and revision, qualification evidence/currentness and provider ownership by reference. Stale or UNKNOWN qualification must not become supported/current, and candidate production remains non-authoritative.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not pre-implement concrete vendor SDKs/providers/adapters, credentials/secrets, autonomous-agent authority, persistence/DB, runtime-core, apps-wide redesign, WP-11+, Production Readiness or unmaterialized DEFER/DO_NOT_BUILD findings.
