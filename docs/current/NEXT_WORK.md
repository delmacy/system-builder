# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@6d82e1f2f9394ac019d07d91ab56db76a1281815`
Status: S3 / WP2 C02 CLOSED-PROVEN — WP3 TASK-617 C03 MATERIALIZED / CONSTRUCTION NEXT

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md`
- `specs/tasks/TASK-616-STATION-S3-C02-CANONICAL-REVISION-PROJECTIONS.md`
- `specs/tasks/TASK-617-STATION-S3-C03-COMMAND-PROJECTION-CURRENTNESS.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Fresh-main / predecessor truth

Fresh `main@6d82e1f2f9394ac019d07d91ab56db76a1281815` reconciles TASK-616/C02 closure after merged PR #975. TASK-616/C02 and TASK-615/C01 are CLOSED / PROVEN. No open C03 PR existed at census time.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/composition-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## C03 owner/reuse census

Fresh-main code confirms `packages/station-interaction` already owns `PresentationCommandRegistry`, semantic presentation-command IDs, explicit `StationInteractionContext` (focus/selection/surface), and invocation-time availability revalidation. `CoreCommandIntent` is explicitly non-executable and leaves authority with Core/domain owners. Existing shell command surfaces are projection consumers and are not eligible mutation owners in the first C03 lot.

Research/owner evidence requires accepted/ack != effect and forbids strengthening partial/unknown/stale/reconcile-required into success. No bounded Station-local executable owner for generic result/retry/compensation semantics was identified that should be expanded in this first lot; those obligations remain UNPROVEN-GAP rather than being invented.

## WP3 / TASK-617 materialization

TASK-617 is the smallest dependency-safe C03 lot: immutable presentation-command projection/currentness only. It may preserve semantic command identity and explicit presentation-context qualifiers and prove that stale rendered availability cannot dispatch because registry invocation revalidates current context.

Allowed product path: `packages/station-interaction/**`; focused product tests plus TASK/NEXT_WORK documentation are bounded by the task. `max_files: 6`.

Forbidden: `packages/station-shell/**`, `apps/station/**`, runtime-core/deploy/compiler/station-app-runtime/ui-core, executable Core intents, business authorization, generic accepted/effective result engines, retry/compensation, C04+, AppManifest/provider/runtime/deploy, C10/Studio and AI/MCP.

## Acceptance / proof obligations for :10

- same registered semantic command projected twice retains one command identity;
- projection carries explicit Station interaction qualifier without feature-name hardcode;
- rendered availability is advisory, never dispatch authority;
- stale rendered availability is rejected when invocation-time context becomes unavailable, before execute;
- CoreCommandIntent remains non-executable and no Core/business authorization is inferred;
- no owner result state is strengthened and no result/retry/compensation engine is invented;
- inherited C01/C02 and existing registry proofs are reused where preconditions are unchanged;
- focused SHA-scoped evidence plus repository gates are required for closure; missing evidence remains `unproven-gap`.

## Blockers and next eligible work

No bounded blocker prevents Construction after exact-head revalidation. Construction :10 is authorized for TASK-617 only, from the materialization branch/head, after confirming fresh main has not semantically invalidated the census. If implementation needs a forbidden path, >6 files, shell/UI changes, Core/business authority, executable Core intents, or result/retry/compensation invention, STOP and rematerialize instead of expanding scope.

## Handoff

Materialization branch: `planning/station-s3-c03-materialization`.
Predecessor truth: `main@6d82e1f2f9394ac019d07d91ab56db76a1281815`.
Closed work: TASK-615/C01 and TASK-616/C02, PROVEN.
Active/next work: TASK-617 / WP3 C03 Command Projection Currentness, materialized and authorized for bounded Construction after exact-head/fresh-main revalidation.
Allowed/forbidden and `max_files: 6` are authoritative in TASK-617.
Next action: Construction :10 revalidates branch exact head + fresh main, implements only the smallest TASK-617 delta, runs focused proof and declared gates, and leaves broader C03 result semantics UNPROVEN-GAP unless separately rematerialized by rolling-wave.
