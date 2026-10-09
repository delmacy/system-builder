# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-08
Reconciled base: `main@60b93c4d5e2d390e7ea251d68347c779d9a8e219`
Status: WP1-A/B/C INTEGRATED; WP1-D/TASK-639 MATERIALIZED FOR CONSTRUCTION (after planning merge)

> Single live execution pointer under `docs/DOCUMENT_AUTHORITY.md`. Every worker must verify fresh main, branches/PRs and CI; recorded SHAs are historical clues, never permission to skip checks.

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active successor: `specs/tasks/TASK-639-STATION-S4-WP1D-GRID-SPAN-VALIDATION.md`.

The admitted dependency sequence is A -> B -> C -> D -> E -> F -> G -> H. C10 remains DEFERRED/UNPROVEN.

## Reconciled handoff

WP1-A/TASK-636 and WP1-B/TASK-637 are integrated; do not reopen without regression.
WP1-C/TASK-638 planning PR #1019 integrated at `fa67eeff3955df4b748a9e79429ba703d0165234`. Construction PR #1020 was merged by squash on 2026-10-08 at `60b93c4d5e2d390e7ea251d68347c779d9a8e219`. The Inspector is a read-only projection; its typed intents are **proposals**, not applied mutations.

WP1-D/TASK-639 is the next dependency-safe lot. Its planning materialization must integrate before construction. It adds validated, fail-closed application of set-span/set-placement to the existing Station-owned draft, with exact session/selection/revision binding, registry compatibility, cycle checks and explicit accepted/rejected result. No UI, Preview, save/discard, Core/business or persistence authority.

## Next executable action

1. Check whether TASK-639 planning branch/PR has already been integrated. If open, review its bounded task spec and this pointer, then integrate only when eligible. If integrated, do not duplicate it.
2. From fresh main, implement TASK-639 in a separate Sprint branch with one authoritative TASK commit, respecting the five-file allowlist and forbidden paths.
3. Prove positive, negative, adversarial, recovery and predecessor-integration cases; run focused test and exact-head `npm run verify`; check current merge-candidate CI and review before merging.
4. Only after WP1-D is IMPLEMENTED, PROVEN **and** INTEGRATED, materialize WP1-E Preview Convergence.

## Invariants and evidence

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; single Station-owned draft; Layers/Inspector/Preview are projections. C0-C9 preserved, C10 DEFERRED. No Core/business/command, durable persistence, provider/runtime/deploy/secrets or arbitrary HTML/CSS/pixel authoring. Keyboard/focus/accessibility is N/A to the current contract-only tranche, mandatory for introduced UI. An implementation commit is not proof; an exact-head pass is not a current merge-candidate pass.

Handoff after every action: WP/sprint/TASK, fresh main/HEAD, PR, tests/gates, real blocker and next executable action.
