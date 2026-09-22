# G4 — Frontend Collection Interaction Contracts

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Define provider-neutral interaction contracts for the collection-heavy surfaces identified by `G4_FRONTEND_PRIMITIVE_BASE_QUALIFICATION_RESEARCH.md` before any Base UI, React Aria, Radix or other implementation is selected.

This artifact is research only. It does not authorize installation, implementation, provider adoption, WBS, Work Packages, Sprints or TASKs.

## Evidence classes

Primary evidence reviewed in this round:

- W3C WAI-ARIA APG Tree View, Grid, Treegrid and Combobox patterns;
- current Base UI Combobox guidance and September 4, 2026 v1.8.0 release notes;
- React Aria / React Spectrum collection, async/infinite loading and accessible collection drag/drop documentation/releases;
- existing G4 projection-navigation and primitive-base qualification research.

The four benchmark products remain interaction-grammar references: Photoshop for stable tool/context/panel shell; Budibase for inspectable/decomposable composition; n8n for catalog-to-node insertion and graph relations; Canva for progressive disclosure from selection to quick actions to deep inspector. No benchmark's visual trade dress is normative.

## Material finding C1 — one collection contract is not enough

`InventoryGrid`, `CapabilityList`, `ComponentTree`, `RelationTable` and `ContextualPicker` share identity/search/selection concerns but require different accessibility and keyboard contracts. Treating them as one generic `Collection` would hide material semantics.

Candidate common substrate:

```text
CollectionIdentity
  canonicalIdentity
  presentationIdentity
  stableKey
  label
  description?
  kind
  semanticOwner?
  revision/currentness?

CollectionContext
  focusIdentity?
  selectedIdentities[]
  activeIdentity?
  query?
  filters[]
  sort?
  grouping?
  disclosure/authorizationContext
  materializationWindow
```

These names are research vocabulary, not a code schema.

`Focus != selection != active tool != canonical identity`.

## Material finding C2 — InventoryGrid is a layout-grid/navigation surface, not a pile of tabbable cards

Purpose: recognition-heavy browsing of tools, capabilities, blocks and actions.

Provider-neutral contract:

```text
InventoryGrid
  categorized/grouped items
  arrow-key spatial navigation
  one composite Tab stop where appropriate
  typeahead/search entry
  focus and selection visually distinct
  selected item synchronizes Inspector without silently activating it
  Enter/default action opens or inserts only when mode permits
  explicit context actions
  alternate List representation
  stable identity across filtering/sorting/materialization
```

Accessibility implication: WAI-ARIA layout-grid guidance supports arrow navigation inside a composite and distinguishes navigation mode from interacting with controls inside a cell. The SB must not create hundreds or thousands of global Tab stops merely because cards are clickable.

At large scale, Grid is a recognition projection, not a requirement to materialize the full catalog.

## Material finding C3 — CapabilityList is the dense comparison/search projection

Purpose: scan, sort, filter and compare many items when labels/metadata matter more than icon recognition.

Candidate contract:

```text
CapabilityList
  row identity
  primary label + bounded secondary metadata
  single or multi-selection declared explicitly
  typeahead/search/filter
  sort/group controls outside row navigation where possible
  incremental loading/materialization
  row action menu without stealing navigation semantics
  inspector synchronization
  optional compact/comfortable density
```

A List is not merely the same Grid with CSS changed. Its keyboard, reading order and density assumptions can differ.

## Material finding C4 — ComponentTree owns hierarchy navigation, not business ownership

Purpose: component hierarchy, module composition, nested structures and inspectable decomposition.

WAI-ARIA Tree evidence materially strengthens the contract:

- Right/Left arrows expand/collapse and traverse parent/child relationships;
- Up/Down traverse visible nodes;
- typeahead is recommended, especially with more than seven root nodes;
- multi-selection must keep selection independent from focus;
- dynamically materialized trees need hierarchy metadata such as level/set size/position when the full set is not in DOM.

Candidate contract:

```text
ComponentTree
  expand/collapse
  lazy children
  stable parent/child identity
  focus independent from multi-selection
  typeahead
  non-drag move/reparent command
  explicit eligibility before move/reparent
  reveal-in-surface / open-inspector
  decomposition/eject action only when semantic constraints permit
```

`Tree parent != semantic owner` and `visual reparent != canonical ownership transfer`.

## Material finding C5 — RelationTable is the mandatory non-spatial peer of graph navigation

A graph cannot be the only way to understand or traverse handoffs, dependencies, authority links, data flows or topology relations.

Candidate RelationTable:

```text
RelationTable
  source identity
  relation kind
  direction
  target identity
  eligibility/contract disposition
  currentness/evidence summary
  semantic owner(s)
  filters by relation/lens/direction
  sort/group
  open source
  open target
  traverse relation
  reveal same relation in Graph
```

For hierarchical relation sets, Treegrid may be appropriate; for ordinary relation sets, an accessible data grid/table is preferable. Treegrid should not be selected merely because it looks powerful: APG notes that rows and cells participate in keyboard focus and that editing/navigation modes can conflict with arrow-key behavior.

This establishes a stronger invariant:

`Graph relation visibility != relation accessibility`.

Every graph relation important enough to drive Builder decisions requires a non-spatial inspectable/traversable representation.

## Material finding C6 — ContextualPicker is eligibility-aware discovery, not generic search

Purpose: insertion/connection/provider/action selection after the user establishes context such as a port, slot, handoff, field or placement target.

Candidate contract:

