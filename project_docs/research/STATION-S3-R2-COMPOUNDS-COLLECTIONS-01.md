# Station S3-R2 — Compounds & Collections 01

Date: 2026-09-27
Base: research branch from `main@88e47f4b8f266b84b66c95865fc3bfc86d835778`; revalidated against fresh `main@6fd82b0b0d1835e6f8b19bab59debe393999beec`
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

### VS Code — workbench arbitration and contextual command availability
VS Code exposes commands independently from their UI projections and uses context/`when` clauses to determine when commands, keybindings, menus and views are enabled. Its accessibility model also treats workbench parts, toolbars and tab lists as focus scopes: Tab reaches the group while arrow keys traverse within a toolbar/tab list, and F6/Shift+F6 move among workbench parts.

Finding: collection navigation ownership should be contextual rather than globally attached to a visual container. Command availability remains a command/context concern; collection focus does not grant command authority. A collection may own traversal within its scope while activation still resolves through the same semantic command and revalidates conditions.

### JetBrains workstations — focus restoration and projection independence
JetBrains tool windows are independently showable/hideable/movable/detachable workbench regions. Escape can return focus from a tool window to the editor, F12 can return to the last tool window, and actions exposed in a tool-window toolbar are commonly also available from menus/context menus/shortcuts. Tree/list/table tool windows additionally support keyboard-oriented navigation/search.

Finding: focus location and action projection are separate state dimensions. Moving an action among toolbar/menu/context/shortcut surfaces should not create a second action identity. Workbench focus restoration is a region/workspace concern above the primitive action itself, supporting the Station separation between collection relation ownership and command authority.

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

## Repository relation census — fresh-main revalidation

### ButtonGroup
Current `ui-core` ButtonGroup is a `div` with `role="group"`, `data-slot="button-group"` and visual inline-flex layout. It owns no roving focus, selection, active item, expansion, ordering mutation or command authority.

Classification: **C2 Compound**, not C3 Collection. Its current proof delta is grouping/anatomy + child/slot compatibility. Promotion to C3 would require a new reusable child relation/state machine; adding domain naming or styling is insufficient.

### Existing composition compatibility proofs
Fresh-main product tests prove more than the first R2 census credited:
- named slots reject duplicate slot identity;
- slot placement enforces accepted component family and layout metadata;
- child `allowedParentFamilies` participates in compatibility;
- ButtonGroup exposes five deterministic named slots and rejects non-atomic children;
- placement remains discrete-span based and independent of pixel/window geometry;
- graph validation reports duplicate refs, invalid placement, unknown component refs and dangling parent refs deterministically.

Reclassification: **structural child compatibility is PROVEN for the existing descriptor vocabulary**. This does not prove semantic interaction compatibility (for example, whether an embedded editable control may safely participate in a roving-focus collection). That narrower interaction-compatibility obligation remains `unproven-gap`.

### CollectionIndex / SelectionState
`station-interaction/selection.ts` currently owns only ordered `items` plus `byRef` lookup, duplicate-ref rejection during index creation, `SelectionState.selectedRef` as a single nullable ref, and fail-closed `selectKnownRef` for unknown refs. It does not model focus, active/highlighted item, multiple/range selection, expansion, navigation, dismissal or restoration.

Historical TASK-611 acceptance required deterministic collection normalization/query, known-ref selection/clear, safe rejection/no-op for unknown refs, stable identity independent of position, and separation from Station window focus. Source inspection confirms the implementation invariants.

**Executable-evidence census (2026-09-27):** bounded repository code searches for `selectKnownRef`/`CollectionIndex` test usage and for SelectionState unknown-ref assertions returned no executable test hit on fresh default-branch search. This is evidence of a searched coverage gap, not proof that no test can exist anywhere. Status remains `implementation/task evidence + executable unproven-gap`; absence is never PASS.

Finding: do not overload `selectedRef` into a generic current-item state. Treat current `SelectionState` as a bounded single-selection contract and preserve future focus/active/expansion as orthogonal relations. This is a contract gap, not authorization to mutate it during research.

### Tree
Current `ui-core/Tree` owns real C3 behavior: hierarchical nodes, visible flattening based on expansion, `tree/treeitem` semantics, `aria-level`, `aria-selected`, `aria-expanded`, roving `tabIndex`, ArrowUp/Down/Home/End traversal and ArrowLeft/Right expansion/collapse.

