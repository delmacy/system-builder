# Station S3-R2 — Compounds & Collections 01

Date: 2026-09-27
Base: fresh `main@88e47f4b8f266b84b66c95865fc3bfc86d835778`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Question

What must distinguish a compound/collection from a mere visual grouping, and what proof delta justifies promotion above C1 primitives without duplicating semantic command or business authority?

## Station starting point

R1 established existing Button/IconButton/Toggle/ButtonGroup/Tree/MenuSurface implementations and reusable presentation-command/selection contracts. R2 therefore studies missing relations and proof deltas rather than inventing a parallel component stack.

## Independent benchmark convergence

### Radix

Dropdown Menu separates Trigger, Content, Item, Group, Label, checkbox/radio items and submenu triggers. Its collection owns managed focus, roving tabindex, keyboard navigation, typeahead, dismissal and focus restoration. Toolbar separately groups controls and owns roving focus/navigation while allowing another primitive's Trigger to compose through the toolbar surface. ToggleGroup similarly adds group traversal over individual toggles.

Finding: a collection is not justified by shared styling; it is justified by a reusable relation/state machine among children. `Toolbar.Button asChild DropdownMenu.Trigger` is strong evidence that group-navigation semantics and menu-trigger semantics can compose without merging identities.

### React Spectrum / React Aria

TreeView distinguishes navigation behavior from child interaction. Arrow-key collection navigation may be switched to Tab-oriented navigation when rows contain interactive descendants, preventing collection navigation from stealing keys needed by embedded controls.

Finding: child compatibility is contextual. A slot/collection contract must be able to state which child interaction model is admissible and which navigation owner wins for a key/focus context.

### MUI Tree View

Tree View exposes explicit keyboard/accessibility guidance and distinguishes single, multi, range and checkbox selection. Selection policy is therefore not equivalent to focus or expansion.

Finding: `focusedRef`, `activeRef`, `selectedRefs` and `expandedRefs` must not be collapsed into one generic `current` state in a collection grammar.

### Webflow

Component instances preserve main-component structure while props alter bounded instance values; slots are explicit placeholders for child components; variants alter predefined presentation/layout without requiring separate component identities.

Finding: Station should keep definition, instance, slot compatibility and variant/presentation dimensions distinct. Instance customization alone is not promotion to a new component type.

## Candidate C2/C3 grammar

A compound/collection candidate should expose only the relations it owns:

- `children/slots`: structural admissibility and cardinality;
- `ordering`: canonical/visible order;
- `focusModel`: none | contained | roving | delegated;
- `selectionModel`: none | single | multiple | range/extended;
- `activeModel`: optional active/highlighted item distinct from focus/selection;
- `expansionModel`: none | hierarchical;
- `activationModel`: delegated to child or collection-owned;
- `navigationModel`: orientation, traversal keys, Home/End, typeahead where applicable;
- `dismissal/restoration`: only for transient collections such as Menu;
- `responsiveProjection`: representation policy that preserves semantic identities.

These names are research vocabulary, not schema authority.

## Promotion/dedup tests

A wrapper does NOT become C2/C3 merely because it contains children, has a border, uses flex/grid, has a domain name, or relocates children responsively.

Promotion is justified when the wrapper owns at least one reusable child relation with independent proof obligations: roving focus; selection policy; active-item policy; expansion hierarchy; semantic child compatibility; ordered traversal; dismissal/restoration; or another reusable collection state machine.

Consequences:
- ButtonGroup without owned navigation/selection may remain a visual/semantic grouping compound rather than a full collection.
- Toolbar is collection-like when it owns roving focus/navigation across controls.
- Tree is C3 because it owns hierarchy, traversal, selection/expansion relations.
- MenuSurface remains only a surface until Menu owns item collection + focus + activation + dismissal/restoration.
- responsive overflow is a projection of the same semantic children/commands, not a second collection identity by default.

## Proof Grammar — R2 delta

Inherited C1 primitive proofs are not repeated. Candidate R2 obligations:

| Obligation | Evidence state | Notes |
|---|---|---|
| child compatibility/cardinality | unproven-gap | must reject semantically invalid nesting, not only invalid render types |
| focus ownership | unproven-gap | exactly one owner per interaction context; delegation must be explicit |
| roving traversal | unproven-gap for Station Tree/Toolbar grammar | Arrow/Home/End + orientation/RTL where applicable |
| focus != selection != active | unproven-gap | prove independent transitions and projections |
| expansion relation | unproven-gap | hierarchy delta only; inherit selection validity |
| embedded interactive child arbitration | unproven-gap | collection keys must not steal child editing/navigation |
| dismissal/focus restoration | unproven-gap | Menu/transient collections only |
| representation invariance | unproven-gap | visible/overflow/alternate projection preserves semantic command/item identity |
| primitive semantics | inherited | do not retest Button/Input semantics wholesale |
| Station/Core command boundary | inherited proven | collection must not acquire business authority |

## Failure/recovery implications

Collection state and command execution are separate. A selected/active item may become stale or unavailable before activation. Invocation must revalidate command availability/authority at execution time; failed/partial effects must not be represented as successful merely because collection selection succeeded. Retry/compensation belongs to the command/capability/effect contract where applicable, not to Tree/Menu selection state.

## Inspector implications

A contract-driven Inspector should derive collection fields from the relations actually owned. Selecting a Tree may expose selection/expansion/navigation contracts; selecting a simple visual group should not expose those controls. This is a concrete test for avoiding hardcoded feature inspectors.

## R2 next questions

1. Map current Station `Tree`, `ButtonGroup`, any toolbar/list/table/tab/menu implementations to the candidate relation matrix.
2. Determine whether current `CollectionIndex`/`SelectionState` already separate focus/active/selection/expansion or need bounded contract gaps.
3. Benchmark Figma/Webflow/Framer collection/nesting constraints and VS Code/JetBrains tree/list/toolbar behavior for higher-complexity convergence.
4. Derive exact proof obligations and inherited proofs per existing candidate; no implementation during research.
5. Decide which relations belong C2 compound versus C3 collection before R2 closure.

## Gate

S3-R2 is `IN_PROGRESS` research only. Construction, Studios and AI/MCP foundation work remain blocked until R1→R7→synthesis and explicit Construction materialization.