```text
ContextualPicker
  query input
  categorized results
  contextual ranking
  eligibility disposition:
    ELIGIBLE
    INELIGIBLE(reason)
    UNKNOWN(needs qualification)
  keyboard navigation
  optional grid/list popup only when content warrants it
  explain incompatibility when disclosure permits
  never silently coerce incompatible items
  canonical validation remains outside the picker
```

WAI-ARIA Combobox evidence is useful here: DOM focus may remain on the input while assistive-technology focus moves through list/grid suggestions via `aria-activedescendant`; grid popup navigation has materially different arrow semantics from a simple listbox. Therefore the SB should choose list vs grid suggestion presentation intentionally rather than styling one as the other.

Current Base UI evidence: Combobox is explicitly positioned for a predefined, filterable selectable set and v1.8.0 (2026-09-04) added `createItems` collection API. This keeps Base UI competitive for ContextualPicker and moderate collections, but does not prove suitability for all SB collection surfaces.

## Material finding C7 — provider qualification must test contracts, not feature names

Candidate mapping for future prototypes:

| Contract | Base UI | React Aria | Qualification focus |
| --- | --- | --- | --- |
| InventoryGrid | custom composition / evolving collection support | GridList/collection primitives relevant | composite focus, spatial navigation, virtualization/materialization |
| CapabilityList | custom/list composition | GridList/ListBox relevant | selection, async loading, stable identity |
| ComponentTree | custom composition | first-class Tree evidence | lazy hierarchy, typeahead, accessible move/DnD alternatives |
| RelationTable | ordinary table + SB behavior | Table collection model relevant | keyboard model, sorting/filtering, async rows, inspector sync |
| ContextualPicker | Combobox strong/evolving | ComboBox/Autocomplete collection composition | eligibility states, grouped results, 100/500/2000 items |

React Aria's June 2025 Tree drag/drop release explicitly supports moving within/between collection components with keyboard and screen-reader accessibility; July 2025 added async/infinite-loading support. This is strong qualification evidence, not a reason to delegate SB semantic move authority to React Aria.

## Scale scenarios — test matrix, not frozen thresholds

```text
20 items
  Grid and List both fully usable; no search dependency.

100 items
  search/filter/typeahead expected; bounded categories; Grid still viable.

500 items
  incremental materialization/virtualization candidate; List/Search becomes primary for dense comparison.

2,000 items
  Search/Command/ContextualPicker becomes primary discovery path;
  Grid remains a bounded projection of filtered/category/recent/favorite/contextual subsets.
```

For every scale test, measure:

- first meaningful render and interaction latency;
- keyboard traversal cost;
- screen-reader announcement quality;
- focus persistence after filtering/loading;
- stable identity and inspector synchronization;
- long labels and i18n/RTL;
- 200%/400% zoom/reflow;
- reduced motion;
- no hidden-item information leak through counts/search;
- dependency/bundle closure separately for Builder and generated systems.

## Non-drag alternatives are part of the contract

Collection drag/drop may be offered, but the equivalent semantic action needs a non-drag path:

```text
Move / Reparent / Insert / Connect
  -> command or action
  -> choose destination/compatible target
  -> explain eligibility
  -> review when required
  -> canonical validation
```

`Accessible drag/drop != permission to make drag the only interaction`.

## Relationship to the emerging SB shell

The collection contracts map cleanly onto the stable creative-software shell hypothesis:

```text
LEFT TOOLBOX
  InventoryGrid / CapabilityList / ContextualPicker

CENTER SPECIALIZED SURFACE
  layout / workflow graph / data / architecture / topology / operations

RIGHT PANELS
  ComponentTree / RelationTable / Properties / Evidence / History / Dependencies

GLOBAL + CONTEXTUAL BARS
  search/command and mode-qualified actions
```

The same canonical identity should survive `Inventory -> Map/System Slice -> Graph -> RelationTable -> Inspector` transitions. Coordinates, expansion state and panel layout are projection state only.

## Risks / anti-patterns

- thousands of tabbable cards;
- selection-follows-focus in a multi-select engineering surface;
- virtualization that loses stable identity or fabricates absence;
- hidden incompatible options with no explanation when explanation is useful;
- a graph with no equivalent relation list/table;
- drag-only connect/reparent/place interactions;
- arbitrary hierarchy reorder interpreted as semantic ownership change;
- embedding editable inputs in arrow-navigated grids/toolbars without a navigation/edit mode contract;
- provider-specific APIs leaking upward into module/business components;
- generated runtimes inheriting Builder-only collection dependencies.

## Candidate decisions after this round

1. Keep Base UI as leading ordinary-primitive candidate, not universal collection authority.
2. Keep React Aria as the leading specialized qualification candidate for collection-heavy surfaces.
3. Treat `InventoryGrid`, `CapabilityList`, `ComponentTree`, `RelationTable`, and `ContextualPicker` as distinct provider-neutral contracts.
4. Require a non-spatial `RelationTable`/relation navigator peer for graph-based engineering surfaces.
5. Preserve identity across projections; do not preserve arbitrary coordinates as semantics.
6. Require non-drag alternatives and explicit eligibility for structural moves/connections.
7. Do not bind thresholds, provider selection or implementation from this research.

## Maturity

`FRONTEND_COLLECTION_INTERACTION_CONTRACTS = EMERGING / MATERIAL_DELTA`

Not saturated. No implementation authority is granted.

## Next highest-value gap

Specify the shared `SelectionContext / ProjectionHandoff` contract across Inventory, Tree, RelationTable, Graph and Inspector, including focus restoration, back/forward history, semantic zoom, disclosure/currentness, multi-selection and what happens when a selected identity is not materialized or no longer admissible. Then qualify the same contract against Photoshop/Canva contextual actions and n8n graph insertion/editing patterns.