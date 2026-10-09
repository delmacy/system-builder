# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-09
Reconciled base: `main@e42b8e882f08153a30571c7fdd7b300c32cc987d`
Status: WP1-A/B/C/D/E/F INTEGRATED; WP1-G/TASK-642 MATERIALIZED LOCALLY FOR CONSTRUCTION

> Single live execution pointer under `docs/DOCUMENT_AUTHORITY.md`. Revalidate main, PRs, dependencies and CI before each integration; recorded SHAs are historical clues.

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active successor: `specs/tasks/TASK-642-STATION-S4-WP1G-INTEGRATED-JOURNEY.md`.

Admitted dependency sequence: A -> B -> C -> D -> E -> F -> G -> H. C10 remains DEFERRED/UNPROVEN.

## Reconciled handoff

WP1-A/B/C/D/E are integrated. WP1-E construction PR #1025 was squash-integrated at `e92d612e0e804ecb004c5d01e33728de0fb2dd6f`. WP1-F planning PR #1026 and construction PR #1028 are integrated; #1028 squash merge `e42b8e882f08153a30571c7fdd7b300c32cc987d`. Superseded PR #1027 remains separate and must not be mistaken for an active dependency.

WP1-F established pure Station-local immutable accept/save and deterministic discard. No durable persistence or business rollback is claimed.

## Next executable action

1. Execute TASK-642 in the shared local serial worktree `C:\Users\admin\system-builder-s4-serial`, branch `s4/serial-wp1`; three workers (:10/:30/:50) form one serial handoff chain, never parallel writers.
2. Prove end-to-end public API journey with focused positive, negative, adversarial, recovery and predecessor-integration tests. Classify actual DOM/UI, keyboard and accessibility evidence honestly.
3. Run `npx tsx --test tests/product/station-editor-integrated-journey.test.ts` and `npm run verify`; preserve exact local HEAD evidence and one authoritative TASK commit.
4. Integrate to GitHub periodically at a coherent Sprint gate, with PR/CI/review and without bypassing safety restrictions; only then advance to WP1-H.

## Invariants

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; one Station-owned draft; Layers/Inspector/Preview are projections. No Core/business/command, durable persistence, provider/runtime/deploy/secrets, arbitrary HTML/CSS/pixels. IMPLEMENTED != PROVEN != INTEGRATED; local test != merge-candidate CI.

Handoff after every action: WP/TASK, worktree/branch/HEAD, tests/gates, blocker and next executable action.
