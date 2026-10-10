# Station S4 WP4 — Edit History Plan 01
Date: 2026-10-10
State: A/B/review IMPLEMENTED / PROVEN / INTEGRATED; WP4 CLOSED declaration effective only on validated Documentation & Closure integration. Prior checkpoints are historical; NEXT_WORK is the live pointer.
Base: main@2cf4ad958257615d9fd45cdc4c6d05d0c5b5b529 (#1049)
Authority: Addendum 005; WBS 21.2.1/21.2.3; unchanged Addenda 002/003/004, ADR-0009 and Station foundation

## Goal and arrival milestone
A maintainer can undo/redo applied span edits safely through synchronized Layers/Inspector/Preview, with bounded history and explicit checkpoint lifecycle. No generic component authoring or complete editor claim.

## WBS and dependency-safe rolling wave
1. Planning/TASK-657: reconstruct fresh main and open PRs; scope, lifecycle, limits and exit proof; materialize only A/TASK-658.
2. Construction A/TASK-658: pure immutable bounded engine delegating actual structural edit/validation; real catalog/projections, failures, branch/no-op and limit proof. COMMITTED only after planning integration.
3. Construction B FORECAST: workbench controls/keyboard; integrate checkpoint/open/cancel/failure/minimize lifecycle; browser proof plus all 21 predecessor journeys.
4. Optional C FORECAST: only if fresh-main B evidence identifies missing bounded capability.
5. Package Review FORECAST: full regression, architecture/contracts/dependencies/trust/performance/debt and closure GO; no overflow construction.
6. Documentation & Closure FORECAST: operations, risks, task/report/package/registry/live pointer reconciliation, closed only after validated merge.

## Readiness and provenance
Fresh clone is clean at #1049 merge. No applicable nested AGENTS or execution lock exists in this isolated checkout; the shared Windows worktree is not used. Unrelated #1027/#1015/#974/#955/#971/#832/#823 preserved. No active successor TASK exists. Installed graphs each have three nodes; schema/source topology unchanged. New package does not promote historical research. Owner has authorized continuation, commits/merges, and conclusion; deterministic intermediate integrations require actual passing gates.

## Growing proof and exit gates
A: installed catalog -> initialized EditorSession -> validated edit -> undo/redo -> real Inspector/Layers/Preview -> codec round trip with no history fields. Tests cover both catalogs, 49/50/51, stale revision, malformed histories, invalid spans, no-op, redo branching, empty stack, overflow and unchanged prior inputs.
B: UI convergence/dirty/selection and native-input shortcut isolation; save/discard/local checkpoints reset; export/canceled or failed open/save preserve; successful open/switch/reload resets; Station minimize preserves. All predecessor browser cases retained.
Every Sprint runs npm run verify; construction also station:build and real Chromium suite. All triggered exact-head/current-base merge-candidate, heavy/handoff/browser and platform build checks pass before merge. No universal accessibility or latency certification claim.

## Risks and explicit deferrals
50 snapshots per mounted editor with installed three-node graphs; no unbounded provenance or persisted history. Pure snapshot validation must preserve saved baseline and safe revisions. Undo at unapplied fields is blocked; native text editing remains browser-owned. Structural authoring/File Manager/.process/server/Core/sync/deploy stay deferred. Revalidate fresh main before every successor; never manufacture a task from a forecast.

## Rolling-wave checkpoint — Construction B
A #1051 passed all seven workflows, Windows/Ubuntu builds and all 21 predecessor Chromium journeys and integrated. Fresh-main B/TASK-659 only is COMMITTED; optional C/review/closure remain forecast. Earlier planning labels are historical checkpoints.

## Rolling-wave checkpoint — Package Review
B #1052 integrated at 979b1a502893e18f6b4572e69e911669f4088ffb; all seven workflows, Windows/Ubuntu and 29 Chromium journeys passed. Optional C NOT PROMOTED: no missing admitted goal capability observed. Only Package Review/TASK-660 is COMMITTED; Closure remains forecast.

## Rolling-wave checkpoint — Documentation & Closure
Review #1053 integrated at c8fcf2d62cba9ec06b435af37e3a241d76bfae6d after all five workflows and repeated 29/29 Chromium journeys. Closure GO is effective. Only TASK-661/Documentation & Closure is COMMITTED; no successor. WP4 remains open until validated closure integration.

## Final package disposition
Bounded applied-span undo/redo goal delivered. Two Construction Sprints plus Package Review and Documentation & Closure; optional C not needed. WBS 21.2.1/21.2.3 slice only, not whole WBS closure. Contracts/dependencies/risks/operations reconciled; legacy ledger and unrelated PRs unchanged. Closed declaration effective at validated closure merge. No successor committed; fresh-main scope/readiness planning is next eligible gate.
