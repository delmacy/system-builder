# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-04
Repository truth base before this pointer reconciliation: `main@53bd0dc01c45323720d3f6eac7b3e67ff4ba188c`
Status: S3 / WP8 — TASK-634 INTEGRATED; GATE-B CLOSURE RE-ACCOUNTING REQUIRED

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

## Closure / merge status
TASK-634 Construction is CLOSED / PROVEN / INTEGRATED by PR #1006. Exact head: `bff9df643d67ebdeb0ba3971c0254c40e03397bd`; construction base: `c759a762e5b90945c4e896f0a58597f5641f01df`; merge commit: `438a272475a73bf9eff78958446e7dc1b09352d9`. The merge commit has parents `c759a762e5b90945c4e896f0a58597f5641f01df` and `bff9df643d67ebdeb0ba3971c0254c40e03397bd`.

Before merge, the exact head had GREEN Deterministic CI, Heavy Product Tests, Automation Handoff State Machine, Station Frontend Quality and Merge Candidate CI. Merge Candidate CI checked out/asserted the GitHub merge candidate and ran deterministic repository verification successfully. Exact-head identity and merge-candidate identity are distinct concepts; evidence from any predecessor head remains stale. The connector exposes the workflow head as the PR exact head, so this handoff does not invent an unobserved synthetic merge-candidate SHA.

## Semantic / architecture review
The integrated delta is exactly two product/proof files: `packages/station-composition/collection.ts` and `tests/product/station-s3-c03-collection.test.ts`, within TASK-634 allowed paths and below `max_files: 6`.

The contract is in-memory and Station-owned. Stable member keys are independent of placement/presentation/action. Canonical semantic order is explicit and separate from visual projection. Explicit semantic reorder is deterministic and revisioned while preserving keyed topology. Duplicate/unknown/malformed/stale inputs exercised by the focused proof fail closed without canonical partial mutation. Construction does not introduce Ticketing product semantics, generic DnD/reparent/tree editing, UI/DOM authority, persistence/storage, provider/runtime/deploy/secrets, Tool/Application mutation, Core/business/command authority, C07B/C08, C10/Studio or AI/MCP.

Accessibility: N/A for TASK-634 because no UI/DOM/focus/keyboard surface changed. Recovery beyond deterministic fail-closed/zero-mutation is not promoted to PROVEN.

## Repository memory reconciliation
`specs/tasks/TASK-634-STATION-S3-C3-COLLECTION-PROOF-GAP.md` has been reconciled to `completed` after integration. This pointer supersedes the stale pre-merge Construction authorization state.

## Residual debt / closure blocker
Do NOT close S3 solely because TASK-634 merged. TASK-633 Gate B previously marked C3 Collection/Ticketing representative coverage `unproven-gap`; TASK-634 supplies the missing executable C3 evidence, but Gate B must now be rerun/reconciled against fresh main to determine whether that gap is actually discharged and whether any other promoted C0→C9 proof obligation remains FAILED/UNPROVEN. C10 remains deferred/unproven by design and must not be pulled forward.

The repository-memory reconciliation commits after the product merge move `main`, so pre-reconciliation CI is evidence for the integrated TASK-634 product head, not exact-head evidence for any future closure/merge decision. Any future merge requires its own final exact-head GREEN and current distinct merge-candidate GREEN.

## Boundaries
Preserve C0→C10; identity != placement != presentation != action; ComponentRegistry != AppManifest; semantic patterns remain above primitives; composition remains span/discrete; Station remains presentation/composition-oriented with no Core/business/command authority.

Forbidden without separate admission/materialization: Ticketing product; generic DnD/reparent/tree editor; UI/DOM ownership; Core/business/command authority; durable persistence/storage; provider/runtime/deploy/secrets; unrelated owner mutation; C07B/C08 product work; C10/Studio; AI/MCP.

## Handoff :50
Closure status: S3 remains OPEN pending fresh Gate-B closure re-accounting. TASK-634 itself is CLOSED / PROVEN / INTEGRATED.

Evidence: PR #1006 exact head `bff9df643d67ebdeb0ba3971c0254c40e03397bd`; mandatory repository/product/handoff gates GREEN before merge; merge `438a272475a73bf9eff78958446e7dc1b09352d9`; bounded two-file product/proof delta; task catalog reconciled by `53bd0dc01c45323720d3f6eac7b3e67ff4ba188c`.

Residual debt: fresh Gate-B accounting must explicitly map TASK-634 evidence to C3 Collection and the Ticketing representative pressure case and recheck promoted C0→C9 obligations. Missing, stale or non-representative evidence remains `unproven-gap`.

Next dependency-safe Work Package/TASK: no new product TASK is authorized yet. Run the bounded TASK-633/Gate-B closure re-accounting on fresh main, documentation/evidence-only unless it discovers a concrete bounded proof gap. If a material gap remains, STOP and materialize only the smallest follow-up; otherwise reconcile S3 closure. Do not advance to C10 or invent C07B/C08 scope.
