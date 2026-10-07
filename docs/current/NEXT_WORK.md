# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-06
Base: `main@e300490d626843d4b3aec954e4d15fdf14394cf7`
Status: TASK-636 CONSTRUCTION IMPLEMENTED; PR #1016 OPEN; R2 CONFORMANCE FIX APPLIED; EXACT-HEAD PROOF REQUIRED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority

Scope increment: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
WP plan: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
Current Construction task: `TASK-636-STATION-S4-WP1A-EDITOR-SESSION-PROJECTION.md`.

The user explicitly authorized the next Work Package. WP1 is the shared visual editor foundation built on the proven C0→C9 grammar. C10 remains deferred/unproven.

## WP1 milestone

One admitted composition can be opened in a shared Station editor workbench, inspected through Layers and Inspector, edited through constrained grid/span semantics, observed through synchronized Preview, validated fail-closed, and explicitly saved/discarded as Station-owned draft state without acquiring Core/business authority.

## Rolling-wave execution

WP1 decomposition is `A Editor Session/Projection -> B Layers/Selection -> C Inspector/Edit Intent -> D Grid/Span Validation -> E Preview Convergence -> F Save/Discard -> G Integrated Journey -> H Hardening/Coverage/Closure`.

Only WP1-A / TASK-636 is materialized. Later slices remain forecast until their predecessor is integrated and fresh main is revalidated.

## Boundaries

Preserve `identity != placement != presentation != action`, `ComponentRegistry != AppManifest`, projection != authority, accepted/acknowledged != effective, and UI discard != business rollback/compensation. Layers/Inspector/Preview are projections of one composition model, not canonical competitors. Stale/unknown/partial state must not be strengthened.

Forbidden without new authority: C10/Studio promotion; Core/business/command authority; provider/runtime/deploy/secrets; durable persistence/storage; arbitrary HTML/CSS/pixel positioning; specialized managers/editors; AI/MCP; hidden scope expansion.

## Proof discipline

Each tranche declares proof obligations before implementation. Negative/adversarial/recovery cases are mandatory where applicable. Accessibility/keyboard proof becomes mandatory with the first UI/DOM/focus surface; it is N/A for TASK-636 because WP1-A is contract-only. Exact-head evidence becomes stale whenever HEAD changes.

## Construction handoff to :30 — TASK-636

Fresh main was revalidated at `e300490d626843d4b3aec954e4d15fdf14394cf7`. The prior proof-path conformance correction is integrated and the documentation-only reconciliation head is not treated as a synthetic blocker to already-materialized Construction.

TASK-636 has been implemented on branch `sprint/station-s4-wp1a-task-636-r2` in PR #1016. The authoritative TASK commit is the sole commit over fresh main and changes four admitted paths: `packages/station-editor/session.ts`, `packages/station-editor/index.ts`, `tests/product/station-editor-session.test.ts`, and this live handoff. The implementation establishes Station-owned editor-session identity, explicit base/draft revision and currentness, deterministic/idempotent initialization, fail-closed malformed/colliding/stale/unknown/invalid/incompatible input handling, bounded validated draft mutation, stale-draft rejection with zero partial mutation, and explicit `station-draft-projection` authority only.

Required acceptance/proof for :30: verify the exact PR head with `npm run verify`/Deterministic CI and focused product proof; semantically review identity separation and no authority strengthening; confirm negative/adversarial zero-mutation behavior; then require the current Merge Candidate CI before integration. Accessibility remains N/A because TASK-636 introduces no DOM/UI/focus surface.

No WP1-B implementation or authority has been admitted. C0→C9 remain preserved; C10 remains DEFERRED/UNPROVEN. No Core/business/command authority, durable persistence/storage, provider/runtime/deploy/secrets, arbitrary HTML/CSS/free drag, Layers/Inspector/Preview UI, or Studio was introduced.

## Next action

Current authoritative lane is PR #1016 (`sprint/station-s4-wp1a-task-636-r2`), superseding #1015. It preserves TASK-636 semantics and corrects the package-boundary conformance blocker by consuming `station-composition` through `@system-builder/station-composition` with the public path registered in `tsconfig.json`. Any evidence from the prior head is stale for this R2 head.

## Next action

Verify the exact current PR #1016 head with Deterministic CI/focused product proof and a distinct current Merge Candidate CI. If semantic review remains clean and all required gates are GREEN, integrate #1016 with expected-head protection, revalidate fresh main, close WP1-A, and materialize only WP1-B Layers/Selection. Do not wait for a nominal worker slot. Accessibility remains N/A until the first UI/DOM/focus surface.
