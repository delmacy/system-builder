# Station S3-R4 — Pane / Region & Pattern Grammar 01

Date: 2026-09-27
Base revalidated: fresh `main@9ac33de132abfd6f946b8f90f5012332d8df31c6`
Status: RESEARCH — NOT PRODUCT AUTHORITY

## Station current -> question

R3 established C4 Interaction Capability as semantic ownership above component mechanics. R4 asks when a reusable spatial/semantic assembly deserves C5 Pane/Region or C6 Pattern status instead of remaining a configured collection, and how Inspector/Layers/navigation/action regions can compose without becoming independent artifact or business authorities.

Preserved invariants: `identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `WindowGeometry != composition grid`; discrete/span authoring; provider independence; Station presentation/composition-only authority.

## Repository census — initial

Historical M2 planning already names Sidebar/NavigationPane, Toolbar composition, PropertyGroup/PropertyRow/PropertyEditor, generic Inspector, Layers/Component tree and search/filter surfaces, plus constrained insertion into compatible slots. These are evidence/candidates, not current product authority.

R4 must therefore avoid promoting nouns merely because they appear in an old plan. A Pane/Region candidate must establish reusable spatial/interaction responsibility with named compatibility boundaries and a proof delta. A Pattern candidate must establish reusable semantic arrangement/journey across components/capabilities without owning business authority.

## Independent benchmark extraction

### JetBrains tool windows
Source: https://www.jetbrains.com/help/idea/tool-windows.html

Tool windows occupy bounded sides/bottom around the editor, can be shown/hidden/moved, generally expose header + content pane, may contain toolbars and multiple views, and retain keyboard/focus navigation semantics. Useful finding: region identity/content and placement are separable; a bounded pane can move without becoming a new tool semantic identity.

Classification: `adopt-pattern` for bounded pane anatomy and placement-independent identity; `defer` for unrestricted docking/floating until Station has a demonstrated requirement and proof model.

### Blender Areas / Regions
Sources:
- https://docs.blender.org/manual/en/latest/interface/window_system/areas.html
- https://docs.blender.org/manual/en/latest/interface/window_system/regions.html

Blender separates Window -> Areas -> Editors -> Regions. Regions include main region, header, toolbar/sidebar and smaller panels. Shortcut validity can depend on the editor/context. Useful finding: spatial hierarchy and interaction context are related but not identical; secondary regions are structurally subordinate to an editor/area and can disappear in focus mode without changing the editor's semantic identity.

Classification: `adopt-pattern` for explicit region roles/named slots and contextual keyboard ownership; do not copy Blender's arbitrary split/join model into Station composition.

### VS Code / IDE workbench convergence
VS Code and JetBrains independently converge on stable editor/workbench regions, movable views/tool windows, bounded side/bottom regions, and command-driven visibility/focus. R3 already established command identity independent of projection. R4 should therefore treat pane visibility/focus/move as presentation consequences/capabilities over a stable pane identity rather than separate domain actions.

## Candidate grammar

### C5 Pane / Region
A C5 candidate is promoted only when all are true:
1. it has a reusable region role/anatomy above generic C3 collection mechanics;
2. it declares named slots or admitted child roles rather than arbitrary nesting;
3. it owns bounded presentation interaction state where needed (visibility, active local view, local focus entry), not canonical artifact/business state;
4. placement can vary without changing semantic region identity unless the contract explicitly says otherwise;
5. it carries an independent proof delta: slot compatibility, focus entry/exit, visibility/restoration, local overflow/resize constraints, or projection identity preservation.

Examples of research candidates: NavigationPane, InspectorPane, LayersPane, EditorRegion, BottomPanel, Command/ToolbarRegion. Names are not approvals.

Do not promote a wrapper/div merely because it has a header, border, background, fixed side, width or CSS layout. Those are configuration/presentation unless a reusable contract/proof delta exists.

### C6 Pattern
A C6 candidate composes lower-level components/capabilities/regions into a reusable semantic arrangement or journey. Promotion requires:
1. reusable semantic purpose across more than one concrete screen/domain;
2. declared participant roles/slots and allowed substitutions;
3. no new business authority hidden in the pattern;
4. state ownership remains with declared lower-level owner/canonical artifact;
5. a delta proof establishes cross-participant behavior/journey rather than re-proving primitives.

Research candidates: FormActions, ConfirmationActions, DestructiveActions, NavigationWithInspector, Layers+Canvas+Inspector projection pattern. `ApproveDocumentActions` is configuration unless it introduces genuinely reusable semantics absent from the generic pattern.

## Inspector / Layers direction

Inspector must be contract/schema-driven. Selection resolves a semantic component/capability target; declared contracts determine available fields/actions; unsupported fields are absent rather than hardcoded per feature. Inspector edits the same canonical draft/artifact used by preview/source/Layers, subject to the owning mutation contract.

Layers is a structural projection/navigation surface, not tree-shaped artifact authority. Reorder/reparent remains blocked by R3 gaps until semantic ordering, cycle/reachability and mutation proofs exist.

The desired projection relation remains:

`canonical artifact/draft -> {canvas/preview, Layers, Inspector, Graph, source/YAML}`

and admitted edits flow back through one semantic mutation boundary. No projection gets a private canonical copy.

## Proof Grammar — R4 initial matrix

| Concern | Coverage | Inherited proof | R4 delta obligation |
| --- | --- | --- | --- |
| stable semantic command identity | proven/inherited R3 | command registry/multi-projection identity | pane projections resolve same command identity |
| presentation availability != authority | proven/inherited R3 | invocation-time availability + Core boundary | pane visibility/enabled state never strengthens authority |
| component slot compatibility | proven/inherited lower levels | parent/slot/span validation | named region roles add only their compatibility delta |
| pane identity != placement | unproven-gap generically | R3 identity/placement separation direction | move/relocate preserves pane identity/state admitted by contract |
| pane focus entry/exit/restoration | unproven-gap generically | bounded lower-level focus proofs | deterministic entry, contextual ownership, restoration/no key stealing |
| pane visibility/show-hide | unproven-gap generically | none sufficient | hidden pane does not destroy canonical artifact state; restoration deterministic |
| arbitrary docking/floating | not-applicable for foundation unless admitted later | none | do not create scope from benchmark feature |
| Inspector schema-driven fields | unproven-gap | R3 candidate only | fields derive from selected contracts/schema; unsupported fields absent |
| Layers/Inspector/canvas same artifact | unproven-gap broad | preview=same draft bounded proof | mutation through one projection is observed by others without duplicated authority |
| semantic reparent/order | unproven-gap / blocked | local placement validation only | inherit R3 cycle/order blockers; no PASS in R4 |
| action-pattern command reuse | candidate/inherited R3 | command identity + authority separation | multiple surfaces/pattern roles preserve command/target/result identity |
| accessibility/keyboard | mixed/gap | reuse proven primitive proofs | prove only region/pattern contextual focus/keyboard delta |
| human acceptance | not-applicable as machine proof | none | validates expected workflow/anatomy separately from conformance |

## Dedup / promotion guard

Reject by default:
- `ApproveDocumentPane` when generic Pane + bound content/actions expresses it;
- `TicketInspector` when Inspector + schema/contracts expresses it;
- `DeploymentRetryToolbar` when ToolbarRegion + owner-declared retry command expresses it;
- separate Layers/Graph/source authorities;
- region types that differ only by side, width, icon, label or theme.

A new C5/C6 piece needs reusable semantics plus a proof delta. Configuration remains configuration.

## Failure/recovery consequences

R4 presentation must preserve R3 owner results. A Pane/Pattern may render stale/rejected/partial/unknown/reconcile-required states and navigate to consequences, but may not convert them to success or invent retry/rollback. Closing/hiding a pane is not cancellation/rollback of an authoritative effect. Restoring a pane is not restoring canonical artifact history.

## Grammar Sufficiency Test — R4 contribution

Test the same small region/pattern grammar against:
- document approval: editor/view + Inspector + generic action region;
- ticketing: list/navigation region + detail/editor region + contextual Inspector/actions;
- CRUD: Layers/list + editor/form + Inspector + FormActions;
- operational dashboard: navigation/filter region + visualization/editor region + contextual details;
- deployment configuration: explorer/navigation + configuration editor + Inspector + owner-qualified action/result region.

Measure which roles/slots/contracts are expressible and record gaps. Do not add a new abstraction merely to make an exemplar look familiar.

## Current gaps / next research

1. Census actual current Station pane/sidebar/taskbar/editor surfaces and their owners/tests, not only historical plans.
2. Compare schema-driven Inspector models across mature editors/builders and derive contract shape without provider coupling.
3. Compare Layers/tree projection synchronization and mutation semantics.
4. Determine minimal named-slot vocabulary for C5 without hardcoding product features.
5. Derive C5/C6 exit/proof matrix and representative human-readable acceptance journeys.

R5, Construction, Studios and AI/MCP remain blocked until R4 handoff and dependency gates.
