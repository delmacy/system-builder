# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-09
Reconciled base: `main@46a9cf0e72726a4b667a096051b1cb5e0a95795d`
Status: WP1-A/B/C/D INTEGRATED; WP1-E/TASK-640 CONSTRUCTION IN PROGRESS (not integrated)

> Single live execution pointer under `docs/DOCUMENT_AUTHORITY.md`. Revalidate fresh main, branches, PRs and CI before each action; historical SHAs are clues, not authority.

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active TASK: `specs/tasks/TASK-640-STATION-S4-WP1E-PREVIEW-CONVERGENCE.md`.

Admitted dependency sequence: A -> B -> C -> D -> E -> F -> G -> H. C10 remains DEFERRED/UNPROVEN.

## Reconciled handoff

WP1-A/TASK-636, WP1-B/TASK-637 and WP1-C/TASK-638 are integrated. WP1-D planning PR #1021 merged at `d05454e115fb7845773950895b08e9647f360904`; TASK-639 construction PR #1023 squash-integrated on 2026-10-09 at `44f22b4d0ccfa82dc95dbe230ac3731c2e9fd015`. Superseded two-commit draft #1022 was closed without merge.

WP1-E/TASK-640 planning PR #1024 integrated by squash on 2026-10-09 at `46a9cf0e72726a4b667a096051b1cb5e0a95795d`. Construction proceeds on `sprint/station-s4-wp1e-task-640-preview-convergence` with one authoritative implementation commit, bounded to the five-file allowlist. This pointer does not imply construction integration. Preview must remain a deterministic, read-only projection of the existing Station draft/revision, converging with Layers and Inspector after accepted WP1-D edits.

## Next executable action

1. Revalidate TASK-640 construction branch/PR against fresh main; resolve real blockers before adding scope.
2. Complete deterministic Preview projection, fail-closed malformed/stale/incompatible validation, selection correlation and predecessor integration without a second store or DOM.
3. Run focused positive/negative/adversarial/recovery tests and `npm run verify` on exact implementation HEAD; verify current merge-candidate CI, semantic review, one commit and file allowlist before integration.
4. Only after WP1-E is IMPLEMENTED, PROVEN and INTEGRATED, materialize WP1-F Save/Discard Draft Boundary from fresh main.

## Invariants and evidence

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; one Station-owned draft; Layers/Inspector/Preview are projections. C0-C9 preserved, C10 DEFERRED. No Core/business/command, durable persistence, provider/runtime/deploy/secrets, arbitrary HTML/CSS/pixel authoring. Keyboard/focus/accessibility N/A to contract-only tranche, mandatory for introduced UI. IMPLEMENTED != PROVEN != INTEGRATED; exact-head CI != merge-candidate CI.

Handoff after every action: WP/sprint/TASK, fresh main/HEAD, PR, tests/gates, real blocker/worker counter and next executable action.
