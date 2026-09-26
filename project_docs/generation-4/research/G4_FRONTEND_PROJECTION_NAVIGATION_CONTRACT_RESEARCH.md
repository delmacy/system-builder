# G4 — Frontend Projection & Navigation Contract Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Reconcile the emerging frontend vocabulary — Inventory/Catalog, Map/System Slices, Graph/Relations, Inspector, Workspace, View, Lens, FocusContext — with the existing G4 `ViewportContext`, `LensDefinition` and `DisclosureEnvelope` so that navigation state cannot drift into architecture, authority or canonical system semantics.

This artifact extends:

- `G4_PRODUCT_UX_AI_NATIVE_BUILDER.md`;
- `G4_FRONTEND_WORKSPACE_COMPONENTIZATION_RESEARCH.md`;
- `G4_INVENTORY_NAVIGATION_INTERACTION_RESEARCH.md`.

It does not authorize implementation, provider adoption, Work Packages, Sprints or TASKs.

## Evidence classes

This round used primary/current evidence from:

- WAI-ARIA Authoring Practices for layout grids, listboxes, comboboxes, tree views and treegrids;
- WCAG 2.2 guidance for target size and non-drag interaction;
- React Spectrum / React Aria collection behavior, including ListView/TreeView keyboard navigation and large-collection/infinite-loading support;
- current shadcn/ui 2026 changelog confirming Base UI as the new-project default while React Aria and Radix remain first-class/supported bases;
- Photoshop workspace/contextual-task patterns;
- Canva contextual edit/side-panel/mode patterns;
- Budibase component tree, Blocks/Eject, Data Provider and Settings Panel patterns;
- n8n Canvas Groups, especially the separation between durable group structure and user-local collapsed/expanded projection state.

These sources qualify interaction contracts. They do not become canonical product authority.

## Material findings

### P1 — `Inventory -> Map -> Graph -> Inspector` should be one navigation protocol, not four unrelated screens

The prior research identified three complementary questions:

```text
INVENTORY / CATALOG
  What can I use or open?

MAP / SYSTEM SLICE
  Where is this identity situated in the current system projection?

GRAPH / RELATIONS
  How is this identity related to other identities?

INSPECTOR
  What is currently known/qualified about this identity?
```

The material refinement is that these should share one projection-navigation envelope rather than independently maintaining selection state.

Candidate contract:

```text
NavigationContext
  focusIdentity?
  focusKind?
  sourceSurface
  targetSurface?
  relationPath?
  workspace
  primarySlice?
  contextSlices[]
  activeLenses[]
  mode
  revision/currentness
  authorizationContext
  disclosureEnvelopeRef
  semanticLevel
  filters[]
  expansionBudget
  detailBudget
```

`NavigationContext` is a UI/projection contract. It does not own any canonical field listed above; it carries references/qualifiers needed to rebuild an authorized projection.

Candidate navigation:

```text
CatalogItem(CustomerForm)
   -> focus canonical identity
   -> Map reveals Frontend sector containing CustomerForm
   -> Graph materializes authorized neighborhood
   -> Inspector projects qualified details
```

The identity is stable. Geometry, visible neighbors, labels, aggregate counts and available actions may change with workspace, authorization, currentness, mode and lens.

`Same identity != same projection`.

### P2 — Reconcile, do not duplicate, `ViewportContext`

Existing G4 research already defines `ViewportContext` for semantic scope, focus, level, lenses, filters, revision/currentness, authorization and materialization budgets.

Therefore `NavigationContext` must not become a competing architecture model.

Candidate relationship:

```text
NavigationContext
  interaction/navigation intent
        |
        v
ViewportContext
  bounded materialization/query context
        |
        v
WorkspaceProjection
  rendered authorized result
```

A future implementation could merge these shapes or make `NavigationContext` produce/extend `ViewportContext`; this research does not bind the code shape.

The important boundary is responsibility:

```text
NavigationContext answers:
  what the user is trying to focus/navigate

ViewportContext answers:
  what bounded semantic materialization is requested

DisclosureEnvelope answers:
  what may be disclosed

WorkspaceProjection answers:
  what is actually rendered
```

