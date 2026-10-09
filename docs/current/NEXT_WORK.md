# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-09
Reconciled base: `main@e92d612e0e804ecb004c5d01e33728de0fb2dd6f`
Status: WP1-A/B/C/D/E INTEGRATED; WP1-F/TASK-641 PLANNING MATERIALIZATION (construction only after planning integration)

> Single live execution pointer under `docs/DOCUMENT_AUTHORITY.md`. Revalidate fresh main, branches, PRs and CI before each action; historical SHAs are clues, not authority.

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Next TASK: `specs/tasks/TASK-641-STATION-S4-WP1F-SAVE-DISCARD-BOUNDARY.md`.

Admitted dependency sequence: A -> B -> C -> D -> E -> F -> G -> H. C10 remains DEFERRED/UNPROVEN.

## Reconciled handoff

WP1-A/TASK-636, WP1-B/TASK-637, WP1-C/TASK-638 integrated. WP1-D/TASK-639 construction PR #1023 squash-integrated at `44f22b4d0ccfa82dc95dbe230ac3731c2e9fd015`; superseded #1022 closed unmerged. WP1-E/TASK-640 planning PR #1024 integrated at `46a9cf0e72726a4b667a096051b1cb5e0a95795d`; construction PR #1025 squash-integrated at `e92d612e0e804ecb004c5d01e33728de0fb2dd6f` on 2026-10-09. Exact-head CI and merge-candidate checks for PR #1025 succeeded before integration.

WP1-F/TASK-641 planning materializes the next dependency-safe Save/Discard Station Draft Boundary. This planning pointer does **not** imply implementation, proof or integration. The construction Sprint must be branched from fresh main **after** planning PR integration, bounded to the five-file TASK allowlist and one authoritative implementation commit.

## Next executable action

1. Review/integrate WP1-F planning TASK-641 PR only after validating authority, predecessor integration and changed-file scope.
2. Implement pure typed Station-only draft save/accept and discard in `packages/station-editor/draft-boundary.ts`; preserve external base revision/currentness, immutable receipt, monotonic safe draft revision and one transaction baseline. Do not introduce persistence/UI/business rollback.
3. Prove changed-save, edited-discard restoration, clean no-ops, stale/unknown/malformed/adversarial/recovery and Layers/Inspector/Preview convergence; run focused tests and `npm run verify`, then current exact-head/merge-candidate CI, semantic review and allowlist gates.
4. Only after WP1-F is IMPLEMENTED, PROVEN and INTEGRATED, materialize WP1-G Integrated Editor Journey dependency-safe.

## Invariants and evidence

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; one Station-owned draft; Layers/Inspector/Preview projections. C0-C9 preserved, C10 DEFERRED. No Core/business/command, durable persistence, provider/runtime/deploy/secrets, arbitrary HTML/CSS/pixel authoring. Keyboard/focus/accessibility N/A for contract-only tranche, mandatory for introduced UI. IMPLEMENTED != PROVEN != INTEGRATED; exact-head CI != merge-candidate CI.

Handoff after every action: WP/sprint/TASK, fresh main/HEAD, PR, tests/gates, real blocker/worker counter and next executable action.
