# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-04
Repository truth base: `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`
Status: S3 / WP8 — TASK-633 GATE B INTEGRATED / TASK-634 C3 COLLECTION PROOF FOLLOW-UP MATERIALIZATION PENDING GATES

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`
- `specs/tasks/TASK-633-STATION-S3-QA-COVERAGE-EVIDENCE-REVIEW.md`
- `project_docs/execution_planning/STATION-S3-TASK-633-GATE-B-COVERAGE-REVIEW-01.md`
- `specs/tasks/TASK-634-STATION-S3-C3-COLLECTION-PROOF-GAP.md`

## Predecessor truth
C01–C05 remain PROVEN under unchanged recorded preconditions. C06A/TASK-630, C06B/TASK-631 and C07A/TASK-632 are CLOSED / PROVEN / INTEGRATED. C10 remains deferred/unproven.

TASK-633 Gate B review PR #1003 is integrated. Gate B exact head `78a20f3c526e1aba1424b93be4607f590e7560f9` had current GREEN Deterministic CI, Heavy Product Tests, Automation Handoff and distinct Merge Candidate CI before merge. Its semantic result remains closure-blocking: C3 Collection and the Ticketing pressure case are `unproven-gap` because representative executable keyed membership/topology/order plus `visual order != semantic order` evidence is absent.

## BLOCKER-FIRST materialization
Only the smallest dependency-safe follow-up is admitted for materialization: TASK-634 C3 Collection Proof Gap. This is not a Ticketing product and does not authorize generic DnD/reparent behavior.

Materialization branch: `planning/station-s3-c3-collection-proof-followup`.
Materialization base: `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`.
TASK: `TASK-634-STATION-S3-C3-COLLECTION-PROOF-GAP.md`.
Allowed future Construction owner: `packages/station-composition/**`, focused `tests/product/station-s3-c03*.test.ts`, TASK-634 and this pointer; `max_files: 6`.

Construction is NOT yet authorized. The materialization must first obtain current exact-head repository verification and a distinct current Merge Candidate CI, integrate, and be reconciled from fresh main.

## Test Review / Hardening admission
TASK-634 requires challenge of identity/index coupling, rendered-order-only false positives, visual reorder silently mutating semantic order, duplicate/unknown/stale/ambiguous references, and partial mutation on rejection. Missing evidence remains `unproven-gap`.

## QA Coverage / Evidence Review admission
TASK-634 must account specifically for C3 keyed membership/topology/order and `visual order != semantic order`, reuse C02 currentness only under unchanged preconditions, and map the final exact evidence to the Ticketing representative obligation without claiming a Ticketing product or promoting unrelated grammar levels.

## Boundaries
Preserve C0→C10; identity != placement != presentation != action; ComponentRegistry != AppManifest; semantic patterns remain above primitives; composition remains span/discrete; Station remains presentation/composition-oriented with no Core/business/command authority. Forbidden remain provider/runtime/deploy/secrets, durable persistence/storage, Tool/Application owner mutation, C07B/C08 invention, C10/Studio and AI/MCP.

## Handoff
Branch: `planning/station-s3-c3-collection-proof-followup`.
Base: `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`.
TASK: TASK-634 materialization only.
Files changed by this materialization: `specs/tasks/TASK-634-STATION-S3-C3-COLLECTION-PROOF-GAP.md` and `docs/current/NEXT_WORK.md`.
Current blocker: obtain exact-head Deterministic/required repository gates plus a distinct Merge Candidate CI for the final materialization head. Do not implement product before integration and fresh-main reconciliation.
Next eligible work after materialization is GREEN and integrated: execute only the smallest TASK-634 in-memory Collection behavior + focused executable proof, then perform its Test Review/Hardening and QA Coverage/Evidence Review. After that evidence integrates, rerun/reconcile Gate B; do not infer C07B/C08/C10 work.