`Navigation intent != disclosure permission != materialized result`.

### P3 — `System Slice` is a projection taxonomy, not a new canonical architecture layer

The current candidate slices — Business, Workflow, Capabilities, Frontend, Data, Integration, Security/Policy, Deployment, Topology, Infrastructure, Observability — are useful navigation partitions, but the Master Blueprint already has canonical planes/stages and SystemDefinition concepts.

Therefore:

```text
SystemSliceDefinition
  id
  purpose
  eligible canonical kinds/relations
  preferred work surfaces[]
  default lenses[]
  default semantic level
  context-neighbor policy
  disclosure requirements
  visual accent token
```

A slice groups projections for work. It must not create a new business owner, bounded context, deployment unit or canonical lifecycle merely because items appear together.

`System Slice != Master Blueprint plane != bounded context != deployment boundary`.

This is especially important for Security/Governance and Observability, which may be cross-cutting rather than cleanly contained floors/layers.

### P4 — `Lens` modifies emphasis/qualification; it does not choose canonical membership

The existing `LensDefinition` remains authoritative for the lens concept. Frontend research should not introduce a second visual-only lens model.

Candidate rule:

```text
System Slice
  scopes the primary concern/materialization family

Lens
  changes qualified emphasis/overlay within the permitted projection

Filter
  narrows currently materialized results
```

Examples:

```text
primary slice: Deployment/Topology
lens: Capacity
  -> placement graph with qualified capacity overlays

primary slice: Workflow
lens: Evidence
  -> process path with evidence/currentness overlays
```

`Lens != filter != authorization != slice membership`.

### P5 — `Workspace` and `View` need different persistence semantics

Candidate definitions:

```text
WorkspaceDefinition
  task-oriented shell/tool/panel/surface preset
  e.g. PROCESS_DESIGN, DATA_MODELING, OPERATIONS

SavedView
  user/team-saved projection preferences
  e.g. primary slice, context slices, lenses, filters,
       panel arrangement, semantic level, density
```

A Workspace is a reusable interaction arrangement. A SavedView is a persisted projection preference over a system/context.

Both must be requalified when reopened:

```text
saved identity references
  -> resolve against current revision
  -> re-evaluate authorization
  -> re-evaluate disclosure
  -> re-evaluate currentness
  -> materialize what is still admissible
```

`Saved View != frozen authorization snapshot`.

`Workspace preset != permission grant`.

### P6 — Selection, focus and activation must be separate states

WAI-ARIA grid/treegrid guidance explicitly distinguishes keyboard focus from selected state, especially in multi-select collections. This matters directly for inventory grids, graph nodes, component trees and multi-selection.

Candidate UI state vocabulary:

```text
FOCUS
  keyboard/interaction cursor

SELECTION
  one or more identities selected for inspection/action

PRIMARY_FOCUS_IDENTITY
  semantic identity around which navigation/materialization is centered

ACTIVATION
  opening/navigating/executing the default action for an item

HOVER
  ephemeral pointer affordance only
```

These must not share one visual token or one state variable by convenience.

`Focus != selection != activation != hover`.

This strengthens the existing design-system invariant `Focus != selected != attention`.

### P7 — Large inventory collections need a collection interaction model before visual density tuning

WAI-ARIA layout grids are specifically useful for large interactive collections because only one contained item needs to participate in the page tab sequence while arrow keys navigate the collection. React Aria/Spectrum additionally demonstrates collection navigation, selection, async loading/infinite scrolling and tree/list behavior.

Candidate scale behavior for research/prototyping:

| Catalog size | Default browse candidate | Required support |
| ---: | --- | --- |
| ~20 | labeled grid/cards | categories + keyboard grid + inspector |
| ~100 | grid/list switch | search + filters + stable categories + recents/pinned |
| ~500 | list/search dominant; grid optional by category | virtualization/incremental materialization + saved filters + contextual ranking |
| ~2,000 | search/command/context insertion dominant | server/query-backed filtering, virtualization, bounded results, category counts only when disclosure-safe |

