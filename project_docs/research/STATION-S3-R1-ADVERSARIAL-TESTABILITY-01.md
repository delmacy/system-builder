# Station S3-R1 — Adversarial & Testability Research 01

Date: 2026-09-26
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY
Truth base: `main@489caf8fae9fea2b2807aed98842607f2e72c69c`
Authority: `docs/contracts/001-station-component-grammar/ADDENDUM.md`, `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`, ADR-0017 and Station frontend foundation.

## Scope and non-authority rule

This artifact feeds R1→R7 and synthesis. It does not authorize Construction, product mutation, new Core contracts, or business authority. Candidate rules below become authority only through normal synthesis/materialization.

## R1 adversarial findings

Current `ui-core/components.ts` already owns a useful but deliberately small primitive/compound surface: Button with visual variants and sizes, IconButton, ButtonGroup, Input, native Select, Toggle, Separator, Badge, Panel, ScrollArea, Tooltip and MenuSurface. EditorShell, PropertyInspector and Tree exist separately. This is enough to expose the principal grammar risks before adding catalog breadth.

### F1 — Primitive explosion / semantic intent leakage

`ButtonVariant` currently contains `destructive`. This is defensible as presentation, but it becomes dangerous if semantic actions (`delete`, `cancel`, `approve`, `save`) are encoded as new Button variants. Candidate invariant: primitive variants describe bounded presentation/state only; semantic intent belongs to C4 capability/C6 pattern or an action descriptor. Test adversary: attempt to introduce `cancel`, `save`, `approve` as primitive variants and require grammar review to reject semantic proliferation.

### F2 — Identity coupled to location

Composition identity must survive reparenting, reorder and responsive placement changes. IDs derived from `parent/slot/index`, row/column, layer path or rendered DOM order will drift. Candidate invariant: stable node/component identity is opaque and location-independent; placement is a separate relation. Test adversary: move a node across compatible slots and breakpoints and assert identity unchanged while placement changes.

### F3 — Slot compatibility ambiguity

Named slots need machine-testable acceptance constraints; visual fit is not compatibility. Candidate invariant: every slot admits an explicit family/capability set and cardinality/order rule. Unknown slot, incompatible family, cardinality overflow and illegal nesting fail deterministically without draft corruption.

### F4 — Variant validity is contextual

A variant valid for one primitive/family can be invalid for another. Candidate invariant: variant validation resolves against the selected component contract, not a global string vocabulary. Invalid variant must not silently fall back to default because that creates false visual success.

### F5 — Layer/order drift

Layers/Structure, YAML/JSON, Inspector and Preview must not maintain independent ordering state. Candidate invariant: ordering is canonical composition state; all surfaces are projections. Reorder from any authorized editor produces one state transition observed identically by all projections.

### F6 — Span/responsive deformation

A composition can remain schema-valid yet become unusable at narrow widths. Candidate invariant: authoring uses discrete spans/constraints; responsive execution must preserve declared ordering, minimum viable region behavior and no overlap/escape. Pixel snapshots alone are insufficient: structural assertions must accompany visual regression.

### F7 — Duplicated state authority

YAML, Layers, Inspector and Preview are especially vulnerable to local mirrors. Candidate invariant: one canonical draft plus derived projections. Selection may be ephemeral editor state, but composition content/order/contract values cannot fork by surface. Tests must mutate through each editing surface and compare canonical state/version plus all projections.

### F8 — Accessibility regressions hidden by visual success

Current primitives expose some useful semantics (`aria-label` on IconButton, `aria-pressed` on Toggle, separator orientation, tooltip role), but composition can still create unlabeled controls, broken focus order, inaccessible menu behavior or tooltip-only naming. Accessibility is therefore a grammar obligation, not a final polish gate.

### F9 — Interaction capability duplication

Selection, focus, command dispatch, validation, dirty state, reorder/drag and keyboard behavior must not be independently reimplemented by each Tool/Studio. R3 must classify reusable capabilities and ownership before C8+ construction. Duplicate capability implementations should be detectable by contract tests and dependency review.

### F10 — False visual success

A rendered preview can look correct while contract, accessibility, identity, ordering or authority invariants are wrong. Acceptance therefore requires semantic/structural state evidence in addition to screenshots.

### F11 — Station/Core authority leakage

Station may project Core-owned concepts but must not redefine business lifecycle, workflow semantics, domain validation or persistence authority to make a component convenient. R7 must census reuse/projection before proposing any cross-boundary contract. Integration tests should prove direction: Core contract -> Station projection/adapter -> composition/rendering, never Station UI state -> implicit Core truth.

## C0→C10 proof obligations

