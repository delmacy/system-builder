# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-04
Repository truth base: `main@87b315c4900961ed229fa344f5de3cb30b51516c`
Status: S3 / WP8 — TASK-634 C3 COLLECTION PROOF FOLLOW-UP CONSTRUCTION AUTHORIZED

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

## TASK-634 materialization admission
TASK-634 materialization PR #1005 is CLOSED / MERGED / INTEGRATED. Its final exact head `c475d5a115c9074edfd5a9cfac311f2173906b5b`, based on `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`, had current GREEN Deterministic CI, Heavy Product Tests, Automation Handoff State Machine and distinct Merge Candidate CI before integration. Merge commit: `87b315c4900961ed229fa344f5de3cb30b51516c`. Duplicate PR #1004 remains CLOSED UNMERGED / SUPERSEDED and confers no authority.

Construction for TASK-634 is now authorized from fresh main after this pointer reconciliation. Materialization GREEN admits Construction only; it is not executable C3 proof.

## TASK-634 Construction scope
Implement only the smallest in-memory Station-owned Collection contract/behavior needed to prove stable keyed membership/topology/canonical semantic order and an explicit visual-order projection distinct from semantic order.

Allowed owner: `packages/station-composition/**`; focused proof: `tests/product/station-s3-c03*.test.ts`; TASK-634 and this pointer only as bounded memory; `max_files: 6`. Reuse C02 currentness only under unchanged preconditions.

Acceptance/proof obligations: stable identity independent of placement/presentation/action; deterministic keyed membership/topology/order; duplicate/unknown/malformed/stale/ambiguous references fail closed before canonical mutation with zero partial mutation; visual projection/reorder demonstrably distinct from canonical semantic order; any explicitly admitted semantic reorder deterministic and distinguishable from visual-only order; focused positive/adversarial executable evidence; Test Review rejects rendered-order-only false positives and authority expansion; QA Coverage maps exact evidence to C3 Collection/Ticketing representative obligation without claiming a Ticketing product.

## Boundaries
Preserve C0→C10; identity != placement != presentation != action; ComponentRegistry != AppManifest; semantic patterns remain above primitives; composition remains span/discrete; Station remains presentation/composition-oriented with no Core/business/command authority.

Forbidden: Ticketing product; generic DnD/reparent/tree editor; UI/DOM ownership; Core/business/command authority; durable persistence/storage; provider/runtime/deploy/secrets; station-application/station-tool/provider-boundary mutation; unrelated C01–C07 owner mutation; C07B/C08; C10/Studio; AI/MCP; research or materialization CI promoted into missing semantic proof.

## Handoff to Construction :10
Predecessor truth: C01–C07 admitted slices remain PROVEN/INTEGRATED under unchanged preconditions; TASK-633 Gate B remains closure-blocked only by C3 Collection/Ticketing `unproven-gap`; C10 remains deferred/unproven.

Materialization truth: PR #1005 exact head `c475d5a115c9074edfd5a9cfac311f2173906b5b` GREEN and INTEGRATED as merge `87b315c4900961ed229fa344f5de3cb30b51516c`; duplicate #1004 is superseded and non-authoritative.

Authorization: execute TASK-634 Construction only, from fresh main after this pointer commit. Do not materialize or execute a successor.

Next action: create the bounded TASK-634 Construction lane from fresh main; implement the minimum in-memory Collection behavior + focused executable proof within the allowed owner/file cap; then obtain its own exact-head/current repository verification and distinct merge-candidate evidence. After integration, perform TASK-634 Test Review/Hardening and QA Coverage/Evidence Review, then rerun/reconcile Gate B specifically for C3/Ticketing. Missing or stale evidence remains `unproven-gap`; no proof is inherited across changed preconditions.
