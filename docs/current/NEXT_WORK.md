# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-07
Base: `main@26a6732293a374736438cd9c223ff8f32b6d2d0b`
Status: TASK-636 INTEGRATED; WP1-B / TASK-637 CONSTRUCTION IMPLEMENTED, QA IN PROGRESS

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

Work Package: Station S4 WP1, milestone Visual Factory Foundation. Current sprint: Construction A (WP1-B Layers projection and selection contract); next gate: risk-based intermediate QA, then integration. PR #1018 is DRAFT at implementation head `3b7b5f925858fee0c31554bbd01be2264631a171`. State: IMPLEMENTED, not yet PROVEN or INTEGRATED.

Focused product tests were added. The previous head failed Deterministic CI and Merge Candidate CI because TASK-637 lacked mandatory catalog headings, not because of a reported Layers product assertion. Those headings were corrected at current head. Automation Handoff passed; remaining current-head CI must be checked fresh.

Sprint framework: Planning defines the WP milestone and acceptance; Construction A/B/C... produces bounded increments; intermediate QA is risk/dependency-based and required before successors rely on unproven contracts; integrated QA validates the complete WP; Documentation & Closure records proven outcome in natural language. Tasks are bounded obligations, not recurring-worker assignments. All :10/:30/:50 workers execute the same continuous next eligible action.

Next worker: fetch PR #1018 and exact-head workflow runs; diagnose any failure; review semantic correctness; only mark ready/integrate after all required exact-head and current merge-candidate proofs. After merge reconcile fresh main and proceed dependency-safe to WP1-C. Do not claim the full WP milestone complete.

## Next action

Implement TASK-637 on a branch from fresh `main@26a6732293a374736438cd9c223ff8f32b6d2d0b`, one authoritative TASK commit. After exact-head proof and semantic review, integrate only if the current merge-candidate proof is green. Then revalidate fresh main and materialize WP1-C; do not wait for a nominal worker role.
