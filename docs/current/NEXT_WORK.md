# Next Work — Generation 2 / post-G2-WP-10 successor reconciliation

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessor
G2-WP-01..G2-WP-10 are canonically closed. G2-WP-10 Documentation & Closure integrated on `main@e93a548b14c183dbf48657d925fdf133a8096c6f` via PR #804 after its Package Integration & Review PASS. G2-WBS-15 Construction A and G2-WBS-16 Construction B (`TASK-551 -> TASK-552 -> TASK-553 -> TASK-554`) are accepted; the Construction B fresh-main Sprint Review is PASS; no bounded product rework and no Construction C remain for WP-10.

## Current mandatory gate
Revalidate the authoritative Generation 2 planning revision in `research/g2-capability-pipeline` — including `RESEARCH_PIPELINE_STATE.json`, WBS decomposition/dependency graph, Work Package Design and Ready for Worker Handoff — against this fresh main and promote **only the first dependency-safe successor Work Package** authorized by that DAG.

Do not select a successor by numerical adjacency and do not execute or materialize successor product behavior until that exact planning authority establishes READY ownership/scope/dependencies. If the dependency-safe successor is G2-WP-11, its Planning & Materialization is the next executable gate only after that promotion is explicit.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, replaceable provider qualification, coexistence/manual paths and Product Proof distinct from Production Readiness. Do not implement autonomous-agent authority, direct side effects, concrete UI, persistence/DB, runtime-core, vendor SDKs/providers/adapters, successor WP behavior, Production Readiness or unmaterialized DEFER/DO_NOT_BUILD findings before the successor is explicitly promoted by repository authority.