These are candidate thresholds for prototype testing, not fixed product constants.

Important consequence: **do not create 2,000 DOM focus stops** merely because 2,000 catalog identities exist.

### P8 — Grid/List mode is a presentation switch over one collection identity model

The inventory research proposed `GRID + LIST + DETAIL`. This round adds a stronger contract:

```text
CatalogCollection
  canonical item references
  query/filter/sort context
  selection keys
  focused key
  disclosure-qualified result metadata
        |
        +-- GridProjection
        +-- ListProjection
        +-- InspectorProjection
```

Switching Grid/List should preserve selection/focus identity where possible and must not create different eligibility, status or currentness truth.

`Grid item != List row != canonical item`.

They are representations of the same authorized catalog result.

### P9 — Stable regions and adaptive ranking must be explicitly separated

The inventory analogy becomes dangerous if AI/context ranking continuously moves everything.

Candidate catalog layout:

```text
STABLE REGION
  category tabs
  category order
  pinned/favorites
  explicit user organization

ADAPTIVE REGION
  suggested for current port
  recent
  likely next action
  context-ranked eligible items
```

Adaptive regions must be visibly labeled as adaptive and must not silently reorder stable landmarks.

`Recommendation rank != taxonomy order`.

`Suggested != required != authorized`.

### P10 — Contextual eligibility needs an explainable tri-state rather than hide/show only

For insertion points/ports, blindly hiding incompatible items can make the catalog feel incomplete and makes diagnosis difficult.

Candidate projection state:

```text
EligibilityProjection
  ELIGIBLE
  INELIGIBLE(reasonRef)
  UNKNOWN(needsQualification)
```

Browse policy may default to eligible candidates, but `Show all` can reveal ineligible/unknown items with explanation where disclosure permits.

Canonical validation still owns admissibility.

`EligibilityProjection != semantic validation result authority`.

This is especially important when compatibility depends on provider version, currentness, authority or unresolved evidence.

### P11 — n8n Canvas Groups provide a useful persistence split for SB projection state

Current n8n Canvas Groups persist group membership/name with the workflow while collapsed/expanded state is user/browser-local. This is useful evidence that **structural grouping and personal projection state should have separate persistence lifecycles**.

Candidate SB split:

```text
Canonical/declared structure
  semantic group/module/process membership where truly modeled

Shared saved projection
  team-defined view/group annotations where explicitly saved

User workspace preference
  expanded/collapsed, panel size, local isolate/focus

Ephemeral
  hover, drag preview, transient peek
```

Do not accidentally commit `collapsed=true` as architecture truth.

### P12 — Photoshop/Canva contextuality should operate on a stable action grammar

Photoshop's options/contextual task bar and Canva's selection-dependent edit panel support context-specific controls, but SB has many more semantic and authority states.

Candidate action derivation:

```text
ContextActions =
  StableVerbOrder
  ∩ SurfaceCapabilities
  ∩ SelectionApplicability
  ∩ ModeApplicability
  ∩ Disclosure
  ∩ QualifiedActionAvailability
```

Candidate stable verb families:

```text
OPEN / NAVIGATE
INSPECT
ADD / INSERT
CONNECT
GROUP
FILTER / FOCUS
COMPARE
CONFIGURE DRAFT
SIMULATE
PROPOSE
REVIEW
AUTHORIZE
ACT
VERIFY
```

Controls may disappear only when irrelevant or undisclosable; frequent actions should retain predictable ordering where present.

`Contextual != spatially random`.

### P13 — Budibase Blocks support progressive decomposition, but the navigation contract needs to preserve identity lineage

Budibase documents Blocks as compositions of Components and allows Eject to expose constituents. For SB, decomposition needs an identity/lineage rule so navigation does not appear to replace one canonical semantic object with unrelated children.

Candidate projection metadata:

```text
CompositionProjection
  compositionIdentity
  decompositionClass
  constituentIdentities[]
  presentationOnlyConstituents[]
  semanticOwnerIdentity?
  lineage/explanation
```

