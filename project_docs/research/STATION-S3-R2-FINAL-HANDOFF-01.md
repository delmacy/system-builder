# Station S3-R2 — Final Handoff 01

Date: 2026-09-27
Base: fresh `main@cadefc5fbb11f6463515af4a4aba4d4a9518a22b`
Status: RESEARCH HANDOFF — NOT PRODUCT AUTHORITY

## Scope and currentness

This clean handoff reconciles the R2 Compounds & Collections research onto fresh main after the original research branch diverged. It preserves the dependency chain `R1 -> R2 -> R3 -> R4 -> R5 -> R6 -> R7 -> synthesis -> Construction materialization`. It does not authorize Construction, Studios, or AI/MCP foundation work.

`docs/current/NEXT_WORK.md` on this base already points to S3-R2 in progress, so the prior stale R1 pointer is no longer a blocker.

## R2 promoted research candidates

### C2 -> C3 boundary

C2 Compound may own anatomy, grouping, slots and cardinality but does not become C3 merely because it contains children or has layout/styling/domain naming.

C3 Collection is justified when it owns at least one reusable cross-child semantic relation/state machine with an independent proof delta: traversal/focus ownership, selection policy, active-item policy, expansion, typeahead, ordered mutation, dismissal/restoration, or contextual child-interaction arbitration.

Promotion remains a research candidate until synthesis; configuration/presentation changes do not create a new component identity.

### Existing Station classification

- ButtonGroup remains C2: grouping/anatomy and deterministic slot compatibility, without a cross-child interaction state machine.
- Tree is an existing C3 implementation: hierarchy, expansion, tree/treeitem semantics, roving tabIndex and keyboard traversal are present. Preserve it; do not rebuild it merely to satisfy taxonomy.
- MenuSurface is not promoted to a complete Menu without item collection, navigation/focus ownership, activation, dismissal and restoration semantics.
- Generic Toolbar/Tabs/Table/List/Menu construction remains deferred until a Station grammar gap justifies it.

### Orthogonal collection relations

Generic Collection Grammar must not assume `focus == selection == active == expansion`. Current `SelectionState.selectedRef` is a bounded single-selection contract, not a universal current-item authority. Current Tree may legitimately couple navigation and selection as a Tree policy, but that coupling is insufficient as the generic grammar.

### Contextual keyboard arbitration

Candidate for synthesis/R3: keyboard ownership is contextual rather than globally attached to a visual container. A collection owns traversal only in its collection-navigation context; an embedded interactive child may temporarily own keys required by its editing/navigation contract; exit/restoration is explicit; activation resolves semantic command identity separately and revalidates conditions/authority at execution time.

### Projection identity

Toolbar/menu/context-menu/shortcut/overflow are projections, not new command identities by default. Responsive relocation must preserve semantic identity unless a real semantic contract changes.

## Proof Grammar handoff

Coverage vocabulary remains `proven | failed | unproven-gap | not-applicable`; absence of evidence never becomes PASS. Higher levels inherit only proven lower-level obligations and add the smallest delta proof required by the new relation.

| Obligation | R2 status | Handoff rule |
|---|---|---|
| C2 grouping/anatomy | proven | inherit |
| structural slot compatibility | proven | inherit; do not retest wholesale |
| discrete span / WindowGeometry separation | proven | preserve |
| CollectionIndex duplicate-ref rejection | implementation/task evidence; executable unproven-gap | carry proof debt |
| unknown-ref selection fail-closed | implementation/task evidence; executable unproven-gap | carry proof debt |
| semantic interaction compatibility | unproven-gap | refine in R3 |
| Tree roving traversal | implementation present; executable unproven-gap | minimum future delta proof |
| Tree expansion relation | implementation present; executable unproven-gap | minimum future delta proof |
| focus != selection != active | generic-equivalence hypothesis failed | model orthogonally where semantics require |
| embedded interactive child arbitration | unproven-gap | R3 proof obligation |
| dismissal/focus restoration | unproven-gap where applicable | prove only for transient collections |
| representation/command identity invariance | unproven-gap | carry to R3/projection research |
| primitive semantics | inherited | no wholesale retest |
| Station/Core authority boundary | inherited proven | collection/capability cannot acquire business authority |

`failed` above rejects a generic abstraction; it does not label the existing Tree implementation defective.

## Failure/recovery boundary

Collection state and command execution remain separate. Selection/activation cannot imply successful effect. Commands/capabilities must revalidate authority/currentness at execution and later research must distinguish stale state, accepted != effective, partial effect, retry and compensation/rollback where applicable. These semantics belong to command/capability/effect contracts, not to Tree/Menu selection state.

## Inspector consequence

A future schema/contract-driven Inspector should expose only relations owned by the selected artifact. ButtonGroup should not gain fake selection/expansion fields; Tree may expose declared selection/expansion/navigation policy. This is an anti-hardcode requirement, not permission to build the Inspector during R2.

## Dedup disposition

- **own**: Station semantic contracts, relation ownership, proof inheritance and source-owned Tree/selection contracts.
- **adapt**: mature interaction mechanisms only where Station semantics require them.
- **adopt-pattern**: focus/selection/active/expansion separation; contextual navigation arbitration; context-gated projection; semantic identity preserved across presentation surfaces.
- **defer**: generic collections/tools not justified by a Station grammar gap.

No benchmark becomes runtime/provider authority.

## R2 exit decision

The original R2 branch divergence is resolved for handoff by materializing this bounded consolidation directly from fresh `main@cadefc5f`. R2 research questions needed for dependency progression are sufficiently bounded: C2/C3 promotion, structural-vs-semantic compatibility, collection state orthogonality, contextual arbitration, projection identity, proof inheritance, and explicit proof debt are all recorded without converting gaps to PASS.

R2 may therefore close as a research phase once this handoff is integrated. R3 becomes eligible for **research only**, focused on Interaction Capabilities: `intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`, including failure/recovery and projection invariance. Construction remains blocked until R1-R7 plus synthesis and explicit materialization gate.
