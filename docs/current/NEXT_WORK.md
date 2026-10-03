# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@d885e4a16d524f97ad465a73b5780f59bda9232e`
Status: S3 / WP5 C05 — TASK-619 MATERIALIZED / GATES PENDING

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `project_docs/research/STATION-S3-R6-C8-REPOSITORY-EVIDENCE-AND-PROOF-MATRIX-01.md`
- `specs/tasks/TASK-619-STATION-S3-C05-TOOL-ACTIVE-CONTEXT-RESTORATION.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Fresh-main / predecessor truth

Fresh main revalidated at `d885e4a16d524f97ad465a73b5780f59bda9232e`. PR #983 merged TASK-618/C04 from exact head `749a131e5c89ccef5dcfd241c4ed817e3c8d6717`; TASK-615/C01 through TASK-618/C04 are CLOSED / PROVEN. C05 was not yet materialized on that main.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/composition-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## C05 owner/reuse census and materialization

R6 evidence and fresh repository census confirm there is no canonical C8 Tool abstraction to reuse. `EditorShell` is domain-neutral layout-only chrome and leaves graph, selection, command, persistence and business authority with callers. Existing composition and interaction packages remain lower-layer owners and are read/reuse context only for C05; TASK-619 forbids mutating them.

TASK-619 materializes the smallest new Station-local Tool orchestration owner in `packages/station-tool/**`: stable Tool identity, declared participant refs/roles, deterministic active-context routing, restoration rebinding to currently admitted participant refs, and multi-view invalidation/refresh projection. Active context is not authorization or command target; restoration is not business/canonical recovery; multi-view projection is not duplicated state authority.

The TASK is bounded to 6 files, with product tests plus TASK/handoff. It explicitly forbids Core, station-app-runtime, apps/station, ui-core, station-interaction, station-composition, provider/runtime/deploy mutation and does not admit C06 AppManifest/Application lifecycle or C10 Studio.

## Test Review / Hardening

MATERIALIZED / UNPROVEN-GAP: challenge active-context-as-authority/target, focus/visibility-as-identity, stale restoration resurrection, duplicate/unknown participant refs, role ambiguity by array order, multi-view duplicated state, result strengthening, Tool-inferred retry/compensation and hidden domain branching. These are proof obligations, not PASS claims. Construction must implement behavior and the smallest adequate proof together.

## QA Coverage / Evidence Review

At materialization every C05 delta obligation is `unproven-gap`. C03 command/currentness and C04 identity/presentation evidence may be inherited only where owner and preconditions are unchanged. Exact-head evidence must be fresh on the Construction SHA; absence of evidence is never PASS. Human acceptance remains separate from machine conformance.

## Gates / blockers

The Construction materialization exists on branch `planning/station-s3-wp5-c05-materialization`, but it is not Construction authority until its PR gates pass and it is integrated into fresh main. No C05 product mutation is eligible before that integration.

C06 AppManifest/Application lifecycle, provider/runtime/deploy, Core/business authority and C10/Studio remain ineligible.

## Handoff :10

Branch: `planning/station-s3-wp5-c05-materialization`.
Base: `main@d885e4a16d524f97ad465a73b5780f59bda9232e`.
TASK: TASK-619 — C05 Tool Active Context / Restoration / Multi-view.
Files changed: `specs/tasks/TASK-619-STATION-S3-C05-TOOL-ACTIVE-CONTEXT-RESTORATION.md`, `docs/current/NEXT_WORK.md`; documentation/materialization only, no product mutation.
Proof state: C05 delta obligations UNPROVEN-GAP; Test Review/Hardening and QA Coverage/Evidence obligations explicitly materialized.
Blocker: materialization PR exact-head gates/integration. If the branch has multiple mechanical commits, normalize to one authoritative materialization commit before merge.
Next eligible work: after this materialization is green and integrated, revalidate fresh main and execute only TASK-619 behavior + smallest adequate focused proof within its allowed paths/max_files. Do not absorb C06/AppManifest, Core/business authority, provider/runtime/deploy or C10/Studio.
