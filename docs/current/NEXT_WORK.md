# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@2921ecb1836da44f50f9cbf7982837cf10e72a9a`
Status: S3 / WP2 — TASK-616 C02 CONSTRUCTION A / VERIFICATION BLOCKED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`
- `specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md`
- `specs/tasks/TASK-616-STATION-S3-C02-CANONICAL-REVISION-PROJECTIONS.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor truth

TASK-615/C01 is CLOSED / PROVEN. Its admission/schema proofs are inherited because TASK-616 does not modify C01 contracts. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; span/discrete composition distinct from WindowGeometry; Station without Core/business authority; C10 Studio DEFER/UNPROVEN.

## Fresh-main census and materialization

Fresh main was revalidated at `2921ecb1836da44f50f9cbf7982837cf10e72a9a`. `packages/station-composition/draft-transaction.ts` already owns validated immutable base/draft mutation and preview snapshots, while presentation surfaces consume projections. TASK-616 materializes only the bounded C02 gap: one Station-owned canonical revision token plus projection-currentness/stale-write semantics, `max_files: 6`.

## Construction delta

Branch: `sprint/station-s3-wp2-construction-a`; PR #975.
Changed files remain exactly five:
- `packages/station-composition/canonical-revision.ts` — canonical Station composition revision owner, stale expected-revision rejection, generic projection snapshots/currentness;
- `packages/station-composition/index.ts` — export only;
- `tests/product/station-composition-canonical-revision.test.ts` — focused C02 delta proofs;
- `specs/tasks/TASK-616-STATION-S3-C02-CANONICAL-REVISION-PROJECTIONS.md` — bounded task/proof obligations;
- `docs/current/NEXT_WORK.md` — live handoff.

The product behavior remains: one validated state-changing mutation advances one revision; invalid/no-op mutation does not; projection labels are derived consumers carrying owner revision; stale expected revision rejects before mutation. No projection gets mutation authority. UI, `apps/station/**`, Core/runtime/deploy/compiler/station-app-runtime, AppManifest, C03+, provider semantics and C10/Studio remain forbidden.

## Test Review / Hardening

Static review covers off-by-one revision, invalid/no-op increments, stale-write escape, multi-projection convergence and accidental projection authority with focused tests. No bounded product defect was identified by the exact-head CI failure. Classification: focused behavior evidence **PROVEN by Heavy Product Tests / Station Frontend Quality on predecessor head `8abbad7635b57ced845f9fe0e4cc1b9463420aab`**, but closure remains blocked until all required gates pass on one normalized exact head.

## QA Coverage / Evidence Review

On predecessor exact head `8abbad7635b57ced845f9fe0e4cc1b9463420aab`: Heavy Product Tests PASS; Station Frontend Quality PASS; Automation Handoff State Machine PASS; Deterministic CI FAIL; Merge Candidate CI FAIL. Deterministic verification passed `lint` and `typecheck`, then failed in `test:unit` task-catalog loading before `test:product`, `check:tasks`, `check:architecture`, `check:docs` and `build` could complete.

Concrete cause: TASK-616 used non-canonical frontmatter `status: in_progress`; the task parser accepts only `draft | ready | running | verification | completed | blocked | failed | superseded`. This is a bounded task-document conformance defect, not a C02 product-behavior failure. TASK-616 is corrected to `status: verification`.

C01 evidence remains inherited / PROVEN with unchanged preconditions. Missing exact-head evidence is `unproven-gap`, never PASS. Human acceptance remains separate from machine conformance.

## Commit-shape normalization

Repository Sprint policy requires one distinct authoritative commit per TASK. The prior branch had six mechanical commits for this one TASK. Normalize the branch to one TASK-616 commit rooted directly on fresh-main `2921ecb1836da44f50f9cbf7982837cf10e72a9a`, preserving the same five-file bounded delta plus this status repair/handoff. The normalized exact head must be treated as new evidence identity; predecessor green gates are diagnostic/inherited evidence only, not closure gates for the new SHA.

## Blockers and next eligible work

TASK-616 only. After normalization, collect exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Frontend Quality and Automation Handoff State Machine. If a gate fails, repair only the concrete bounded failure inside TASK-616 allowed paths. If all required gates pass on the same normalized head, perform final Test Review/Hardening + QA Coverage/Evidence classification, mark TASK-616 completed, and close/merge PR #975 according to repository policy. Do not materialize C03 or another WP while TASK-616 is open.
