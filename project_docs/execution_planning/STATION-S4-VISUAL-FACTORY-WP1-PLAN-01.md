# Station S4 — Visual Factory Foundation — WP1 Plan 01

Date: 2026-10-04
Status: PLANNING & MATERIALIZATION
Scope authority: `docs/contracts/002-station-visual-factory/ADDENDUM.md`
Predecessor: Station S3 — CLOSED / PROVEN / INTEGRATED
Base: `main@746496432748b27b2a51f096fb989b25f5327643`

## Milestone outcome

A maintainer can open one admitted Station composition in a shared editor workbench, inspect hierarchy and selected-node properties, perform constrained grid/span composition edits, observe synchronized preview, receive fail-closed validation, and explicitly save or discard Station-owned draft state. No specialized Studio or Core/business authority is introduced.

## Frozen WP1 scope

WP1 owns only the shared editor foundation needed for that journey:
- editor session/model projection over existing C0→C9 composition contracts;
- Explorer/Layers hierarchy projection and selection;
- Inspector/Properties projection for admitted editable structural properties;
- discrete grid/span placement editing;
- synchronized Preview projection;
- validation/result envelope for accepted/rejected edits;
- Station-owned draft save/discard semantics;
- keyboard/focus/accessibility and negative/adversarial/recovery proof for introduced UI.

## WBS / dependency order

1. **WP1-A — Editor Session & Projection Contract**: define one Station-owned editor session/projection and draft boundary over existing composition identity/revision/currentness.
2. **WP1-B — Layers + Selection**: hierarchy projection, stable refs, selection semantics and keyboard/focus ownership.
3. **WP1-C — Inspector + Structural Edit Intent**: selected-node property projection and typed edit intents; no direct canonical mutation from controls.
4. **WP1-D — Grid/Span Edit + Validation**: discrete placement/span editing with compatibility validation and fail-closed rejection.
5. **WP1-E — Preview Convergence**: preview reads the same accepted/draft projection and converges deterministically with Layers/Inspector.
6. **WP1-F — Save/Discard Draft Boundary**: explicit Station-owned draft acceptance/discard; deterministic restoration; no business rollback claim.
7. **WP1-G — Integrated Editor Journey**: representative end-to-end editor journey including stale/unknown/incompatible/adversarial/recovery cases and accessibility/keyboard evidence.
8. **WP1-H — Hardening / Coverage / Closure**: exact-head proof accounting, false-positive review, repository-memory reconciliation and closure.

Dependency DAG: `A -> B -> C -> D -> E -> F -> G -> H`.

## First construction lot

Only WP1-A is eligible immediately after this materialization integrates. Later lots require predecessor integration plus fresh-main revalidation.

### WP1-A acceptance

- Editor session has stable identity distinct from composition/component identity.
- Canonical/base revision and draft revision/currentness are explicit.
- Session can project an admitted composition without copying business authority.
- Draft mutation is Station-owned and bounded to admitted composition fields.
- stale/unknown/malformed base references fail closed before draft mutation.
- repeated equivalent initialization is deterministic/idempotent.
- no DOM/UI is required in WP1-A; accessibility is therefore N/A only for this first contract tranche.

## Allowed architecture direction

Prefer specialization -> shared editor foundation -> Station projection/adapters -> existing contracts. Reuse existing composition, application, Tool, command/currentness and evidence concepts where applicable rather than creating parallel authority.

## Forbidden

C10/Studio promotion; Core/business/command authority; provider/runtime/deploy/secrets; durable storage/persistence; arbitrary HTML/CSS or pixel positioning; specialized managers/editors; AI/MCP; hidden scope absorption; treating accepted/acknowledged as effective; treating UI discard as business compensation.

## QA lifecycle

`Materialization -> WP1-A Construction -> ... -> Integrated Journey -> Hardening/Coverage -> Documentation/Closure`.

Every construction tranche must declare proof obligations before implementation, carry focused negative/adversarial tests, and distinguish PROVEN / FAILED / UNPROVEN-GAP / N/A. Exact-head evidence becomes stale whenever HEAD changes.

## Closure condition

WP1 closes only when the complete milestone journey is executable and current evidence proves cross-projection convergence, fail-closed invalid edits, deterministic save/discard of Station-owned drafts, structural grid/span constraints, and applicable accessibility/keyboard obligations without crossing the admitted authority boundary.
