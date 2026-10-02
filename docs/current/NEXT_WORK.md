# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@d885e4a16d524f97ad465a73b5780f59bda9232e`
Status: S3 / WP5 C05A — TASK-627 MATERIALIZED / INTEGRATION GATE PENDING

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `project_docs/research/STATION-S3-R6-C8-REPOSITORY-EVIDENCE-AND-PROOF-MATRIX-01.md`
- `specs/tasks/TASK-627-STATION-S3-C05A-TOOL-ACTIVE-CONTEXT.md`

## Fresh-main / predecessor truth

Fresh main is `d885e4a16d524f97ad465a73b5780f59bda9232e`, a documentation-only handoff commit whose parent is the reconciled C04 closure state. TASK-615/C01, TASK-616/C02, TASK-617/C03 and TASK-618/C04 remain CLOSED / PROVEN. Their proofs are inherited only where implementation owners/contracts and preconditions remain unchanged.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/orchestration-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## C05 fresh-main census

The repository has no authoritative reusable Tool abstraction. Existing `EditorShell` is domain-neutral layout-only chrome and explicitly leaves graph, selection, command, persistence and business authority with callers. C05 research identifies the smallest reusable Tool invariant as stable Tool identity + participant-role contract + active-context routing, with commands/capabilities separately identified and owner-revalidated. Concrete Component Editor, Window/View Editor, Workflow Studio and other domain surfaces are not promoted to grammar authority.

Historical `project_docs/tasks/TASK-619..626` already occupy those task ids from M2. To avoid task-id collision/stale references, this rolling-wave C05 tranche is TASK-627.

## Materialized tranche

TASK-627 is C05A only: stable Tool identity, explicit participant-role compatibility and deterministic active-context command/target qualification. It must not execute commands, infer authority from visibility/focus/enabled state, mutate lower-layer composition/interaction owners, or introduce persistence/restoration/AppManifest/Core/business semantics.

Allowed product path is new `packages/station-tool/**` plus focused `tests/product/station-s3-c05*.test.ts`; task/NEXT_WORK documentation is allowed. `max_files: 6`. Existing `packages/station-interaction/**`, `packages/station-composition/**`, `packages/station-shell/**`, `packages/ui-core/**`, `apps/station/**`, Core, app-runtime, provider/runtime/deploy are forbidden for this tranche.

Restoration, multi-view consequence propagation, retry/compensation, failure/recovery presentation and extension seams remain explicit C05 carried gaps for later rolling-wave materialization; they are not silently claimed by C05A.

## Acceptance / proof obligations

All new C05A obligations are `unproven-gap` until Construction evidence exists. Required delta proof: Tool identity survives active-context changes; participant-role incompatibility/ambiguity rejects before mutation; active context deterministically qualifies the same command identity/target contract without domain-name branching; participant/view/component identity remains stable; active context never becomes command/business authority. Lower-layer command currentness, `availability != authority`, result non-strengthening and C01-C04 proofs are inherited only under unchanged preconditions.

## Gates / blockers

Construction is NOT yet eligible from this branch. This materialization must first be integrated against fresh main and revalidated. Any need for >6 files, mutation of a forbidden owner, executable command authority, persistence/restoration, AppManifest/C06, provider/runtime/deploy, Core/business authority, C10/Studio or AI/MCP is STOP/rematerialize.

## Handoff :50

Predecessor truth: `main@d885e4a16d524f97ad465a73b5780f59bda9232e` -> branch `planning/station-s3-wp5-c05a-materialization` -> TASK-627 C05A materialization.
Authorization: documentation/materialization only until integrated; no C05 product mutation before integration.
Allowed after integration: TASK-627 contract only, within `packages/station-tool/**`, focused C05 product proof and bounded operational docs, <=6 files.
Forbidden: existing composition/interaction/shell/ui-core owners, apps/station, Core/business authority, AppManifest/C06, provider/runtime/deploy, restoration/multi-view/retry/compensation, C10/Studio, AI/MCP.
Next action: run exact-head materialization gates, reconcile any bounded documentary/contract failure only, integrate the materialization if GREEN, revalidate resulting fresh main, then Construction may implement only the smallest TASK-627 delta.
