# G4 — Frontend Selection & Projection Handoff Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Specify a provider-neutral interaction contract for preserving user orientation when the same canonical identity is traversed across Inventory, ComponentTree, RelationTable, Graph/Canvas, Inspector and other specialized System Builder work surfaces.

This is research only. It does not authorize implementation, provider adoption, WBS, Work Packages, Sprints, TASKs, migrations or product changes.

## Evidence classes

Primary evidence reviewed in this round:

- W3C WAI-ARIA APG keyboard-interface, Tree, Grid/Treegrid, Combobox and Dialog focus-management guidance;
- React Aria / React Spectrum focus restoration, collection navigation and client-side routing guidance;
- Adobe Photoshop workspace and Contextual Task Bar documentation;
- Budibase Component Tree and Blocks/Eject documentation;
- Canva editor side/edit panel, mode-switching and screen-reader keyboard-navigation documentation;
- n8n documentation on data mapping/node references and permission-qualified node editing;
- existing G4 `ViewportContext`, `DisclosureEnvelope`, projection-navigation and collection-contract research.

The four benchmark products remain interaction-grammar references, not visual authorities or technology selections.

## Material finding H1 — selection is a bundle of distinct states

A single global `selectedId` is insufficient for an engineering workspace. WAI-ARIA guidance repeatedly distinguishes DOM focus from selection; composite widgets also commonly restore their last internal focus when re-entered. The SB additionally needs to distinguish canonical identity, active tool, projection focus and multi-selection.

Candidate research vocabulary:

```text
SelectionContext
  primaryIdentity?
  selectedIdentities[]
  focusIdentity?
  activeTool?
  activeSurface
  activeWorkspace
  semanticScope
  activeLenses[]
  mode                 # EXPLORE/DESIGN/SIMULATE/...
  revision/currentness
  disclosureEnvelope
  authorizationContext
  origin               # user/search/graph/table/AI/etc.
```

Invariants:

- `Focus != selection != active tool != attention != authority`.
- `Primary identity != sole selected identity`.
- `Selection persistence != permission persistence`.
- `Projection state != canonical state`.
- changing visual focus cannot silently mutate canonical selection when the surface contract says otherwise.

## Material finding H2 — ProjectionHandoff must preserve identity, not coordinates

When moving between Inventory, Tree, RelationTable, Graph and Inspector, the durable handoff unit should be semantic identity plus qualified context, not pixel position, row index or transient DOM identity.

Candidate handoff:

```text
ProjectionHandoff
  sourceSurface
  targetSurface
  canonicalIdentity
  relationIdentity?
  semanticScope
  activeLenses[]
  mode
  revision/currentness
  disclosureEnvelope
  authorizationContext
  requestedPresentation?
  returnAnchor
```

The target surface resolves its own representation:

```text
canonical identity
  -> authorization/disclosure qualification
  -> target projection query
  -> materialize or explain inability
  -> focus/announce target
```

`Same identity across surfaces != same representation`.

`Navigation continuity != coordinate continuity`.

## Material finding H3 — return anchors are first-class UX state

APG composite guidance supports returning focus to the previously focused member of a composite, while modal-dialog guidance returns focus to the invoking element when the dialog closes. React Aria FocusScope has explicit focus-restoration behavior. These patterns generalize to the Builder: after drilling from a list/tree/graph into a deep inspector or dedicated tool, Back/Close should restore a meaningful point of regard rather than merely route to a page.

Candidate `ReturnAnchor`:

```text
ReturnAnchor
  sourceSurface
  sourceIdentity
  sourceCollectionIdentity?
  sourceFocusIdentity?
  sourceQuery/filter/sort snapshot?
  sourceSemanticScope
  sourceExpansionContext?
  fallbackPolicy
```

Fallback order when the exact element no longer exists/materializes:

1. same canonical identity in the source projection if still admissible;
2. nearest admissible parent/group/collection anchor;
3. source surface heading/primary collection;
4. stable workspace landmark with an explanatory announcement.

Never focus a detached/hidden DOM node or silently jump to an unrelated item.

## Material finding H4 — browser history and workspace history are related but not identical

React Spectrum routing guidance shows selection can be synchronized with URL-backed navigation. For the SB, deep links should encode stable semantic navigation where useful, but transient focus, hover, panel width and arbitrary canvas coordinates should not pollute browser history.

Candidate split:

```text
URL / shareable navigation state
  system/workspace/tool
  semantic identity or query
  stable lens/projection when disclosure-safe
  revision when intentionally pinned

Workspace ephemeral state
  focus identity
  hover
  open menus
  local panel widths
  scroll offsets
  transient graph coordinates
  temporary expansion details
```

A Back action may therefore restore both a semantic route and a local `ReturnAnchor` when available.