| Level | Minimum proof obligations before promotion |
|---|---|
| C0 Token | token name is semantic/provider-independent; canonical source; theme substitution preserves meaning/contrast; no component/business semantics encoded in token identity. |
| C1 Primitive | bounded props/variants; keyboard/focus/ARIA contract; disabled/read-only behavior; visual variants do not encode business intent; provider substitution parity where adapted. |
| C2 Compound | child-family/cardinality rules; deterministic internal order; semantic grouping; roving/focus behavior where applicable; invalid child rejected without repair. |
| C3 Collection | stable item identity independent of index/location; ordering/selection invariants; empty/large collection behavior; keyboard navigation and virtualization must not alter authority. |
| C4 Capability | single owner for selection/focus/command/validation/dirty/reorder semantics; reusable state transition contract; idempotence/rejection rules; no Tool-specific duplicate authority. |
| C5 Pane/Region | named-slot compatibility; region role/label; span/minimum behavior; overflow/scroll contract; moving content does not mutate child identity. |
| C6 Pattern | semantic intent composed above primitives; allowed actions/slots explicit; destructive/confirmation/form actions preserve semantics independent of visual variant; accessibility relationships defined. |
| C7 Template/View | canonical composition is sole structural truth; Layers/Inspector/declarative source/Preview converge; responsive breakpoints preserve identity/order/required regions; structural + visual regression. |
| C8 Tool | shared editor/capability reuse demonstrated; tool specialization adds no duplicate grammar authority; complete keyboard journey; dirty/reset/validation transitions deterministic. |
| C9 Application | Tool composition boundaries explicit; navigation/focus restoration; cross-tool state ownership documented; Station projections cannot become business truth; integration contract tests. |
| C10 Studio | all lower-level obligations transitively green; Core reuse/projection census complete; no silent Core contract creation; representative end-to-end journeys, accessibility and visual/structural regression; failure/recovery preserves authoritative state. |

## Test matrix

| Dimension | Primary targets | Required adversarial examples |
|---|---|---|
| Contract/unit | C0-C4 local contracts/state machines | semantic intent passed as variant; invalid variant; duplicate ID; rejected transition; capability double-owner. |
| Schema/composition invariants | C1-C7 parent/child/slot/span/order | unknown/incompatible slot, illegal nesting, cardinality overflow, ID tied to path, reorder drift, invalid span/breakpoint. |
| Component interaction | C1-C8 focus/selection/commands/dirty/validation | keyboard-only operation, focus after reorder/removal, cancel/reset, invalid edit leaves prior draft intact. |
| Playwright journeys | C5-C10 representative human flows | edit from Layers then inspect YAML/Inspector/Preview; move node; resize viewport; invalid edit; reload/reset where authorized. |
| Visual + structural regression | C1-C10 rendering plus semantic structure | narrow/wide deformation, overlap/clipping, wrong order despite plausible screenshot, fallback masking invalid variant. |
| Accessibility | all rendered levels | axe-style violations plus explicit accessible-name, role/state, tab order, focus visibility, keyboard and reduced-motion checks where relevant. |
| Station/Core integration contracts | C8-C10 projections/adapters | Station attempts to own domain lifecycle; adapter direction reversed; UI-only state serialized as Core truth; Core concept duplicated rather than projected. |

No single dimension substitutes for another. In particular screenshot success cannot waive schema, accessibility or authority failures.

## Human-readable acceptance journeys (action → expected state)

1. Move a component from compatible slot A to compatible slot B → node ID remains unchanged; canonical placement changes once; Layers, Inspector, declarative source and Preview show B.
2. Move the same component to an incompatible slot → mutation is rejected; canonical draft/version and all projections remain unchanged; reason is inspectable.
3. Select a component and choose an unsupported variant → mutation is rejected; preview does not silently render a default; previous valid variant remains authoritative.
4. Reorder siblings in Layers → canonical order changes once; keyboard/focus order and Preview reflect the same order; IDs remain stable.
5. Edit a property through Inspector → canonical draft changes once; declarative representation and Preview update from that draft; no Inspector-local shadow value remains.
6. Edit the equivalent declarative property → same canonical transition occurs; Inspector and Preview converge without a second authority.
7. Resize from wide to narrow viewport → declared responsive/span policy executes; required regions remain reachable, no overlap/escape occurs, logical identity/order is preserved.
8. Keyboard-navigate an action group → focus sequence and semantic roles/states are correct; destructive intent is not inferred solely from color/variant.
9. Trigger an invalid slot/child/cardinality edit → deterministic error; no silent repair, fallback or partial draft mutation.
10. Render a visually plausible composition with a missing accessible name → accessibility gate fails despite screenshot similarity.
11. Open a Tool using a Core-owned concept → Station consumes an explicit projection/adapter; editing UI state does not redefine the Core lifecycle or persistence truth.
12. Reset/discard an edited composition → canonical draft returns to accepted baseline and every projection converges to it; selection/focus follows the documented editor rule rather than preserving stale references.

## R1→R7 feed-forward / deduplication

- R1 owns census/parity and provider classification; record primitive gaps without creating them.
- R2 consumes F1/F3/F4 for compounds/collections and semantic grouping; do not repeat provider census.
- R3 owns F7/F9 capability/state authority and accessibility interaction mechanics.
- R4 owns named regions/semantic patterns and slot compatibility derived from F1/F3.
- R5 owns F2/F5/F6/F7 projection synchronization and responsive deformation.
- R6 proves shared capabilities/patterns are sufficient for Tool families without Studio construction.
- R7 owns F11 Core reuse/projection census and C9/C10 cross-boundary proof.
- Synthesis must turn these findings into explicit grammar rules, ownership, promotion criteria and Construction test obligations; unresolved items remain gaps rather than silently becoming contracts.

## Gaps to carry forward

1. R1 still needs a complete file-level census of Station and ui-core components/contracts and ecosystem parity classification (`own`, `adapt`, `adopt-pattern`, `defer`).
2. Accessibility semantics for MenuSurface/Tooltip and future collection primitives need evidence against mature headless accessibility models before promotion.
3. Stable identity semantics must be checked against the existing M2 composition schema rather than redefined here.
4. Responsive span/breakpoint invariants need comparison against current M2 discrete-grid contracts and actual Station CSS behavior.
5. R7 must inventory existing Core contracts before any Station projection gap can be called genuine.

## Construction gate implication

Construction remains ineligible. This research adds test/proof criteria only; it intentionally creates no product or Core contract.