Historical TASK-612 required stable identity, deterministic expansion, accessible keyboard navigation/selection and safe empty/unknown refs while consuming TASK-611 selection rather than creating parallel authority. Source behavior aligns with that intent.

**Executable-evidence census (2026-09-27):** bounded repository search for Tree keyboard assertions using ArrowDown/ArrowRight/`aria-expanded` + test vocabulary returned no executable hit on fresh default-branch search. Therefore keyboard traversal/focus/expansion remains `implementation present + executable unproven-gap`; the research does not infer PASS from implementation.

Important mismatch: keyboard traversal currently calls `select(target.ref)` rather than moving a separately modeled focus/active cursor. Therefore focus/navigation and selection are coupled in the implementation. This is not automatically wrong for every single-select tree, but it is insufficient as the generic Collection grammar because benchmarks independently demonstrate cases where focus, selection and active state diverge.

Classification: **C3 Collection implementation with a bounded coupling gap**. Preserve it; do not rebuild Tree. Future grammar must either declare the coupling as an explicit Tree policy or introduce orthogonal focus/navigation ownership where required by accepted semantics.

### MenuSurface
Remains a surface/compound until item collection, navigation/focus ownership, activation, dismissal and focus restoration are owned and proven. Do not promote based on `role` or visual similarity alone.

### Toolbar / Tabs / Table / List
No generic Station-owned C3 contract was established by this bounded census. Absence is `unproven-gap`, not proof that implementation is required. Promote only relations justified by concrete Station use and synthesis.

## C2 → C3 promotion boundary

**C2 Compound** composes children/anatomy and may own bounded grouping/slot/cardinality rules, but does not own a cross-child interaction state machine.

**C3 Collection** owns at least one reusable cross-child semantic relation/state machine whose correctness requires independent proof, such as traversal/focus ownership, selection policy, active-item policy, expansion hierarchy, typeahead, ordered mutation, dismissal/restoration, or contextual child-interaction arbitration.

C3 inherits C1/C2 proofs and proves only its relation delta. Visual grouping, domain naming, border/layout, responsive relocation or wrapper reuse do not promote identity.

## Promotion/dedup tests

A wrapper does NOT become C2/C3 merely because it contains children, has a border, uses flex/grid, has a domain name, or relocates children responsively. Promotion requires at least one reusable child relation with independent proof obligations.

Consequences: ButtonGroup remains C2 while it only groups children; Toolbar becomes C3 only when it owns traversal/focus or another cross-child relation; Tree is C3 because it owns hierarchy, traversal and expansion/selection relations; MenuSurface remains only a surface until Menu owns its interaction machine; responsive overflow is a projection of the same semantic children/commands, not a second collection identity by default.

## Proof Grammar — R2 delta

Inherited C1 primitive proofs are not repeated.

| Obligation | Evidence state | Notes |
|---|---|---|
| C2 grouping/anatomy | proven | ButtonGroup role/grouping plus deterministic descriptor slots |
| structural slot compatibility | proven | product tests enforce family/layout/allowed-parent compatibility and reject non-atomic ButtonGroup children |
| discrete placement / geometry separation | proven | span validation exists; nested composition does not import pixel WindowGeometry |
| CollectionIndex duplicate-ref rejection | implementation/task evidence; executable unproven-gap | bounded test search found no direct executable hit |
| unknown-ref selection fail-closed | implementation/task evidence; executable unproven-gap | bounded test search found no direct executable hit |
| semantic interaction child compatibility | unproven-gap | structural compatibility is not enough for keyboard/focus arbitration |
| focus ownership | unproven-gap | exactly one owner per interaction context; delegation explicit |
| roving traversal | implementation exists in Tree; executable unproven-gap | bounded keyboard-test search found no direct hit |
| focus != selection != active | failed as generic abstraction / gap exposed | current Tree traversal couples navigation to selection; generic grammar must not assume equivalence |
| expansion relation | implementation exists; executable unproven-gap | Tree owns hierarchical expansion delta but direct test evidence was not located |
| embedded interactive child arbitration | unproven-gap | collection keys must not steal child editing/navigation |
| contextual command availability | inherited/adopt-pattern | command authority remains separate |
| dismissal/focus restoration | unproven-gap for transient collections | explicit restoration semantics required when promoted |
| representation invariance | unproven-gap | toolbar/menu/context/shortcut/overflow projection must preserve semantic command/item identity |
| primitive semantics | inherited | do not retest Button/Input semantics wholesale |
| Station/Core command boundary | inherited proven | collection must not acquire business authority |

