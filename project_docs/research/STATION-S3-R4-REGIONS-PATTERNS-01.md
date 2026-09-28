# Station S3-R4 — Pane / Region & Pattern Grammar 01

Date: 2026-09-27
Base revalidated: fresh `main@9ac33de132abfd6f946b8f90f5012332d8df31c6`
Status: RESEARCH — NOT PRODUCT AUTHORITY

## Station current -> question

R3 established C4 Interaction Capability as semantic ownership above component mechanics. R4 asks when a reusable spatial/semantic assembly deserves C5 Pane/Region or C6 Pattern status instead of remaining a configured collection, and how Inspector/Layers/navigation/action regions can compose without becoming independent artifact or business authorities.

Preserved invariants: `identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `WindowGeometry != composition grid`; discrete/span authoring; provider independence; Station presentation/composition-only authority.

## Repository census — current code, not historical nouns

Current `ui-core/EditorShell` already exposes explicit `toolbar`, `palette`, `workArea`, `layers`, `inspector`, and `status` slots. It describes itself as domain-neutral layout-only chrome and leaves graph, selection, command, persistence, and business authority with callers. The implementation groups palette/layers under a navigation aside and marks regions with `data-editor-region`/accessible labels. This is bounded evidence for named region roles and authority separation, not yet proof of a generic movable Pane contract.

Current `ui-core/PropertyInspector` is intentionally renderer-like: callers supply `PropertyGroupDefinition[]`; rows expose identity/label/value/readOnly/known. It does not discover schemas/contracts itself and therefore does not currently prove schema-driven Inspector behavior.

The current Component Lab proof confirms that gap rather than hiding it. Its `groups(selection,state)` function manually constructs identity/contract rows from a selected layer and one component definition. Layers, preview and Inspector do share the same local editor state/selection path in this proof, but the Layers tree/collection is statically assembled beside the composition graph. Therefore this is bounded same-state evidence, not broad bidirectional projection proof and not proof that Layers is derived from the canonical graph.

Historical M2 plans/tasks remain evidence only. R4 must not promote nouns merely because old tasks called them Sidebar, Inspector, Layers or EditorShell.

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

### VS Code workbench / views
Sources:
- https://code.visualstudio.com/api/extension-capabilities/extending-workbench
- https://code.visualstudio.com/api/extension-guides/tree-view
- https://code.visualstudio.com/api/references/contribution-points

VS Code independently distinguishes workbench regions (Activity Bar, Side Bar, Panel, Editor Group, Status Bar), View Containers and Views. Views have stable identifiers, can live in declared containers, have visibility/context conditions, and retain contextual identity when moved. Useful finding: `region role != contained view identity`; visibility and placement are presentation state around a stable semantic contribution.

Classification: `adopt-pattern` for stable region/view identity, declared containment and context-conditioned projection; `defer` extension/provider-specific contribution schema.

## Candidate grammar

### C5 Pane / Region
A C5 candidate is promoted only when all are true:
1. it has a reusable region role/anatomy above generic C3 collection mechanics;
2. it declares named slots or admitted child roles rather than arbitrary nesting;
3. it owns bounded presentation interaction state where needed (visibility, active local view, local focus entry), not canonical artifact/business state;
4. placement can vary without changing semantic region identity unless the contract explicitly says otherwise;
5. it carries an independent proof delta: slot compatibility, focus entry/exit, visibility/restoration, local overflow/resize constraints, or projection identity preservation.

Current evidence supports an initial role vocabulary no broader than required by existing Station chrome: `command/toolbar`, `navigation`, `work/editor`, `inspector/context`, and `status/result`. `palette` and `layers` are currently subroles/projections inside navigation rather than automatic new C5 types. Side (`left/right/bottom`), width and CSS grid coordinates are placement/configuration, not region identity.

Examples remain research candidates, not approvals: NavigationPane, InspectorPane, LayersPane, EditorRegion, BottomPanel, Command/ToolbarRegion.

Do not promote a wrapper/div merely because it has a header, border, background, fixed side, width or CSS layout. Those are configuration/presentation unless a reusable contract/proof delta exists.

### C6 Pattern
A C6 candidate composes lower-level components/capabilities/regions into a reusable semantic arrangement or journey. Promotion requires:
1. reusable semantic purpose across more than one concrete screen/domain;
2. declared participant roles/slots and allowed substitutions;
3. no new business authority hidden in the pattern;
4. state ownership remains with declared lower-level owner/canonical artifact;
5. a delta proof establishes cross-participant behavior/journey rather than re-proving primitives.

Research candidates: FormActions, ConfirmationActions, DestructiveActions, NavigationWithInspector, Layers+Canvas+Inspector projection pattern. `ApproveDocumentActions` is configuration unless it introduces genuinely reusable semantics absent from the generic pattern.

## Inspector / Layers benchmark delta

### Framer Property Controls
Source: https://www.framer.com/developers/property-controls

A code component declares its available Property Controls; selecting that component exposes those controls in the Properties panel. This independently supports `selected semantic type -> declared editable contract -> contextual controls` rather than Inspector hardcoding each product feature.

### Webflow component properties
Source: https://help.webflow.com/hc/en-us/articles/33961219350547-Component-properties

Component properties are declared on the main component, connected to specific elements, grouped/reordered in the properties panel, and then edited per instance. The right panel changes according to selected element/component context. Webflow also has escape hatches/custom elements; those are explicitly not evidence that Station should admit arbitrary HTML/CSS.

### Convergence / divergence
Framer and Webflow independently converge on selection-contextual, declaration-driven property surfaces. They diverge in provider schema and supported control types. Station should therefore `adopt-pattern`, not provider schema: a selected component/capability resolves provider-independent descriptors/contracts, and those descriptors yield Inspector field/action descriptors.

The current Station `PropertyInspector` already accepts neutral group/row descriptors, which is a useful rendering seam. The missing layer is a contract-to-inspector projection/resolver. Do not solve that by adding feature-specific conditionals to `PropertyInspector`.

Candidate direction (research, not authority):

`selectionRef -> canonical node/componentRef -> ComponentRegistry descriptor + capability/command contracts -> InspectorProjection -> PropertyGroup/Field descriptors`

Edits then flow:

`Inspector field intent -> owning semantic mutation/command -> canonical draft/artifact -> all projections refresh`

Unsupported/unrecognized contract fields fail closed or render explicitly unknown/read-only according to contract; they do not silently become editable.

Layers remains a structural projection/navigation surface, not tree-shaped artifact authority. A future Layers projection should derive from canonical graph identity/relationships rather than maintain a parallel hand-authored tree. Reorder/reparent remains blocked by R3 cycle/reachability/order gaps.

The desired projection relation remains:

`canonical artifact/draft -> {canvas/preview, Layers, Inspector, Graph, source/YAML}`

and admitted edits flow back through one semantic mutation boundary. No projection gets a private canonical copy.

## Proof Grammar — R4 working matrix

| Concern | Coverage | Inherited proof | R4 delta obligation |
| --- | --- | --- | --- |
| EditorShell named region roles | proven/bounded current code | lower component composition | exact current slots remain layout-only and do not acquire graph/business authority |
| stable semantic command identity | proven/inherited R3 | command registry/multi-projection identity | pane projections resolve same command identity |
| presentation availability != authority | proven/inherited R3 | invocation-time availability + Core boundary | pane visibility/enabled state never strengthens authority |
| component slot compatibility | proven/inherited lower levels | parent/slot/span validation | named region roles add only their compatibility delta |
| pane identity != placement | unproven-gap generically | R3 identity/placement separation direction | move/relocate preserves pane identity/state admitted by contract |
| pane focus entry/exit/restoration | unproven-gap generically | bounded lower-level focus proofs | deterministic entry, contextual ownership, restoration/no key stealing |
| pane visibility/show-hide | unproven-gap generically | none sufficient | hidden pane does not destroy canonical artifact state; restoration deterministic |
| arbitrary docking/floating | not-applicable for foundation unless admitted later | none | do not create scope from benchmark feature |
| PropertyInspector neutral rendering seam | proven/bounded current code | neutral group/row definitions | do not mistake renderer descriptors for schema discovery |
| Inspector schema-driven fields | unproven-gap | current renderer + benchmark convergence | resolver derives fields/actions from selected contracts/schema; unsupported fields absent/explicitly unknown |
| Layers/Inspector/preview same local state | proven/bounded lab proof | M2 editor transaction/selection | broad projection derivation still not proven |
| Layers derived from canonical graph | unproven-gap | none sufficient; current lab tree is static | graph changes produce structural projection changes without second authority |
| multi-projection bidirectional sync | unproven-gap broad | preview=same draft bounded proof | admitted edit through one projection observed by all others via one mutation boundary |
| semantic reparent/order | unproven-gap / blocked | local placement validation only | inherit R3 cycle/order blockers; no PASS in R4 |
| action-pattern command reuse | candidate/inherited R3 | command identity + authority separation | multiple surfaces/pattern roles preserve command/target/result identity |
| accessibility/keyboard | mixed/gap | reuse proven primitive proofs | prove only region/pattern contextual focus/keyboard delta |
| human acceptance | not-applicable as machine proof | none | validates expected workflow/anatomy separately from conformance |

## Minimal future delta proofs

For a schema-driven Inspector promotion, future Construction should prove only the new delta:
- selecting two descriptors with different declared schemas produces different allowed fields without feature-name conditionals;
- unknown/unsupported descriptor does not become writable by default;
- field edit resolves the owning mutation/command and is rejected fail-closed when incompatible/stale;
- changing selection cannot apply a previous selection's field binding to the new target;
- authority-sensitive actions remain commands/capabilities and are revalidated by their owner, not by Inspector rendering.

For one-artifact/multiple-projection promotion:
- mutation from Inspector changes canonical draft once and Layers/preview/source observe the resulting revision/state;
- selection from Layers resolves the same semantic identity seen by Inspector/canvas;
- projection-local visibility/focus does not alter canonical artifact content;
- invalid projection edit cannot partially mutate one projection;
- round-trip source/YAML proof is deferred until R5 defines its serialization/view contract; absence is `unproven-gap`, not PASS.

Inherited primitive/command proofs are not repeated in these tests.

## Dedup / promotion guard

Reject by default:
- `ApproveDocumentPane` when generic Pane + bound content/actions expresses it;
- `TicketInspector` when Inspector + schema/contracts expresses it;
- `DeploymentRetryToolbar` when ToolbarRegion + owner-declared retry command expresses it;
- separate Layers/Graph/source authorities;
- region types that differ only by side, width, icon, label or theme;
- `TextPropertyInspector`, `ButtonInspector`, etc. when a neutral field descriptor/control registry expresses the variation.

A new C5/C6 piece needs reusable semantics plus a proof delta. Configuration remains configuration.

## Failure/recovery consequences

R4 presentation must preserve R3 owner results. A Pane/Pattern may render stale/rejected/partial/unknown/reconcile-required states and navigate to consequences, but may not convert them to success or invent retry/rollback. Closing/hiding a pane is not cancellation/rollback of an authoritative effect. Restoring a pane is not restoring canonical artifact history.

## Grammar Sufficiency Test — R4 contribution

Test the same small region/pattern grammar against:
- document approval: work/view + contextual Inspector + generic action region;
- ticketing: navigation/list + work/detail + contextual Inspector/actions;
- CRUD: navigation/layers + work/form + Inspector + FormActions;
- operational dashboard: navigation/filter + work/visualization + contextual details/status;
- deployment configuration: navigation/explorer + work/configuration + Inspector + owner-qualified action/result region.

Current role vocabulary can describe these layouts without domain-specific pane types. This is a candidate sufficiency result, not a PASS: schema-driven Inspector, projection synchronization and C6 journey proofs remain gaps.

## Representative human acceptance journeys (expectation only)

1. Select an artifact node in Layers -> Inspector changes to fields admitted by that selected contract -> preview continues to represent the same artifact identity.
2. Edit an admitted field in Inspector -> canonical draft accepts/rejects through its mutation contract -> all visible projections reflect the resulting state; no private Inspector copy survives.
3. Invoke the same semantic command from toolbar/action pattern -> target/result identity matches other projections -> owner rejection/partial/stale remains rejection/partial/stale in presentation.
4. Hide/show a contextual pane -> canonical artifact remains unchanged -> focus restoration follows declared presentation policy.

These journeys describe human expectation and do not themselves establish machine conformance or product authority.

## Executable-evidence census — R4 delta 02

Fresh-main census separates code shape, executable proof and future obligation instead of treating an implemented surface as automatically proven.

### EditorShell

`packages/ui-core/editor-shell.test.ts` provides executable bounded proof that the current shell renders the seven accessible named regions (`toolbar`, navigation, palette, layers, work area, inspector, status) even with empty slots, and that partial caller-owned content can be composed. This upgrades the current named-region anatomy from implementation-only evidence to `proven/bounded` for the exact current shell contract. It does **not** prove generic Pane relocation, visibility state, focus restoration, local resize semantics or arbitrary nesting.

The negative assertion that rendered markup does not contain the strings `ComponentRegistry`, `AppManifest` or `WindowGeometry` is useful regression evidence against accidental coupling in that fixture, but it is not a proof that the shell can never acquire semantic authority. Authority separation remains established primarily by contract/API ownership and architecture, with tests as conformance evidence.

### PropertyInspector

The current implementation has a fail-safe rendering rule: a row is read-only by default and any `known:false` row is forced read-only. That is implementation evidence consistent with TASK-613's historical acceptance contract. The repository census did not find a dedicated `property-inspector.test.*`; therefore neutral rendering is `proven/bounded` only to the extent exercised by cumulative product/CI evidence, while the specific unknown/read-only rule remains an explicit **proof gap** until a focused executable assertion exists. Most importantly, there is still no contract/schema resolver: caller-supplied groups are not evidence of schema-driven Inspector behavior.

### Component Lab / projections

`component-lab-editor-proof.tsx` visibly uses one `ComponentEditorState` for canonical composition transaction, selected node, preview and Inspector input, but its `layers` tree and `layerCollection` are static parallel constants. `groups(selection,state)` also manually assembles Inspector rows. This is executable product surface evidence for a bounded same-state journey, not proof of derived projections. No search result establishes a focused executable test proving `canonical graph -> Layers` derivation or Inspector mutation -> one canonical mutation -> all projections refresh. Those remain `unproven-gap`.

The current PR head has successful Merge Candidate CI, Heavy Product Tests, Deterministic CI and Automation Handoff workflows. Green CI establishes that the research/documentation delta does not break the declared repository gates; it does not promote any missing R4 semantic proof to PASS.

## Benchmark delta — pane state and input-route equivalence

Independent workstation evidence sharpens C5 without expanding scope:

- JetBrains tool windows can be moved by pointer or command, resized by pointer or keyboard, hidden and later focused again; layouts can remember placement/size. The Station extraction is not “implement docking”: it is that **placement mutation and input route are separable from semantic pane identity**, and where multiple routes are admitted they should converge on the same presentation mutation and restoration policy.
- Blender Area maximize/focus modes hide secondary regions and later restore the prior layout. The useful extraction is **visibility/focus mode may suppress a projection without mutating the editor/artifact identity**. Split/join/floating remain deferred.
- VS Code Views retain declared view identity while being hosted by View Containers and may be moved among supported containers. The extraction is `view identity != container placement`; provider contribution schemas remain non-authoritative.

Classification remains `adopt-pattern` for identity/placement separation, restoration semantics and equivalent input routes; `defer/not-applicable` for unrestricted docking/floating and provider-specific extension models.

### Proof consequences

If C5 later admits pane relocation/show-hide/resize, the minimum delta proof is:
1. the same `paneRef` survives admitted placement/visibility changes;
2. pointer and keyboard/command routes, when both exist, resolve the same presentation mutation rather than duplicate owners;
3. hiding/focusing/restoring a pane does not mutate canonical artifact/business state;
4. restoration uses declared presentation state and cannot silently resurrect stale canonical content;
5. contextual shortcuts are active only in their declared region/context and do not steal keys outside it.

These are C5 delta proofs. Primitive focus/button/keyboard mechanics already proven below C5 are inherited, not replayed.

## C5/C6 exit matrix — working handoff candidate

| Finding | Level | Classification | Coverage now | Inherited proof | Smallest future delta proof / gap |
| --- | --- | --- | --- | --- | --- |
| named editor region anatomy | C5 | own/adapt current Station | proven/bounded | C0-C3 composition + EditorShell executable test | generic pane identity/placement still separate gap |
| region identity != placement | C5 | adopt-pattern | unproven-gap generically | R3 identity/placement discipline | stable `paneRef` across admitted relocation |
| contextual focus/show-hide/restoration | C5 | adopt-pattern | unproven-gap | lower focus mechanics | deterministic entry/exit/restoration; artifact unchanged |
| unrestricted docking/floating | C5 | defer | not-applicable foundation | none | only admit if a later requirement creates scope |
| neutral Inspector renderer | C5 | own current Station | proven/bounded implementation seam | PropertyGroup/Row contract | focused unknown/read-only executable assertion remains gap |
| contract/schema -> Inspector projection | C5/C6 | own/adapt | unproven-gap | ComponentRegistry + selection + neutral renderer | two schemas yield different fields without feature hardcode; unknown fails closed |
| Layers derived from canonical graph | C5/C6 | own/adapt | unproven-gap | graph identity + selection | graph mutation updates structural projection with no second authority |
| multi-projection synchronization | C6 | own/adapt | unproven-gap broad | preview=same draft bounded proof | one admitted mutation observed by Inspector/Layers/preview through canonical state |
| action-pattern command reuse | C6 | own/adapt | candidate/inherited | R3 command/target/authority/result grammar | same semantic command projected by multiple participant roles without identity/result strengthening |
| Form/Confirmation/Destructive Actions | C6 | adopt-pattern candidate | unproven-gap as promoted patterns | C2/C3 action grouping + C4 command grammar | cross-domain participant substitutions + journey delta; no domain authority |
| semantic reparent/order through Layers | C6 | blocked | unproven-gap | placement validation only | R3 cycle/reachability + ordering authority must close first |
| source/YAML round-trip | R5 input | defer to R5 | unproven-gap | none sufficient | serialization/view contract and round-trip proof in R5 |

No row is promoted because a benchmark has it. `proven/bounded` means only the named current contract is evidenced; generic promotion still requires the listed delta.

## R4 sufficiency / dedup checkpoint

The five-role vocabulary (`command/toolbar`, `navigation`, `work/editor`, `inspector/context`, `status/result`) remains sufficient as a **working grammar** for the five representative systems without requiring `ApproveDocumentPane`, `TicketInspector`, `DeploymentRetryToolbar` or domain-specific region classes. No independent proof delta has yet justified splitting `status/result` into another C5 type; keep it configuration/subrole until evidence says otherwise.

The remaining sufficiency gaps are not “missing component names”: they are contract-to-Inspector projection, canonical graph-to-Layers derivation, broad multi-projection synchronization, C6 cross-participant journeys, and inherited R3 reparent/order blockers. This is the desired shape of the phase: grammar gaps remain explicit rather than being papered over by adding components.

## Current gaps / next research

1. Focus next on Layers/tree projection synchronization and mature editor mutation semantics without importing provider trees as authority.
2. Search for any existing repository projection/adapter patterns that can derive Layers and Inspector descriptors from canonical graph/registry contracts before proposing a new Station contract.
3. Keep the five-role C5 vocabulary unless an independent reuse/proof delta justifies another role.
4. Close the C5/C6 Exit/Proof Matrix only after projection derivation and C6 representative journeys are classified.
5. Carry source/YAML round-trip explicitly into R5; do not fake R4 completion by declaring it proven.

R5, Construction, Studios and AI/MCP remain blocked until R4 handoff and dependency gates.