# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-09
Reconciled base: `main@44f22b4d0ccfa82dc95dbe230ac3731c2e9fd015`
Status: WP1-A/B/C/D INTEGRATED; WP1-E/TASK-640 MATERIALIZED FOR CONSTRUCTION (after planning integration)

> Single live execution pointer under `docs/DOCUMENT_AUTHORITY.md`. Revalidate fresh main, branches, PRs and CI before each action; historical SHAs are clues, not authority.

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active successor: `specs/tasks/TASK-640-STATION-S4-WP1E-PREVIEW-CONVERGENCE.md`.

Admitted dependency sequence: A -> B -> C -> D -> E -> F -> G -> H. C10 remains DEFERRED/UNPROVEN.

## Reconciled handoff

WP1-A/TASK-636, WP1-B/TASK-637 and WP1-C/TASK-638 are integrated. WP1-D planning PR #1021 merged by squash at `d05454e115fb7845773950895b08e9647f360904`; TASK-639 construction PR #1023 merged by squash on 2026-10-09 at `44f22b4d0ccfa82dc95dbe230ac3731c2e9fd015`, after one-commit/allowlist/review/exact-head/merge-candidate checks. Superseded draft #1022 was closed unmerged.

WP1-E/TASK-640 is the next dependency-safe lot. Materialize the Preview projection from the existing Station-owned editor draft/revision; ensure Layers/Inspector/Preview converge deterministically after accepted WP1-D edits and reject malformed, stale or incompatible states without partial projection. No DOM/UI or separate Preview store is authorized in this tranche.

## Next executable action

1. Verify whether WP1-E planning PR is integrated; review and integrate only when eligible. Do not duplicate planning.
2. From fresh main, implement TASK-640 on a separate Sprint branch with one authoritative TASK commit, respecting five-file allowlist and forbidden paths.
3. Prove positive, negative, adversarial, recovery and predecessor-integration cases; run focused tests and exact-head `npm run verify`, current merge-candidate CI and semantic/architecture review before integration.
4. Only after WP1-E is IMPLEMENTED, PROVEN and INTEGRATED, materialize WP1-F Save/Discard Draft Boundary.

## Invariants and evidence

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; one Station-owned draft; Layers/Inspector/Preview are projections. C0-C9 preserved, C10 DEFERRED. No Core/business/command, durable persistence, provider/runtime/deploy/secrets, arbitrary HTML/CSS/pixel authoring. Keyboard/focus/accessibility N/A to contract-only tranche, mandatory for introduced UI. IMPLEMENTED != PROVEN != INTEGRATED; exact-head CI != merge-candidate CI.

Handoff after every action: WP/sprint/TASK, fresh main/HEAD, PR, tests/gates, real blocker/worker counter and next executable action.