For `VISUAL_DECOMPOSABLE`, constituents may become direct editing targets. For `CONTROLLED_DECOMPOSABLE`, semantic constraints remain owned by the composition contract. For `SEMANTIC_ATOMIC`, the inspector may expose internals without offering arbitrary structural ejection.

### P14 — Primitive-base qualification should be collection-sensitive

Current shadcn evidence says Base UI is the default for new projects as of July 2026; React Aria is also first-class and Radix remains supported. This round found a concrete reason not to decide solely from simple primitives: SB has unusually demanding **collection** surfaces.

Candidate qualification split:

```text
SIMPLE PRIMITIVES
  button, checkbox, switch, dialog, popover, tabs, toolbar

COLLECTION PRIMITIVES
  combobox, listbox, grid/list, tree, treegrid/table,
  multi-selection, async/infinite collections, drag/drop

ENGINEERING SURFACES
  graph/canvas, topology, component tree, inventory,
  large inspectors/data grids
```

Radix provides strong primitive-level keyboard patterns such as roving tabindex in toolbar/toggle groups. React Aria/Spectrum has especially explicit collection semantics and current evidence for list/tree navigation, selection, async loading and accessible drag/drop. Base UI remains the shadcn-leading default candidate.

Therefore the next provider matrix must score **collection primitives separately from simple primitives**. A single default base remains preferred, but an exception boundary may be justified if a collection requirement cannot be met without substantial custom accessibility machinery.

`Default base != mandatory base at any cost`.

`Provider exception != ad-hoc provider soup`.

## Unified projection vocabulary candidate

```text
CANONICAL IDENTITY
  owned by canonical domain/system model

DISCLOSURE ENVELOPE
  what this subject/context may learn

NAVIGATION CONTEXT
  current user focus/navigation intent

VIEWPORT CONTEXT
  bounded semantic materialization request

SYSTEM SLICE
  projection taxonomy for a concern family

LENS
  cross-cutting qualified emphasis/overlay

WORKSPACE
  task-oriented arrangement of tools/surfaces/panels

SAVED VIEW
  persisted projection preferences, requalified on open

WORKSPACE PROJECTION
  rendered authorized/current result

CATALOG ITEM / NODE / CARD / ROW
  surface-specific representations of canonical identities

INSPECTOR
  details-on-demand projection for current selection/focus
```

No item in this vocabulary creates canonical business/system truth merely by existing in the UI.

## Candidate cross-surface transition

```text
1. INVENTORY
   user focuses/selects Capability X
       |
       v
2. NavigationContext.focusIdentity = X
       |
       v
3. MAP / SYSTEM SLICE
   materialize authorized containing/context identities
       |
       v
4. GRAPH
   materialize bounded authorized neighborhood of X
       |
       v
5. INSPECTOR
   details-on-demand for X under same revision/currentness context
```

At every step:

```text
identity resolution
+ authorization/disclosure
+ currentness/revision qualification
+ bounded materialization
```

The UI should provide a breadcrumb/history of semantic navigation so users can return to prior focus without relying on remembered canvas coordinates.

## Accessibility consequences

1. Inventory grid should use a collection navigation pattern appropriate to its interaction semantics rather than hundreds/thousands of independent tab stops.
2. Focus and selection must have distinct visible states.
3. Grid/List switching preserves the selected/focused canonical key where possible and announces meaningful view changes.
4. Tree/component hierarchy uses conventional expand/collapse keyboard semantics.
5. Context insertion has a non-drag path and an accessible destination/connection picker.
6. Adaptive suggestions cannot move keyboard focus when ranking updates.
7. Infinite/async loading must expose loading/current result state without focus loss.
8. Dense cards still respect target-size/spacing strategy; nested actions require deliberate keyboard behavior.
9. Inspector opening/closing must have deterministic focus restoration.
10. Map/graph has a non-spatial equivalent for relation navigation where spatial graph interaction is inaccessible or inefficient.

## Anti-patterns

