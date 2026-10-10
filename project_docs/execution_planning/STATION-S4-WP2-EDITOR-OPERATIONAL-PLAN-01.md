# Station S4 WP2 — Editor Operational Journey — Plan 01

Date: 2026-10-10
Status: Construction A and B integrated; optional C skipped on fresh-main review; package review on branch, closure forecast
Base: main@1c2625acacf2e161e388b031026da3766a84902d
Scope: docs/contracts/003-station-editor-operational-journey/ADDENDUM.md
Predecessor: WP1 CLOSED / bounded PROVEN / INTEGRATED; PR #1034

## Package goal and arrival milestone

A maintainer launches the shared editor from Station and operates on an admitted source-owned catalog composition, with truthful hierarchy/constraints, safe session switching and preserved draft through minimize/restore. No complete-product, external-file or persistence claim.

## Baseline / readiness

Existing /component-editor uses one public EditorSession but contains a fixed grid/two-button registry and labels. station-foundation-client.tsx resolves M1_UTILITY_APPS through StationAppRegistry, WindowDefinition and WindowFrame; its Component Lab has a real ButtonGroup graph/registry but its separate display Layers fixture is not the graph authority. Reuse descriptors/graph semantics; never reuse fabricated layer fixtures as editor truth. Shell currently renders only OPEN windows, so minimizing unmounts bodies; Construction B must explicitly solve editor lifetime without changing windowing contracts or persisting graphs.

WP1 exact closure head 4fc480f5 passed verify exact 38052042744 / merge 38052042773, heavy 38052042752, handoff 38052042750 and Station build/browser 38052042748 (7/7; artifact 11669826207). These are predecessor evidence, not WP2 implementation proof.

## WBS and DAG

Planning -> A1 catalog/session input adapter (TASK-646) -> A2 reusable catalog workbench (TASK-647) -> B Station app/window journey -> optional C bounded remaining goal corrections -> package review -> documentation closure.

| Sprint | State | Goal / growing exit proof |
|---|---|---|
| Planning | INTEGRATED PR #1035 | Admit bounded increment and materialize only A after fresh predecessor truth |
| Construction A | INTEGRATED PR #1036 | Source-owned catalog, validated session input, descriptor-aware spans/hierarchy, safe switching; real route browser edit/save/discard plus negative/recovery and all WP1 regression |
| Construction B | INTEGRATED PR #1037 | Ordinary launcher/window integration, independent editing context, minimize/restore preservation, close/reopen semantics; real Station-to-editor E2E |
| Construction C | SKIPPED after fresh-main goal review | Promote only if fresh A+B evidence reveals a bounded unmet package goal; otherwise skip |
| Package Integration & Review | COMMITTED | Review full chain, trust/contracts/debt/accessibility/CI/readiness; missing features return to construction |
| Documentation & Closure | FORECAST | Reconcile actual integrated outcomes/risks/traceability and close only bounded scope |

## Architecture / risk disposition

App-local adapter types and existing public editor/composition/app/window contracts only; L1/L2. No shared API/schema changes committed. Catalog immutable source definitions are not live business objects. Future external-input adapters require runtime validation under new scope. Registry-derived constraints differ by descriptor; hardcoded WP1 messages cannot be reused as authority for every catalog entry. Dirty switching, focus restoration, per-window state lifetime and nested Preview are explicit proof risks. Stop for forbidden-path/L3/L4 requirement and materialize reviewed correction/ADR as applicable.

## Validation and execution

Serial owner-authorized direct GitHub commits, one Sprint branch/PR, one distinct authoritative commit per TASK. Construction A has two TASK commits; integrate with a merge method preserving both, never squash them into a single multi-TASK commit. Run npm run verify, npm run station:build, npx playwright test --config tests/browser/station-editor.playwright.config.ts. All triggered exact-head, current merge-candidate, heavy/handoff, builds/frontend/browser checks and retained artifacts must pass before integration. No local execution claim without observed results.

Construction A and B integrated under separate Sprint PRs with full exact-head proof. Fresh main@22d0ad7 shows the bounded goal covered; optional C is skipped. TASK-650 review executes separately; Documentation & Closure remains forecast until review integrates. Preserve shared local checkpoint and historical branches.
