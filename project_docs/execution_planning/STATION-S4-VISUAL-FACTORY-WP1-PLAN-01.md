# Station S4 — Visual Factory Foundation — WP1 Plan 01

Date: 2026-10-04
Status: CLOSED — bounded WP1 slice; effective on validated TASK-645 integration
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

## Final package disposition — 2026-10-10

The materially executed A–H cadence is grandfathered. A–F public APIs and G integrated API journey were followed by explicit corrective visual TASK-643 construction (PR #1031), H review TASK-644 (PR #1033), and separate documentation closure TASK-645. Historical first-lot instructions above describe the original plan and are no longer a scheduler.

Final reviewed head `65ad0646e22f17bf786edda5494d11e95ea73b7e`, base f3b326dd95da0d1ec05d9380de9aed1a5d62c572: exact verify [38051674657](https://github.com/delmacy/system-builder/actions/runs/38051674657), merge candidate [38051674714](https://github.com/delmacy/system-builder/actions/runs/38051674714), heavy 38051674669, handoff 38051674734 and Station production build/browser [38051674737](https://github.com/delmacy/system-builder/actions/runs/38051674737) all PASS. Browser 7/7 in 7.6s; artifact 11668994656 retrieved, HTML report retained, screenshot visually reviewed with no clipped panes. PR #1033 integrated at `cbdbc8f6b37fe258a109a5900e9b1ca327dd5743`.

WP1 closes only its accepted smallest editor foundation: representative composition, session-backed Layers/Inspector/Preview, constrained spans, validation/recovery and in-memory save/discard. Exercised keyboard/labels/roles/focus are proven; screen-reader, Firefox/WebKit and general accessibility certification remain unproven. No arbitrary project loader, durable persistence, desktop-launcher integration or product-wide editor completeness is implied. Documentation closure must pass its own final-head gates and merge before this status is effective. See STATION-S4-WP1-CLOSURE-01.report.md for traceability, risks and handoff.