1. **Four-source selection state** — Inventory, Map, Graph and Inspector each invent their own selected identity.
2. **Projection becomes ontology** — UI slices are treated as canonical architecture layers.
3. **Saved authorization snapshot** — reopening a saved view reveals identities that are no longer permitted.
4. **Adaptive shuffle** — recommendations continuously reorder stable catalog landmarks.
5. **Hide-all incompatibility** — users cannot discover why a component cannot connect.
6. **Tab-stop explosion** — every item in a huge virtual collection enters page tab order.
7. **Grid/list semantic drift** — the same item shows different status/eligibility depending on browse mode.
8. **Collapse becomes deletion** — hidden group members disappear from findings/dependency semantics.
9. **Provider-by-widget** — choosing primitive bases independently for every component without an exception policy.
10. **Graph-only relation access** — relations are inaccessible without pointer/spatial interpretation.

## Candidate decisions from this round

- **CANDIDATE:** formalize Inventory/Map/Graph/Inspector as surfaces over one shared navigation/focus contract.
- **CANDIDATE:** keep `ViewportContext` as the bounded materialization concept; navigation intent composes into it rather than replacing it.
- **CANDIDATE:** `System Slice` is a UI projection taxonomy, not a Master Blueprint architecture plane.
- **CANDIDATE:** Workspace and Saved View have different semantics and both requalify disclosure/currentness on reopen.
- **CANDIDATE:** explicitly separate focus, selection, primary semantic focus and activation.
- **CANDIDATE:** Grid/List/Inspector share one catalog collection identity model.
- **CANDIDATE:** stable taxonomy/pins are separated from adaptive suggestions/recent/context ranking.
- **CANDIDATE:** eligibility uses `ELIGIBLE / INELIGIBLE(reason) / UNKNOWN` projection rather than binary visual hide/show where disclosure permits.
- **CANDIDATE:** large catalogs use collection navigation + incremental/virtualized materialization rather than thousands of page tab stops.
- **CANDIDATE:** provider qualification matrix must score collection primitives separately from simple primitives.

## Proof obligations added by this round

1. Selecting identity X in Inventory and navigating through Map -> Graph -> Inspector never creates a second identity for X.
2. Cross-surface navigation re-evaluates authorization/disclosure/currentness rather than carrying stale visibility forward.
3. A System Slice can be changed without mutating canonical architecture ownership or lifecycle.
4. A Lens can change emphasis without silently changing membership/authorization.
5. Saved Views reopen safely after permission, revision and currentness changes.
6. Focus and selection remain distinguishable visually and programmatically in grid/list/tree/graph surfaces.
7. Grid/List switching preserves collection identity and selection semantics.
8. Adaptive ranking never steals focus or silently reorders stable user-defined landmarks.
9. Catalogs at high cardinality remain keyboard navigable without tab-stop explosion.
10. Ineligible/unknown connection candidates can expose qualified reasons without leaking unauthorized facts.
11. Collapsed/grouped projections preserve externally material findings, dependencies and currentness indicators.
12. A primitive-base exception requires documented coverage evidence and does not silently fork the design-system interaction contract.

## Maturity

`FRONTEND_PROJECTION_NAVIGATION = EMERGING / MATERIAL_DELTA`

This round materially reduces vocabulary ambiguity and makes the inventory/map/graph concept testable, but empirical SB prototype evidence is still absent.

## Next highest-value research gaps

1. Build the **primitive-base qualification matrix** for Base UI vs Radix vs React Aria, explicitly separated into simple primitives, collection primitives and engineering-surface requirements.
2. Define a conceptual **large-catalog benchmark/prototype matrix** at ~20 / 100 / 500 / 2,000 items with tasks for browse, known-item retrieval, contextual insertion, compare, multi-select and cross-surface navigation.
3. Research graph/canvas accessibility and non-spatial relation navigation deeply enough to define a minimum equivalent relation surface.
4. Define docking/panel persistence boundaries: shared workspace preset vs team view vs user preference vs ephemeral state.
5. Define the minimum UI Lab proof matrix for Grid/List/Tree/Combobox/Inspector/Toolbar/Resizable across theme, density, locale/RTL, keyboard and reduced motion.
