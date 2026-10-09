# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-09
Reconciled base: `main@e92d612e0e804ecb004c5d01e33728de0fb2dd6f`
Status: WP1-A/B/C/D/E INTEGRATED; WP1-F/TASK-641 MATERIALIZED FOR CONSTRUCTION (after planning integration)

> Single live execution pointer under `docs/DOCUMENT_AUTHORITY.md`. Revalidate fresh main, branches, PRs and CI before each action; recorded SHAs are historical clues.

## Authority

Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP1 plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active successor: `specs/tasks/TASK-641-STATION-S4-WP1F-SAVE-DISCARD.md`.

Admitted dependency sequence: A -> B -> C -> D -> E -> F -> G -> H. C10 remains DEFERRED/UNPROVEN.

## Reconciled handoff

WP1-A/TASK-636, WP1-B/TASK-637, WP1-C/TASK-638 and WP1-D/TASK-639 are integrated; TASK-639 construction PR #1023 merged by squash at `44f22b4d0ccfa82dc95dbe230ac3731c2e9fd015`. Superseded PR #1022 closed unmerged.

WP1-E planning PR #1024 merged by squash at `46a9cf0e72726a4b667a096051b1cb5e0a95795d`. TASK-640 construction PR #1025 merged by squash on 2026-10-09 at `e92d612e0e804ecb004c5d01e33728de0fb2dd6f`. The deterministic Preview projection reads the same Station-owned draft/revision as Layers and Inspector; no DOM/UI or alternate store was introduced.

WP1-F/TASK-641 is the next dependency-safe lot: explicit Station-local accept/save and discard boundary, immutable accepted composition snapshot, deterministic restoration, clean draft and safe local revision semantics. Preserve external canonical base revision and never claim durable persistence or business rollback.

## Next executable action

1. Check whether TASK-641 planning PR is already integrated. If open, review its bounded task spec and pointer, then integrate only when eligible; do not duplicate.
2. From fresh main, implement TASK-641 on a separate Sprint branch with one authoritative commit and five-file allowlist.
3. Prove positive, negative, adversarial, recovery and predecessor-integration cases; run focused test and `npm run verify` on exact HEAD, current merge-candidate CI and semantic/architecture review.
4. Only after WP1-F is IMPLEMENTED, PROVEN and INTEGRATED, materialize WP1-G Integrated Editor Journey.

## Invariants and evidence

`identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`; discrete grid/span; one Station-owned draft; Layers/Inspector/Preview are projections. C0-C9 preserved, C10 DEFERRED. No Core/business/command, durable persistence, provider/runtime/deploy/secrets or arbitrary HTML/CSS/pixel authoring. Keyboard/focus/accessibility N/A to contract-only tranche, mandatory for introduced UI. IMPLEMENTED != PROVEN != INTEGRATED; exact-head CI != merge-candidate CI.

Handoff after every action: WP/sprint/TASK, fresh main/HEAD, PR, tests/gates, real blocker/worker counter and next executable action.
