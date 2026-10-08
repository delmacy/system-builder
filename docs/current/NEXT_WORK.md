# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-08
Base: `main@fa67eeff3955df4b748a9e79429ba703d0165234`
Status: WP1-A/TASK-636 and WP1-B/TASK-637 INTEGRATED; WP1-C/TASK-638 CONSTRUCTION IN REVIEW, PROOF PENDING

> Live execution pointer; interpret with `docs/DOCUMENT_AUTHORITY.md`. Revalidate fresh GitHub state before action.

## Authority
Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
Plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Active task: `specs/tasks/TASK-638-STATION-S4-WP1C-INSPECTOR-INTENT.md`.

WP1 remains authorized in dependency order A → B → C → D → E → F → G → H; C10 remains DEFERRED/UNPROVEN.

## Current work and handoff
WP1-A editor session and WP1-B Layers/selection are integrated and not to be reopened absent regression.
WP1-C planning PR #1019 integrated on 2026-10-08 at `fa67eeff3955df4b748a9e79429ba703d0165234`.
Construction branch: `sprint/station-s4-wp1c-task-638-inspector`.
TASK-638 implements immutable selected-node Inspector projection and typed set-span/set-placement **proposals only** with explicit draft revision and selection. No mutation, UI, persistence or Core authority is admitted.
Focused proof: `tests/product/station-editor-inspector-intent.test.ts`.

**IMPLEMENTED != PROVEN != INTEGRATED.** Construction must be reviewed against TASK-638, prove `npm run verify` and relevant focused tests on exact PR head, inspect negative/adversarial/recovery and zero-mutation behavior, then verify the **current** Merge Candidate CI before merge. CI not yet claimed here. If any gate fails, correct boundedly and reprove; do not advance to WP1-D until WP1-C is integrated.

## Architectural invariants
Preserve `identity != placement != presentation != action`, `ComponentRegistry != AppManifest`, `selection != focus != active != expansion`, discrete grid/span and a single Station-owned draft. Layers/Inspector/Preview are projections, never competing canonical state. No C10/Studio, Core/business/command authority, provider/runtime/deploy/secrets, durable persistence, arbitrary HTML/CSS/pixel authoring or scope expansion. Keyboard/focus/accessibility are N/A to this contract-only tranche, mandatory for UI.

## Next executable action
Inspect TASK-638 construction PR/HEAD and CI. Resolve any failed gate, perform semantic/architecture review, integrate only if proven and mergeable, revalidate fresh main and immediately materialize WP1-D dependency-safe.
