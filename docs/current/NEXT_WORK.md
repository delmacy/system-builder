# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-09
Reconciled base: `main@e42b8e882f08153a30571c7fdd7b300c32cc987d`
Status: WP1-A/B/C/D/E/F INTEGRATED; WP1-G/TASK-642 PLANNING MATERIALIZED; CONSTRUCTION AFTER PLANNING PR MERGE

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active task: `specs/tasks/TASK-642-STATION-S4-WP1G-INTEGRATED-EDITOR-JOURNEY.md`.
Dependency order: A -> B -> C -> D -> E -> F -> G -> H.

## Reconciled handoff

WP1-A through WP1-E are integrated. WP1-F/TASK-641 PR #1028 was squash-merged on 2026-10-09 at `e42b8e882f08153a30571c7fdd7b300c32cc987d`. Deterministic CI, Merge Candidate CI, Station Frontend Quality, Cross-Platform Build, Heavy Product Tests rerun and Handoff checks passed. Superseded PR #1027 must not be integrated.

WP1-G/TASK-642 is the next dependency-safe tranche: a Station editor UI journey using the same session for Layers, Inspector, Preview, discrete grid/span edits, and local accept/discard. Keyboard/focus/accessibility evidence is mandatory for this UI tranche.

## Next executable action

1. Revalidate main, TASK-642 planning PR, concurrent branches and CI. Integrate planning only when eligible.
2. Construct TASK-642 from fresh main on an isolated Sprint branch with its seven-file allowlist and one authoritative commit.
3. Run integrated, negative, adversarial and recovery tests, browser keyboard/focus evidence, `npm run verify`, `npm run station:build`, exact-head CI and merge-candidate CI.
4. After proven integration, materialize WP1-H hardening/coverage/closure.

## Invariants

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; one Station-owned draft; Layers/Inspector/Preview are projections. C0-C9 preserved; C10 DEFERRED. No Core/business/persistence authority. IMPLEMENTED != PROVEN != INTEGRATED.