`failed as generic abstraction` does not declare current Tree defective. It rejects the hypothesis that one `selectedRef` can universally stand for focus + active + selection across the reusable grammar.

## Proof inheritance rule

C2 inherits child primitive role/name/activation proofs and adds only composition/anatomy/compatibility delta. C3 inherits C2 + child primitive proofs and adds only cross-child relation/state-machine proofs. A lower-level `unproven-gap` remains a gap; inheritance never upgrades it to PASS.

## Contextual arbitration candidate

R2 has sufficient independent evidence to reject a single global keyboard owner. Candidate rule for synthesis:
1. focused interaction context determines navigation owner;
2. a collection owns traversal keys only while focus is in its collection-navigation context;
3. an embedded interactive child may temporarily own keys required by its editing/navigation contract;
4. exiting the child returns to a defined collection/workbench focus context;
5. activation resolves semantic command identity separately and revalidates command conditions/authority at execution time.

This is an **adopt-pattern candidate**, not authority. Proof delta: focus-entry, ownership-transfer, no-key-stealing, restoration and command-identity invariance.

## Failure/recovery implications

Collection state and command execution are separate. A selected/active item may become stale or unavailable before activation. Invocation must revalidate command availability/authority at execution time; failed/partial effects must not be represented as successful merely because collection selection succeeded. Retry/compensation belongs to command/capability/effect contracts where applicable, not Tree/Menu selection state.

## Inspector implications

A contract-driven Inspector should derive fields from relations actually owned. Selecting ButtonGroup should expose grouping/slot constraints but not fake selection/expansion controls. Selecting Tree may expose selection, expansion and navigation policies. This is a concrete anti-hardcode test for the future Inspector schema.

## Dedup / adoption disposition

- **own**: Station C2/C3 semantic contracts, relation ownership, proof inheritance, source-owned Tree/selection contracts.
- **adapt**: mature roving-focus, tree/menu/toolbar interaction mechanisms only where Station semantics require them.
- **adopt-pattern**: explicit separation of focus/selection/active/expansion; contextual navigation arbitration; context-gated command projection; responsive projection preserving semantic identity.
- **defer**: generic Toolbar/Tabs/Table/List/Menu construction until a later research finding demonstrates a real grammar gap and synthesis promotes it.

## R2 sufficiency / exit matrix

| Question | State | Exit implication |
|---|---|---|
| C2 vs C3 promotion boundary | candidate sufficiently evidenced | carry to synthesis/R3; not authority yet |
| structural child compatibility | proven for existing descriptor vocabulary | inherit; do not retest wholesale |
| semantic interaction compatibility | unproven-gap | R3 must model capability/interaction delta before Construction |
| focus/selection/active/expansion orthogonality | benchmark convergence + Station coupling gap | promote as synthesis candidate |
| Selection executable coverage | searched; unproven-gap | record proof debt; do not block research progression by pretending PASS |
| Tree keyboard/focus/expansion executable coverage | searched; unproven-gap | record proof debt; future Construction materialization must include minimum delta proofs |
| contextual keyboard arbitration | adopt-pattern candidate | R3 Interaction Capabilities should refine intent/command/target/conditions relation |
| projection identity invariance | unproven-gap | carry forward to capability/projection research |
| failure/recovery ownership | separated from collection state | carry to R3 command/capability semantics |
| provider independence | preserved | no benchmark provider becomes authority/runtime dependency |

## Current blocker before R2 handoff

Fresh compare on 2026-09-27 reports the R2 branch **diverged: 3 commits ahead / 4 behind `main`**, merge-base `88e47f4b...`; fresh main is `6fd82b0b...`. Therefore R2 is not declared closed from a stale branch. Reconcile the research branch with fresh main (or create a clean handoff branch from fresh main as done for R1), revalidate the consolidated finding, then materialize R2 handoff before making R3 eligible.

`docs/current/NEXT_WORK.md` on fresh main still textually says `R1 NEXT` and names the old repository truth SHA. Per `DOCUMENT_AUTHORITY.md`, fresh repository/PR truth must be reconciled rather than propagating a stale claim. This is a documentation-currentness gap; it does not authorize skipping the research dependency chain.

## Gate

S3-R2 remains `IN_PROGRESS` research only. Construction, Studios and AI/MCP foundation work remain blocked until R1→R7→synthesis and explicit Construction materialization.