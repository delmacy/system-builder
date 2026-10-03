# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@ce0ee654ac71df796a82c4315fb26af0e1c5f197`
Status: S3 / WP5 C05B — TASK-628 MATERIALIZATION PENDING INTEGRATION

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-628-STATION-S3-C05B-TOOL-RESTORATION-REBIND.md`

## Predecessor truth
TASK-627/C05A is CLOSED / PROVEN. PR #986 was normalized to one authoritative Construction commit, exact-head and merge-candidate gates were GREEN, and the product delta was integrated. Fresh main advanced through repository-status reconciliation and the closure handoff to `ce0ee654ac71df796a82c4315fb26af0e1c5f197`.

C01-C04 and C05A proofs remain inherited only where owner contracts and preconditions remain unchanged. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## Rolling-wave next tranche
The S3 construction plan orders C05 as Tool active-context/restoration/multi-view before C06 Application manifest/lifecycle isolation. With active-context proven, the smallest dependency-safe next tranche is TASK-628/C05B restoration/rebind only. Multi-view consequence propagation remains deferred to a later separately materialized C05 tranche.

TASK-628 may add/adjust only `packages/station-tool/**`, focused `tests/product/station-s3-c05*.test.ts`, its task spec and this bounded operational pointer, within `max_files: 6`. It must restore/rebind Station-owned Tool context by stable declared identity, deterministically and idempotently, and fail closed with zero canonical Tool-state mutation for unknown/stale/ambiguous/duplicate/incompatible references.

Restoration is presentation/orchestration state only. It may not own persistence/storage transport, execute or authorize commands, mutate interaction/composition/shell/ui-core/apps, introduce AppManifest/C06, provider/runtime/deploy, Core/business authority, C10/Studio, or AI/MCP.

## Proof obligations
New C05B obligations begin UNPROVEN-GAP: deterministic valid rebind; idempotence; Tool/participant/view/component identity preservation; fail-closed stale/unknown/ambiguous/duplicate/incompatible refs; zero mutation on rejection; no authority strengthening. Accessibility is N/A unless Construction introduces a UI surface, in which case STOP/rematerialize rather than silently inherit UI proof.

## Handoff :50
Predecessor: `main@ce0ee654ac71df796a82c4315fb26af0e1c5f197`; TASK-627/C05A CLOSED/PROVEN.
Current tranche: TASK-628/C05B materialization only; no product mutation authorized until this materialization is exact-head GREEN and integrated.
Allowed: `packages/station-tool/**`, focused C05 product proof, TASK-628 spec, bounded NEXT_WORK; `max_files: 6`.
Forbidden: persistence/storage ownership; interaction/composition/shell/ui-core/apps mutation; executable command/business authority; AppManifest/C06; provider/runtime/deploy; multi-view consequence propagation; retry/compensation; failure/recovery presentation; extension seams; C10/Studio; AI/MCP.
Acceptance: deterministic/idempotent rebind by stable declared identity; fail closed before mutation for stale/unknown/ambiguous/duplicate/incompatible refs; identity preservation; no authority strengthening.
Next action for :10: revalidate fresh main/base/head and exact-head materialization gates. If and only if this materialization is GREEN and integrated, begin the smallest TASK-628 Construction delta. Otherwise resolve only the bounded blocker; do not start product or skip to C06.
