# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-08
Base: `main@27fd112fbc63428dedf32bbddc296fa8acce9684`
Status: TASK-636 and TASK-637 INTEGRATED; WP1-C planning next

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority

Scope increment: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Current task: `TASK-637-STATION-S4-WP1B-LAYERS-SELECTION.md`.

WP1 remains continuously authorized in dependency order `A -> B -> C -> D -> E -> F -> G -> H`. C10 remains DEFERRED/UNPROVEN.

## Fresh-main reconciliation

TASK-636 / WP1-A is integrated on fresh main at `26a6732293a374736438cd9c223ff8f32b6d2d0b`. The integrated implementation establishes the shared Station-owned editor session/draft projection and public Station Composition package boundary. Repository memory from the pre-integration handoff was stale and is reconciled here rather than reopening TASK-636.

## Current dependency-safe slice — WP1-B

TASK-637 materializes Layers projection + selection only. It must derive hierarchy from the existing editor-session draft, preserve stable composition-node refs, provide deterministic empty/single selection with safe unknown-ref rejection, and keep selection orthogonal to focus, active context and expansion state.

This tranche remains contract-only: no DOM/UI is introduced, so accessibility/keyboard proof is N/A here. Existing generic `station-interaction` selection primitives should be reused where they fit rather than creating competing selection authority.

## Boundaries

Preserve `identity != placement != presentation != action`, `ComponentRegistry != AppManifest`, projection != authority, and selection != focus != active != expansion. Layers is a projection of the editor-session composition draft, not a canonical competitor. Stale/unknown/invalid state must fail closed.

Forbidden without new authority: C10/Studio promotion; Core/business/command authority; provider/runtime/deploy/secrets; durable persistence/storage; arbitrary HTML/CSS/pixel positioning; Inspector/Preview implementation; hidden scope expansion.

## Proof discipline

TASK-637 requires focused happy/negative/adversarial proof, including deterministic hierarchy, stable identity independent of array position, malformed/unknown fail-closed behavior, selection preservation on rejection, and zero editor-draft mutation. `npm run verify` must pass on the exact implementation head; integration additionally requires the current merge-candidate gate.

## Current sprint and handoff (2026-10-08)

WP1-B TASK-637 Layers projection and selection was integrated via squash PR #1018, main commit `27fd112fbc63428dedf32bbddc296fa8acce9684`. Exact-head `3525886fa6c2bacbcf430f853a25225243a2e320` passed six GitHub Actions workflows: Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Frontend Quality, Station Cross-Platform Build, Automation Handoff State Machine. WP1-B state: INTEGRATED; do not reopen absent a regression.

Current sprint: WP1-C Planning (Inspector & Edit Intent). Before coding, inspect the WP plan, editor session contract and Layers projection, and create bounded TASK-638 with mandatory catalog headings (Context, Current behavior, Inputs / contracts, Outputs / contracts) plus risk-based acceptance, allowlist and proof. Preserve Station-only draft intent and transaction authority; no Core/business or persistence, no free-form placement. Next worker may execute planning and construction independently after reconciling fresh main. All :10/:30/:50 workers are interchangeable continuous executors.

Sprint framework: Planning establishes milestone and gates; Construction A/B/C... materializes bounded scope; intermediate QA before dependent increments when risk requires; integrated WP QA at closure; Documentation & Closure records outcomes in natural language. Task completion is not a reason to disable recurring execution.

## Next action

Materialize WP1-C TASK-638 Inspector & Edit Intent planning and its bounded acceptance contract, then continue dependency-safe construction with exact-head verification and current merge-candidate CI. Do not claim the overall WP1 milestone complete.
