# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-07
Base: `main@26a6732293a374736438cd9c223ff8f32b6d2d0b`
Status: TASK-636 / WP1-A INTEGRATED; WP1-B / TASK-637 MATERIALIZED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority

Scope increment: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Current task: `specs/tasks/TASK-637-STATION-S4-WP1B-LAYERS-SELECTION.md`.

WP1 remains continuously authorized through DAG `A -> B -> C -> D -> E -> F -> G -> H`. C10 remains DEFERRED/UNPROVEN.

## Fresh repository truth

TASK-636 / WP1-A is integrated on main at `26a6732293a374736438cd9c223ff8f32b6d2d0b`. Its editor-session/draft projection is the predecessor authority for WP1-B. Do not reopen TASK-636 absent a real regression.

## Current eligible work — TASK-637

Implement the smallest Layers hierarchy projection and single-selection contract over the same Station-owned editor draft. Layers is a projection, not a canonical competitor. Preserve stable refs and `selection != focus != active != expansion`.

Required proof: deterministic hierarchy and selection, identity separation, malformed/unknown/duplicate/stale/incompatible fail-closed behavior, zero partial mutation, recovery after rejection, and absence of Core/business/command/persistence authority. No DOM/UI is introduced, so accessibility/keyboard/focus proof is N/A for this tranche.

## Boundaries

Preserve C0→C9, C10 DEFERRED, `identity != placement != presentation != action`, `ComponentRegistry != AppManifest`, projection != authority, and draft/projection as non-canonical Station state. No Core/business authority, durable persistence, provider/runtime/deploy/secrets, arbitrary HTML/CSS/free drag, specialized Studio, Inspector/Preview/grid/save implementation, or hidden scope expansion.

## Next action

After this materialization integrates, begin TASK-637 immediately from fresh main. Require focused product proof and `npm run verify` on the exact implementation head, semantic/architectural review, and current Merge Candidate CI when required. After TASK-637 integrates, revalidate fresh main and materialize/start WP1-C without new authorization.