Security rule: saved/deep-linked identities and filters are requalified under the current `DisclosureEnvelope`; a URL is never an authorization grant.

## Material finding H5 — not-materialized and no-longer-admissible are different states

A selected identity may disappear from the current DOM because of virtualization, filtering, semantic zoom, lazy loading or a projection change while remaining canonically valid and authorized. Conversely, authorization/currentness may change so the identity is no longer admissible to disclose or act upon.

Candidate dispositions:

```text
PRESENT
  identity is materialized and admissible

NOT_MATERIALIZED
  canonically addressable/admissible but outside current materialization window

FILTERED_OUT
  admissible but excluded by current user/query filter

COLLAPSED
  admissible but represented by an aggregate/parent

STALE_REFERENCE
  identity/revision reference exists but currentness requires requalification

NO_LONGER_ADMISSIBLE
  current disclosure/authorization forbids revealing it

NOT_FOUND_OR_UNDISCLOSABLE
  safe external disposition when distinguishing absence from denial would leak information
```

The UI must not equate `not rendered` with `absent`, consistent with the existing G4 disclosure model.

For `NOT_MATERIALIZED`, the surface may fetch/reveal the identity or offer `Reveal in context`. For `NO_LONGER_ADMISSIBLE`, it must clear actionable state and use a disclosure-safe explanation; it must not preserve stale inspector contents as if still authorized.

## Material finding H6 — multi-selection needs a primary identity and bounded cross-surface semantics

Engineering operations often select multiple nodes/rows/components. Cross-surface navigation should not assume every target surface can meaningfully represent the entire set.

Candidate rules:

- retain `selectedIdentities[]` only while each retained identity remains admissible;
- designate one `primaryIdentity` for Inspector/contextual actions;
- a target surface declares whether it supports `SINGLE`, `MULTI`, or `SUMMARY` projection;
- when MULTI -> SINGLE, preserve the set in workspace context only if safe, but visually expose that the target shows the primary item;
- bulk actions require explicit eligible-set computation; partial eligibility is not silently coerced;
- focus movement alone does not mutate a multi-selection unless the component's declared selection model says so.

## Material finding H7 — contextual actions follow selection, but authority never does

Photoshop's Contextual Task Bar dynamically exposes actions based on current selection/tool and Canva similarly exposes selected-element toolbar/edit-panel options. This is strong evidence for the SB grammar:

```text
select
  -> quick/contextual actions
  -> optional deep Inspector
  -> dedicated tool when complexity warrants
```

However:

```text
Action visibility
  != action eligibility
  != permission
  != approval
  != execution
  != effective outcome
```

Contextual actions should be derived from `SelectionContext + mode + disclosure + eligibility`, while canonical authorization and semantic validation remain outside the presentation layer.

A disabled action may explain why when disclosure permits. Hidden actions should be reserved for cases where showing their existence would leak information or create unusable clutter.

## Material finding H8 — Graph and RelationTable share traversal identity but not interaction grammar

Graph/Canvas can optimize spatial comprehension; RelationTable provides the mandatory non-spatial peer established by prior research. A handoff between them should preserve source/relation/target identity and lens context while each surface applies its own keyboard model.

Example:

```text
Graph edge selected:
  source = Capability A
  relation = depends_on
  target = Provider B

Open in RelationTable
  -> focus matching relation row
  -> primary identity remains relation or declared endpoint
  -> Inspector synchronizes without changing authority

Open target
  -> ProjectionHandoff(targetIdentity=Provider B)
  -> target surface resolves Provider B under current disclosure/currentness
```

A graph edge with no equivalent inspectable relation identity is a research smell for decision-relevant relations.

## Material finding H9 — specialized surfaces should expose stable landmarks

Canva documents explicit keyboard paths between editor toolbar and canvas, while APG composite guidance minimizes global Tab stops and uses internal navigation within composites. For the SB shell, stable workspace landmarks should let keyboard and assistive-technology users jump between major regions without traversing every tool/item.

Candidate landmark/navigation regions:

```text
GLOBAL / APP BAR
TOOLBOX / INVENTORY
CONTEXTUAL OPTIONS
PRIMARY WORK SURFACE
LAYERS / TREE
RELATIONS
INSPECTOR / PROPERTIES
EVIDENCE / HISTORY
STATUS / ACTIVITY
```

The exact shortcut scheme is unresolved. It must avoid browser/OS/assistive-technology conflicts and remain discoverable/remappable where appropriate.

## Benchmark translation

### Photoshop

Current primary documentation confirms Application bar, Tools panel, central document window, Options bar, grouped/stacked panels and a Contextual Task Bar that adapts to the current selection/tool. Translation: stable shell, contextual action derivation and persistent work surface are strong candidates; Photoshop layer z-order semantics must not be generalized to SB system layers.

