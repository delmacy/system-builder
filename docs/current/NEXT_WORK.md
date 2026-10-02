# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@5aedbe43edeb8c0ff2c00721051b90c053fdd6d8`
Status: S3 / WP3 C03 — TASK-617 CONSTRUCTION / EXACT-HEAD GATES PENDING

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `project_docs/research/STATION-S3-R3-C4-EXIT-PROOF-MATRIX-01.md`
- `specs/tasks/TASK-617-STATION-S3-C03-COMMAND-CURRENTNESS-RESULT-PROJECTION.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Fresh-main / predecessor truth

PR #979 merged as `main@5aedbe43edeb8c0ff2c00721051b90c053fdd6d8`, formally integrating TASK-617 materialization. TASK-616/C02 and TASK-615/C01 remain CLOSED / PROVEN.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/composition-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## TASK-617 Construction delta

Branch `sprint/station-s3-wp3-c03-construction-a` starts exactly from fresh main. The bounded delta adds only Station-local owner-qualified command projection vocabulary in `packages/station-interaction/types.ts` plus focused product proof in `tests/product/station-interaction.test.ts`. Existing `PresentationCommandRegistry` remains the owner of presentation-command identity and invocation-time availability revalidation; no registry/Core/AppManifest/runtime mutation was required.

Projection carries explicit `ownerRef`, `targetRef`, `currentness`, optional owner result classification, and optional explicit retry/compensation affordances. It does not derive target from focus/selection, does not convert presentation availability into business authorization, does not collapse accepted/partial/unknown/stale into effective success, and leaves retry/compensation absent unless owner-supplied.

## Test Review / Hardening

- duplicate identity hidden by relocation: inherited existing semantic-id/duplicate-id proofs; unchanged preconditions;
- TOCTOU availability: inherited invocation-time revalidation proof; unchanged registry;
- focus/selection treated as target: new projection accepts owner target directly and has no interaction-context input;
- result strengthening: focused proof preserves `partial`, `accepted`, `stale`/`unknown` currentness as supplied;
- inferred retry/compensation: focused proof verifies affordances absent by default and preserved only when explicit;
- CoreCommandIntent executable: inherited fail-closed registry proof; registry unchanged.

These are implementation-level proofs only until exact-head repository gates pass.

## QA Coverage / Evidence Review

Focused proof is present for the new projection contract and predecessor proofs are reused only where implementation/preconditions are unchanged. Exact-head `lint`, `typecheck`, product tests, architecture and repository verification remain UNPROVEN-GAP until CI executes on the final head. Human product acceptance remains separate. No C04+ obligation is claimed.

## Gates / blockers

TASK-617 remains open. Required next action is exact-head CI and bounded correction only if a concrete TASK-617 failure appears. The branch currently contains multiple mechanical commits because the repository write interface commits per file; repository policy requiring one authoritative Construction commit must be normalized before merge. Do not treat this as closure evidence.

C04+, AppManifest/C06, provider/runtime/deploy, Core/business authority, universal result/retry/compensation engines and C10/Studio remain ineligible.

## Handoff

Branch: `sprint/station-s3-wp3-c03-construction-a`.
TASK: TASK-617 only.
Truth base: `main@5aedbe43edeb8c0ff2c00721051b90c053fdd6d8`.
Files changed: `packages/station-interaction/types.ts`, `tests/product/station-interaction.test.ts`, `docs/current/NEXT_WORK.md`.
Proof status: focused C03 behavior proof authored; exact-head repository gates UNPROVEN-GAP.
Blockers: exact-head CI pending; normalize multiple mechanical commits to one authoritative TASK commit before merge.
Next eligible work: open/validate the bounded TASK-617 PR, collect exact-head gates, correct only proven bounded failures, normalize commit shape, then close/merge only when all required evidence is green. C04 remains ineligible.
