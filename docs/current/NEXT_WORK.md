# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@6e5ccb01588e7451881e6bc79a453aba0d653b6b` before this repository-memory handoff write
Status: S3 / WP6 C06A — TASK-630 MATERIALIZATION CLOSED / PROVEN / INTEGRATED; CONSTRUCTION ELIGIBLE, PRODUCT PROOF UNPROVEN

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-630-STATION-S3-C06A-APPLICATION-MANIFEST-INTEGRITY.md`

## Predecessor truth
TASK-627/C05A, TASK-628/C05B and TASK-629/C05C are CLOSED / PROVEN under unchanged owners/preconditions. Mandatory C05 Tool obligations are complete for active-context, restoration/rebind and multi-view convergence. Residual retry/compensation, failure/recovery presentation and extension seams remain explicit DEFER/UNPROVEN and are not promoted by inheritance. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## TASK-630 contract
C06A is only AppManifest identity/integrity plus Tool-contribution isolation. Allowed Construction after materialization integration: new `packages/station-application/**`; focused `tests/product/station-s3-c06*.test.ts`; bounded repository memory; `max_files: 6`. Forbidden: Core/business/command authority; mutation of station-tool/interaction/composition/shell/ui-core/apps/runtime; persistence/storage/save-reopen/version/currentness lifecycle; provider/runtime/deploy/secrets; C07; C10/Studio; AI/MCP; UI/DOM/accessibility behavior.

Acceptance/proof obligations remain: stable Application identity distinct from Tool and ComponentRegistry; deterministic/idempotent contribution admission and isolation; normalized duplicate/malformed/unknown/stale/ambiguous/incompatible refs fail closed before canonical mutation; zero partial mutation on rejection; unchanged C05 Tool semantics; no executable command/authorization/business-result/currentness/provider/persistence authority; focused positive/adversarial proof; exact-head and distinct current merge-candidate GREEN before Construction integration/closure.

## Test Review / Hardening
Materialization explicitly requires positive composition plus adversarial normalized identity collision, duplicate/unknown/stale/ambiguous/incompatible Tool refs, order dependence, overwrite/impersonation attempts and zero partial mutation on rejection. Recovery beyond deterministic fail-closed admission is outside C06A. Accessibility is `not-applicable` because this tranche admits no UI/DOM/focus/keyboard behavior; crossing that boundary requires STOP/rematerialize.

## QA Coverage / Evidence Review
Normalized materialization PR #993 exact head `88358f03533c77f2e50f08e7e9f70f9dbd2d90d6` was one authoritative commit / two files, planning-only. Current evidence on that exact head: Deterministic CI GREEN, Heavy Product Tests GREEN, Automation Handoff State Machine GREEN, Merge Candidate CI GREEN. The distinct merge-candidate observed immediately before integration was `feff302a5424a5cfff0b399b2b45f97980d6036e`; its checkout/identity assertion and deterministic repository verification passed. Static C0→C10 / Decision Graph conformance passed and accessibility remained N/A. PR #993 merged without head movement as merge commit `6e5ccb01588e7451881e6bc79a453aba0d653b6b`, whose parents are prior main `4f0424e9c721e7608fbe0e1f38678bce2dd4208f` and exact head `88358f03533c77f2e50f08e7e9f70f9dbd2d90d6`.

## Handoff :50 — Hardening & Sprint Closure Lead
Closure/merge status: TASK-630 materialization CLOSED / PROVEN / INTEGRATED. Product C06A is NOT CLOSED: its Construction proof obligations remain UNPROVEN until implementation and focused proof execute.

Fresh-main before this handoff-only repository-memory write: `6e5ccb01588e7451881e6bc79a453aba0d653b6b`. Revalidate `main` after this write and use that resulting SHA as the Construction base.

Evidence: exact-head `88358f03533c77f2e50f08e7e9f70f9dbd2d90d6` GREEN; distinct merge-candidate `feff302a5424a5cfff0b399b2b45f97980d6036e` GREEN; one-commit/two-file planning shape; no product mutation; no review/conformance blocker remaining; merge commit `6e5ccb01588e7451881e6bc79a453aba0d653b6b`.

Residual debt: C05 retry/compensation, failure/recovery presentation and extension seams remain DEFER/UNPROVEN. C06A product semantics remain UNPROVEN until Construction proves Application identity/integrity and contribution isolation. Persistence/save-reopen/version/currentness, C06B/C07+, Core/business/command authority, provider/runtime/deploy and C10/Studio remain NOT ELIGIBLE / DEFER.

Next dependency-safe Work Package/TASK: execute only TASK-630 C06A Construction on revalidated fresh main. Bound it to new `packages/station-application/**`, focused `tests/product/station-s3-c06*.test.ts`, TASK/NEXT_WORK memory, `max_files: 6`. Prove stable Application identity distinct from Tool/ComponentRegistry; deterministic/idempotent Tool-contribution admission/isolation; normalized duplicate/malformed/unknown/stale/ambiguous/incompatible refs fail closed before canonical mutation; zero partial mutation on rejection; unchanged C05 Tool semantics; and no executable command/authorization/business-result/currentness/provider/persistence authority. Any scope or owner crossing requires STOP/rematerialize. Construction closure later requires its own current exact-head GREEN and distinct current merge-candidate GREEN; materialization evidence must not be reused as product proof.
