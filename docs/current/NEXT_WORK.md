# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-08
Base: `main@27fd112fbc63428dedf32bbddc296fa8acce9684`
Status: TASK-636 and TASK-637 INTEGRATED; WP1-C planning next

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority

Scope increment: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Current task: `TASK-638-STATION-S4-WP1C-INSPECTOR-INTENT.md`.

WP1 remains continuously authorized in dependency order `A -> B -> C -> D -> E -> F -> G -> H`. C10 remains DEFERRED/UNPROVEN.

## Fresh-main reconciliation

TASK-636 / WP1-A is integrated on fresh main at `26a6732293a374736438cd9c223ff8f32b6d2d0b`. The integrated implementation establishes the shared Station-owned editor session/draft projection and public Station Composition package boundary. Repository memory from the pre-integration handoff was stale and is reconciled here rather than reopening TASK-636.

## Current dependency-safe slice — WP1-C

TASK-638 specifies a read-only Inspector projection and typed structural edit intents over the existing editor draft and explicit selection. This is planning only: IMPLEMENTED, PROVEN and INTEGRATED remain separate future gates. No DOM/UI is introduced in this planning slice.

## Boundaries

Preserve `identity != placement != presentation != action`, `ComponentRegistry != AppManifest`, projection != authority, and selection != focus != active != expansion. Layers is a projection of the editor-session composition draft, not a canonical competitor. Stale/unknown/invalid state must fail closed.

Forbidden without new authority: C10/Studio promotion; Core/business/command authority; provider/runtime/deploy/secrets; durable persistence/storage; arbitrary HTML/CSS/pixel positioning; Inspector mutation, Preview implementation; hidden scope expansion.

## Proof discipline

TASK-638 requires contract-level positive, negative, adversarial and recovery proof for immutable Inspector projection, typed intents, stale revisions, unknown refs, and no draft mutation. Construction must run exact-head verification and current merge-candidate CI before integration.

## Current sprint and handoff (2026-10-08)

WP1-B TASK-637 Layers projection and selection was integrated via squash PR #1018, main commit `27fd112fbc63428dedf32bbddc296fa8acce9684`. Exact-head `3525886fa6c2bacbcf430f853a25225243a2e320` passed six GitHub Actions workflows: Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Frontend Quality, Station Cross-Platform Build, Automation Handoff State Machine. WP1-B state: INTEGRATED; do not reopen absent a regression.

Current sprint: WP1-C Planning (Inspector & Edit Intent). Before coding, inspect the WP plan, editor session contract and Layers projection, and create bounded TASK-638 with mandatory catalog headings (Context, Current behavior, Inputs / contracts, Outputs / contracts) plus risk-based acceptance, allowlist and proof. Preserve Station-only draft intent and transaction authority; no Core/business or persistence, no free-form placement. Next worker may execute planning and construction independently after reconciling fresh main. All :10/:30/:50 workers are interchangeable continuous executors.

Sprint framework: Planning establishes milestone and gates; Construction A/B/C... materializes bounded scope; intermediate QA before dependent increments when risk requires; integrated WP QA at closure; Documentation & Closure records outcomes in natural language. Task completion is not a reason to disable recurring execution.

## Next action

Review and integrate PR #1019 planning after required gates; then implement TASK-638 Inspector projection and edit intents on a construction branch, with focused tests and dependency-safe construction with exact-head verification and current merge-candidate CI. Do not claim the overall WP1 milestone complete.
