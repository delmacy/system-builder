# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-09
Reconciled base: `main@d05454e115fb7845773950895b08e9647f360904`
Status: WP1-A/B/C INTEGRATED; WP1-D/TASK-639 CONSTRUCTION IN PROGRESS (not integrated)

> Single live execution pointer under `docs/DOCUMENT_AUTHORITY.md`. Verify fresh main, branches, PRs and CI before every action. Recorded SHAs are historical clues.

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active TASK: `specs/tasks/TASK-639-STATION-S4-WP1D-GRID-SPAN-VALIDATION.md`.

The admitted dependency sequence is A -> B -> C -> D -> E -> F -> G -> H. C10 remains DEFERRED/UNPROVEN.

## Reconciled handoff

WP1-A/TASK-636, WP1-B/TASK-637 and WP1-C/TASK-638 are integrated. WP1-C construction PR #1020 was merged by squash at `60b93c4d5e2d390e7ea251d68347c779d9a8e219`. Inspector typed intents are proposals, not applied mutations.

WP1-D planning PR #1021 merged by squash on 2026-10-09 at `d05454e115fb7845773950895b08e9647f360904`. TASK-639 construction proceeds on `sprint/station-s4-wp1d-task-639-grid-span`. No construction integration is implied by this pointer. The implementation must consume typed set-span/set-placement intents, recheck session/selection/revision/currentness, validate registry compatibility and hierarchy, and apply only a validated Station-owned draft edit with immutable accepted/rejected result.

## Next executable action

1. Revalidate fresh main, TASK-639 branch/PR and current CI; resolve any actual blocker before adding scope.
2. Complete TASK-639 within its five-file allowlist and one authoritative implementation commit. Prove positive, negative, adversarial, recovery and predecessor-integration cases.
3. Run focused test and `npm run verify` on exact implementation HEAD, then verify current merge-candidate CI and semantic/architecture review before integrating.
4. Only after WP1-D is IMPLEMENTED, PROVEN **and** INTEGRATED, materialize WP1-E Preview Convergence from fresh main.

## Invariants and evidence

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; single Station-owned draft; Layers/Inspector/Preview are projections. C0-C9 preserved, C10 DEFERRED. No Core/business/command, durable persistence, provider/runtime/deploy/secrets or arbitrary HTML/CSS/pixel authoring. Keyboard/focus/accessibility N/A to this contract-only tranche, mandatory for introduced UI. IMPLEMENTED != PROVEN != INTEGRATED; exact-head CI != current merge-candidate CI.

Handoff after every action: WP/sprint/TASK, fresh main/HEAD, PR, tests/gates, real blocker and next executable action.
