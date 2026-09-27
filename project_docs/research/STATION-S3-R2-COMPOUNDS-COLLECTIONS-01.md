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

## Repository relation census — fresh main

### ButtonGroup
Current `ui-core` ButtonGroup is a `div` with `role="group"`, `data-slot="button-group"` and visual inline-flex layout. It owns no roving focus, selection, active item, expansion, ordering mutation or command authority.

Classification: **C2 Compound**, not C3 Collection. Its current proof delta is grouping/anatomy + child/slot compatibility. Promotion to C3 would require a new reusable child relation/state machine; adding domain naming or styling is insufficient.

### CollectionIndex / SelectionState
`station-interaction/selection.ts` currently owns only:
- ordered `items` plus `byRef` lookup;
- duplicate-ref rejection during index creation;
- `SelectionState.selectedRef` as a single nullable ref;
- fail-closed `selectKnownRef` for unknown refs.

It does **not** model focus, active/highlighted item, multiple/range selection, expansion, navigation, dismissal or restoration.

Finding: do not overload `selectedRef` into a generic current-item state. R2 should treat current `SelectionState` as a bounded single-selection contract and preserve future focus/active/expansion as orthogonal relations. This is a contract gap, not authorization to mutate it during research.

### Tree
Current `ui-core/Tree` owns real C3 behavior: hierarchical nodes, visible flattening based on expansion, `tree/treeitem` semantics, `aria-level`, `aria-selected`, `aria-expanded`, roving `tabIndex`, ArrowUp/Down/Home/End traversal and ArrowLeft/Right expansion/collapse.

Important mismatch: keyboard traversal currently calls `select(target.ref)` rather than moving a separately modeled focus/active cursor. Therefore focus/navigation and selection are coupled in the implementation. This is not automatically wrong for every single-select tree, but it is insufficient as the generic Collection grammar because benchmarks independently demonstrate cases where focus, selection and active state diverge.

Classification: **C3 Collection implementation with a bounded coupling gap**. Preserve it; do not rebuild Tree. Future grammar must either declare the coupling as an explicit Tree policy or introduce orthogonal focus/navigation ownership where required by accepted semantics.

### MenuSurface
Remains a surface/compound until item collection, navigation/focus ownership, activation, dismissal and focus restoration are owned and proven. Do not promote based on `role` or visual similarity alone.

### Toolbar / Tabs / Table / List
No generic Station-owned C3 contract was established by this bounded census. Absence is recorded as `unproven-gap`, not proof that implementation is required. R2 should promote only relations justified by concrete Station use and synthesis.

## C2 → C3 promotion boundary

**C2 Compound**: composes children/anatomy and may own bounded grouping/slot/cardinality rules, but does not own a cross-child interaction state machine.

**C3 Collection**: owns at least one reusable cross-child semantic relation/state machine whose correctness requires independent proof, such as traversal/focus ownership, selection policy, active-item policy, expansion hierarchy, typeahead, ordered mutation, dismissal/restoration, or contextual child-interaction arbitration.

A C3 Collection inherits C1/C2 proofs and proves only its relation delta. Visual grouping, domain naming, border/layout, responsive relocation or wrapper reuse do not promote identity.

## Promotion/dedup tests

A wrapper does NOT become C2/C3 merely because it contains children, has a border, uses flex/grid, has a domain name, or relocates children responsively.

Promotion is justified when the wrapper owns at least one reusable child relation with independent proof obligations. Consequences:
- ButtonGroup remains C2 while it only groups children.
- Toolbar becomes C3 only when it owns traversal/focus or another cross-child relation.
- Tree is C3 because it owns hierarchy, traversal and expansion/selection relations.
- MenuSurface remains only a surface until Menu owns its interaction machine.
- responsive overflow is a projection of the same semantic children/commands, not a second collection identity by default.

## Proof Grammar — R2 delta

Inherited C1 primitive proofs are not repeated.

| Obligation | Evidence state | Notes |
|---|---|---|
| C2 grouping/anatomy | proven implementation / proof breadth partial | ButtonGroup owns `role=group` + stable slot; semantic child compatibility remains gap |
| CollectionIndex duplicate-ref rejection | proven by implementation; executable proof must be mapped before closure | deterministic invariant |
| unknown-ref selection fail-closed | proven by implementation; executable proof previously identified in R1 | preserve state on invalid ref |
| child compatibility/cardinality | unproven-gap | reject semantically invalid nesting, not only invalid render types |
| focus ownership | unproven-gap | exactly one owner per interaction context; delegation explicit |
| roving traversal | implementation exists in Tree; executable evidence gap | Arrow/Home/End behavior must be proven without re-proving primitives |
| focus != selection != active | failed as generic abstraction / gap exposed | current Tree traversal couples navigation to selection; generic grammar must not assume equivalence |
| expansion relation | implementation exists; executable evidence gap | Tree owns hierarchical expansion delta |
| embedded interactive child arbitration | unproven-gap | collection keys must not steal child editing/navigation |
| dismissal/focus restoration | unproven-gap | Menu/transient collections only |
| representation invariance | unproven-gap | visible/overflow/alternate projection preserves semantic command/item identity |
| primitive semantics | inherited | do not retest Button/Input semantics wholesale |
| Station/Core command boundary | inherited proven | collection must not acquire business authority |

`failed as generic abstraction` above does not mean the current Tree product behavior is declared defective. It means the hypothesis that one `selectedRef` can stand for focus + active + selection across the reusable grammar is contradicted by the required semantic breadth and benchmark evidence.

## Proof inheritance rule

C2 inherits child primitive role/name/activation proofs and adds only composition/anatomy/compatibility delta. C3 inherits C2 + child primitive proofs and adds only cross-child relation/state-machine proofs. A lower-level `unproven-gap` remains a gap; inheritance never upgrades it to PASS.

## Failure/recovery implications

Collection state and command execution are separate. A selected/active item may become stale or unavailable before activation. Invocation must revalidate command availability/authority at execution time; failed/partial effects must not be represented as successful merely because collection selection succeeded. Retry/compensation belongs to command/capability/effect contracts where applicable, not Tree/Menu selection state.

## Inspector implications

A contract-driven Inspector should derive fields from relations actually owned. Selecting ButtonGroup should expose grouping/slot constraints but not fake selection/expansion controls. Selecting Tree may expose selection, expansion and navigation policies. This provides a concrete anti-hardcode test for the future Inspector schema.

## Dedup / adoption disposition

- **own**: Station C2/C3 semantic contracts, relation ownership, proof inheritance, source-owned Tree/selection contracts.
- **adapt**: mature roving-focus, tree/menu/toolbar interaction patterns where Station semantics require them.
- **adopt-pattern**: explicit separation of focus/selection/active/expansion; contextual navigation arbitration; responsive projection preserving semantic identity.
- **defer**: generic Toolbar/Tabs/Table/List/Menu construction until a later research finding demonstrates a real grammar gap and synthesis promotes it.

## R2 sufficiency gaps

R2 cannot close yet because the following remain material:
1. map existing composition slot/cardinality validators to semantic child compatibility;
2. map executable tests for CollectionIndex/SelectionState and Tree rather than inferring PASS from code;
3. determine contextual arbitration for interactive descendants;
4. benchmark higher-complexity editor/workstation collections (Figma/Webflow/Framer and VS Code/JetBrains) only against these open questions;
5. produce an R2 exit matrix and handoff to R3 Interaction Capabilities without constructing product.

## Gate

S3-R2 remains `IN_PROGRESS` research only. Construction, Studios and AI/MCP foundation work remain blocked until R1→R7→synthesis and explicit Construction materialization.
