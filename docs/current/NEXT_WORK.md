# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@2bdd95b5c1e0812a64b17f63fc79b259ba38fb12`
Status: S3 / WP5 C05C — TASK-629 MATERIALIZATION / GATES REQUIRED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-629-STATION-S3-C05C-TOOL-MULTIVIEW-CONVERGENCE.md`

## Predecessor truth
TASK-627/C05A and TASK-628/C05B are CLOSED / PROVEN. PR #989 is merged and repository-memory closure is `main@2bdd95b5c1e0812a64b17f63fc79b259ba38fb12`. C01-C04 and C05A/C05B proofs remain inherited only where owner contracts and preconditions remain unchanged. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above primitives; discrete/span composition ownership; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## Remaining C05 census
The S3 QA profile for C8 Tool requires active-context routing, cross-surface convergence, restoration/multi-view. C05A proved active-context/routing; C05B proved restoration/rebind. The smallest remaining dependency-safe C05 obligation is multi-view convergence: multiple Tool views must remain projections of one canonical Tool context, with deterministic consequence propagation and no per-view semantic authority. Retry/compensation, failure/recovery presentation and extension seams remain residual debt/deferred and are not silently absorbed into C05C.

## Materialized tranche
TASK-629/C05C is materialized for Tool multi-view convergence only. Allowed owner is `packages/station-tool/**` plus focused `tests/product/station-s3-c05*.test.ts`, this TASK and this handoff; `max_files: 6`. Forbidden mutation remains Core, station-app-runtime, apps/station, shell, interaction, composition, ui-core, provider/runtime/deploy. C06/AppManifest remains dependency-blocked until C05C closure.

## Test Review / Hardening
Required adversarial review: divergent semantic state hidden behind superficially equal view labels; stale/unknown context bindings; duplicate normalized view refs; projection order dependence; accidental per-view active context; visible/focused/enabled/current presentation promoted into command/business authority. Accessibility is `not-applicable` for the materialized contract unless Construction introduces UI/DOM/focus/keyboard behavior; if so, rematerialize rather than silently expanding scope.

## QA Coverage / Evidence Review
Initial C05C delta status is `unproven-gap`: one-authority/many-view convergence, deterministic context-switch propagation, projection idempotence/identity preservation, malformed/stale/duplicate/incompatible fail-closed rejection, zero canonical mutation on rejection and no authority strengthening. C05A/C05B proofs are inherited as `proven` only under unchanged preconditions. Retry/compensation, failure/recovery presentation, extension seams and C06+ remain explicit `unproven-gap`/deferred rather than PASS.

## Handoff :10
Fresh main used for census/materialization: `2bdd95b5c1e0812a64b17f63fc79b259ba38fb12`.
Branch/PR: `planning/station-s3-wp5-c05c-materialization` / PR #991 (draft).
TASK: TASK-629 / C05C Tool Multi-view Convergence.
Files changed: `specs/tasks/TASK-629-STATION-S3-C05C-TOOL-MULTIVIEW-CONVERGENCE.md`, `docs/current/NEXT_WORK.md` only; zero product mutation; 2/6 files.
Proof state: Test Review/Hardening and QA Coverage/Evidence Review are materialized; all new C05C obligations remain `unproven-gap` until Construction evidence. Materialization exact-head and merge-candidate evidence are UNPROVEN until workflows publish.
Blockers: PR #991 must remain one authoritative TASK-629 commit, receive exact-head GREEN plus distinct merge-candidate GREEN, and be integrated before any product mutation.
Next eligible work: collect PR #991 materialization gates and resolve only bounded proven failures; after GREEN/integration, execute TASK-629 behavior + smallest focused proof within the declared six-file bound. C06/AppManifest, Core/business authority, provider/runtime/deploy and C10/Studio remain NOT ELIGIBLE / DEFER.
