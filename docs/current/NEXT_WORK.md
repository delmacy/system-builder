# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@88337cddfc7d87b50b0a422487974c8f9d40dd70`
Status: S3 / WP6 C06B — TASK-631 MATERIALIZED / INTEGRATION GATES PENDING / CONSTRUCTION BLOCKED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-631-STATION-S3-C06B-APPLICATION-LIFECYCLE-CURRENTNESS.md`

## Predecessor truth
TASK-627/C05A, TASK-628/C05B, TASK-629/C05C and TASK-630/C06A are CLOSED / PROVEN / INTEGRATED under unchanged owners/preconditions. C06A exact-head evidence belongs only to TASK-630 and is not inherited as proof of the C06B delta. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## Fresh-main census / rolling-wave decision
The authoritative dependency order places Application manifest/lifecycle isolation before C07 provider-independence. QA C9 requires AppManifest integrity, Tool-contribution isolation, save/reopen/version/currentness. C06A proved only manifest integrity/contribution isolation. Therefore the smallest mandatory successor is C06B Application lifecycle/currentness; C07 is not yet eligible.

## TASK-631 C06B materialization
Materialized only the residual Application-owned lifecycle/currentness tranche: deterministic in-memory save/snapshot→reopen round-trip, explicit version/revision currentness, stale lifecycle rejection and preservation of C06A integrity. Durable persistence/storage, migration, provider/runtime/deploy and business/command authority remain forbidden.

Allowed product after materialization integration: `packages/station-application/**`; focused proof: `tests/product/station-s3-c06*.test.ts`; bounded task/memory only; `max_files: 6`.

Acceptance/proof obligations: stable Application + version/revision identity; deterministic/idempotent snapshot/reopen round-trip; explicit currentness comparison; stale/unknown/malformed/ambiguous/incompatible refs fail closed before canonical mutation; zero partial mutation; unchanged C06A AppManifest/Tool-isolation semantics; no strengthening into command/business/persistence/provider/Core authority; exact-head and distinct current merge-candidate GREEN before closure.

Forbidden: `packages/core/**`, `packages/station-tool/**`, `packages/station-app-runtime/**`, `apps/station/**`, station shell/interaction/composition/ui-core, durable persistence/storage/database/filesystem ownership, provider/runtime/deploy/secrets, C07+, C10/Studio, AI/MCP, UI/DOM/accessibility.

## Handoff to Construction :10
Construction is BLOCKED until this materialization itself is exact-head/current, bounded, GREEN and integrated into fresh main. Next action: validate this branch/PR against `main@88337cdd...`, require materialization exact-head gates plus a distinct merge-candidate GREEN, integrate only if current, then reconcile NEXT_WORK on post-merge fresh main. Only after that is TASK-631 product mutation authorized. Do not materialize C07 concurrently.