### Budibase

The Component Tree exposes nested composition and searchable components; Blocks encapsulate multiple components and can be Ejected to reveal constituents. Translation: projection handoff between composed block and constituent tree should preserve identity/decomposition context. Eject remains an explicit structural action, not an implicit consequence of inspection.

### n8n

Current documentation confirms data can be referenced from previous named nodes and mapped by dragging from INPUT into node parameters; node editing can also be permission-qualified when credentials are not shared. Translation: graph adjacency/data availability and edit authority are distinct. Selection/navigation may reveal a relation without granting permission to edit its endpoints.

### Canva

Current editor guidance exposes a side panel, selection-dependent edit panel, mode switching, contextual/floating actions, and explicit keyboard movement to editor toolbar/canvas. Translation: progressive disclosure and stable region navigation are strong candidates; contextual convenience must preserve non-pointer access.

## Accessibility proof obligations

Any future prototype of `SelectionContext / ProjectionHandoff` must demonstrate:

- visible focus distinct from selection and attention;
- one sensible Tab stop per composite where applicable;
- deterministic focus restoration after Inspector/dialog/dedicated-tool exit;
- safe fallback when the return target is removed, filtered, virtualized or unauthorized;
- keyboard-only traversal Inventory -> Surface -> Relations -> Inspector -> back;
- screen-reader announcement of target identity, surface change and important disposition changes;
- no drag requirement for reveal/connect/reparent/traverse actions;
- no color-only encoding of selection/currentness/eligibility;
- no hidden-item leak through counts, history labels, breadcrumbs or restored inspector contents;
- 200%/400% zoom/reflow without losing the alternate navigation path;
- reduced-motion equivalence;
- RTL/long-label behavior before API freeze.

## Risks / anti-patterns

- one global `selectedId` controlling every surface;
- selection follows focus everywhere;
- preserving pixel coordinates instead of semantic identity;
- browser history entry for every hover/focus/pan/zoom;
- returning focus to a removed or unauthorized element;
- keeping stale Inspector data after disclosure changes;
- assuming virtualization means deletion;
- silently dropping multi-selection during surface transition;
- contextual toolbar exposing actions based only on visual type rather than mode/eligibility;
- deep links treated as permission tokens;
- Graph-only traversal for decision-relevant relations;
- shortcut schemes that collide with browser/OS/assistive technology without fallback.

## Candidate decisions after this round

1. Introduce `SelectionContext` and `ProjectionHandoff` as provider-neutral research contracts; do not bind them to a React state library or router.
2. Preserve canonical identity, semantic scope, lens/mode and qualified currentness/disclosure across projection transitions; do not preserve arbitrary coordinates as semantics.
3. Treat `ReturnAnchor` and focus restoration as part of navigation correctness, not polish.
4. Distinguish `NOT_MATERIALIZED`, `FILTERED_OUT`, `COLLAPSED`, stale reference and disclosure-safe no-longer-admissible outcomes.
5. Keep URL/shareable semantic navigation separate from ephemeral workspace focus/layout state.
6. Require each surface to declare single/multi/summary selection support.
7. Derive contextual actions from selection/context while keeping semantic validation and authority external to UI state.
8. Keep RelationTable as the non-spatial peer of Graph and preserve relation identity when crossing between them.

## Effect on the frontend foundation plan

This round refines, rather than replaces, the existing stable-shell/specialized-surface hypothesis. The future shell/navigation layer now needs explicit contracts for:

- canonical identity continuity across surfaces;
- focus/selection separation;
- return anchors and focus restoration;
- shareable semantic navigation vs ephemeral workspace state;
- materialization/admissibility dispositions;
- multi-selection projection support;
- disclosure-safe contextual actions.

These obligations should be treated as prerequisites before freezing Graph, Tree, Inventory, Inspector or router APIs.

## Maturity

`FRONTEND_SELECTION_PROJECTION_HANDOFF = EMERGING / MATERIAL_DELTA`

Not saturated. No implementation authority is granted.

## Next highest-value gap

Research the **Layers/Lenses panel contract** against Photoshop Layers and the existing G4 `LensDefinition`/`DisclosureEnvelope`: formally separate System Layer, Lens, Projection, Deployment Layer, Data Layer and Semantic Owner; qualify visible/hidden, focus, solo/isolate, lock editing, emphasis/opacity, revision/currentness, findings, expand/collapse, filter and `open dedicated tool`; explicitly determine where ordering has semantic meaning and where arbitrary reordering must be prohibited. In parallel, test whether contextual actions remain coherent when one identity is projected simultaneously in Graph, RelationTable and Inspector under changed currentness/authorization.