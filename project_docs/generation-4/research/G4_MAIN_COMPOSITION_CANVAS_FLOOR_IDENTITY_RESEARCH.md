# G4 — Main Composition Canvas Floor & Projection Identity Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

Refine the highest-value semantic gap in `G4_MAIN_COMPOSITION_CANVAS_3D_INTERACTION_RESEARCH.md`: the exact meaning of a **floor**, the identity of a semantic object as it appears across floors/projections, and the contract behind vertical manifestations/capability shafts.

This artifact is research only. It does not authorize implementation, select Three.js/React Three Fiber, create product modules, or alter G2/G3 architecture.

Fixed boundaries:

```text
Frontend platform = Next.js + React + TypeScript ecosystem
Peripheral shell = React/DOM
3D = optional WorkSurface projection
Canonical model != scene graph
Projection identity != renderer identity
Designed state != observed state
```

## 1. Material finding — a floor is a typed projection stratum, not a canonical container

The building-storey metaphor is useful only if its limits are explicit. In IFC, a building storey participates in a real hierarchical spatial structure and acts as a spatial container. That is exactly the semantic transfer the System Builder must **not** make by accident: SB floors are primarily interaction/projection strata over canonical identities and relations, not new ownership or containment boundaries.

Candidate definition:

```text
SemanticFloorDefinition
  floorId
  purpose
  eligibleSemanticKinds[]
  eligibleRelationKinds[]
  manifestationRules[]
  requiredEvidence/currentness
  disclosureRequirements
  supportedLenses[]
  defaultRepresentationBand
  allowedCrossFloorTransitions[]
```

Invariants:

- `Floor != bounded context`.
- `Floor != canonical owner`.
- `Floor != deployment boundary`.
- `Floor != permission boundary`.
- `Floor position != architectural precedence`.
- `Higher floor != higher authority`.
- `Vertical adjacency != derivation`.
- `Same X/Z position across floors != same identity`.

A floor may group representations that answer a coherent question, but canonical ownership remains where the architecture declares it.

## 2. Candidate floor taxonomy

The previous generic candidate set is refined into **question-oriented floors**. Names remain research candidates; semantics matter more than labels.

### BUSINESS / INTENT

Question: *What business intent, rule, actor or responsibility motivates the system?*

Candidate representations:

- approved business-domain/recipe references where disclosure permits;
- actors/responsibilities;
- rules/constraints;
- traceability anchors into designed software.

This floor must not imply that BusinessRecipe objects become SystemDefinition objects. `BusinessRecipe != SystemDefinition` remains constitutional.

### PROCESS / WORKFLOW

Question: *How does work progress and where are decisions/handoffs?*

Candidate representations:

- process/workflow identities;
- activities/decisions/waits/events/effects;
- handoff counters/gates;
- relation paths and current work-item markers.

### CAPABILITY / MODULE

Question: *Which software capabilities/modules realize required behavior and how are they composed?*

Candidate representations:

- capability identity;
- module membership/composition projection;
- contracts/dependencies/providers as qualified relations;
- ModuleNode / ModuleWorkbox.

This is the natural home for capability shafts, but the shaft may cross into other floors only through declared manifestation relations.

### FRONTEND / EXPERIENCE

Question: *How is behavior exposed to a user or operator?*

Candidate representations:

- views/screens/forms;
- UI building blocks and navigation surfaces;
- interaction entry points bound to capabilities/actions.

Frontend representation is not business ownership and must not imply that an action is authorized merely because a control exists.

### DATA / INFORMATION FLOW

Question: *What information structures and flows are material to the selected context?*

Candidate representations:

- entities/data contracts;
- relations;
- projections/transformations;
- qualified data-flow paths.

### INTEGRATION / EXCHANGE

Question: *Where do semantic/transport boundaries and external exchanges occur?*

Candidate representations:

- connectors/endpoints;
- exchange contracts;
- external-system boundaries;
- handoff/compatibility/currentness evidence.

### DEPLOYMENT / PLACEMENT

Question: *Where is a release/deployment unit intended to run?*

Candidate representations:

- release/deployment-unit manifestations;
- environment/placement bindings;
- logical topology.

`Release + Environment = Deployment` remains the architectural meaning; the floor is only its projection.

### INFRASTRUCTURE / RUNTIME TOPOLOGY

Question: *Which hosts/containers/runtime/storage/network resources materially support the selected deployment?*

Candidate representations:

- host/container/runtime/storage/network/gateway/provider resources;
- placement/failure-domain relations;
- infrastructure qualification.

### OPERATIONS / OBSERVED

Question: *What has actually been observed in operation?*

Candidate representations:

- observed runtime/service/resource manifestations;
- telemetry-backed occurrence/currentness markers;
- health/degraded evidence;
- drift/conformance overlays.

OpenTelemetry's resource model is a useful evidence analogue: logical service identity, service version, service instance, host and deployment environment are distinct resource attributes. The SB should similarly avoid collapsing logical identity, deployment manifestation and observed runtime instance into one identifier.

## 3. Floor taxonomy is not one universal stack

The candidate floors above are not required to render simultaneously and should not be treated as a fixed architectural stack.

A workspace may materialize a bounded subset:

```text
PROCESS DESIGN
  PROCESS + CAPABILITY + DATA

APPLICATION DESIGN
  CAPABILITY + FRONTEND + DATA

DEPLOYMENT
  CAPABILITY + DEPLOYMENT + INFRASTRUCTURE

OPERATIONS
  DEPLOYMENT + INFRASTRUCTURE + OPERATIONS

FULL ENGINEERING
  larger qualified subset, still bounded by disclosure/performance
```

Therefore:

`Workspace preset != permission grant`.
`Visible floor set != complete system ontology`.
`Hidden floor != absent semantics`.

## 4. Identity algebra — canonical identity, manifestation identity, projection identity, render identity

The 3D WorkSurface needs four explicitly different identity classes.

### Canonical semantic identity

Stable identity of the underlying semantic object owned by the appropriate model/bounded context.

Examples: capability, workflow, module, deployment, host, observed runtime resource.

### Manifestation identity

Identity of a distinct, model-backed manifestation of another semantic object in a different concern/domain.

Examples:

```text
logical capability
  -> deployment binding / deployed unit manifestation

logical service/capability
  -> observed runtime instance

SystemDefinition view/action
  -> generated/runtime manifestation when explicitly represented
```

A manifestation is not automatically the same object. It may have its own identity, revision/currentness and lifecycle while retaining an explicit relation to an origin/logical identity.

### ProjectionIdentity

Ephemeral/stable-within-view identity of **one representation** of a canonical or manifestation identity under a qualified projection context.

Candidate shape:

```text
ProjectionIdentity
  projectionId
  semanticIdentity
  manifestationIdentity?
  floorId
  projectionKind
  revisionPerspective
  currentnessPerspective
  activeLensSet
  disclosureScope
  aggregatePath?
```

`ProjectionIdentity` is never persisted as canonical business/system identity.

### RenderInstanceId

Renderer-local object/instance index used for picking, batching, instancing or scene management.

Three.js raycasting can return an `instanceId` for an `InstancedMesh`; this is precisely why renderer instance identity must terminate at the picking adapter and never leak into product identity.

Candidate chain:

```text
RenderInstanceId
  -> ProjectionIdentity
  -> ManifestationIdentity? / SemanticIdentity
  -> qualified SelectionContext
```

Invariants:

- `RenderInstanceId != ProjectionIdentity`.
- `ProjectionIdentity != canonical identity`.
- `Same semantic identity may have multiple ProjectionIdentity values`.
- `Same semantic identity may relate to multiple manifestation identities`.
- `Same screen position does not establish identity`.
- `Same label/name does not establish identity`.

## 5. Same-identity vs manifestation vs derived-identity decision

A vertical `+` or shaft traversal must classify the cross-floor relation before rendering continuity.

Candidate dispositions:

```text
SAME_IDENTITY_PROJECTION
  same canonical identity, different projection/floor only

MANIFESTATION_OF
  distinct model-backed identity representing realization/instance of origin

DERIVED_FROM
  distinct identity with explicit derivation/traceability relation

OBSERVED_INSTANCE_OF
  distinct observed runtime/resource identity linked to logical/designed identity

RELATED_NOT_IDENTITY
  relation exists, but identity continuity is false

UNQUALIFIED
  evidence insufficient to claim the relation

INCOMPATIBLE
  floor/object combination is not semantically valid
```

This classification prevents the visual metaphor from manufacturing sameness.

Example:

```text
Capability C shown on CAPABILITY floor
 -> same C highlighted in a DATA lens
    SAME_IDENTITY_PROJECTION

Capability C -> Deployment D that includes/realizes C
    MANIFESTATION_OF or RELATED_NOT_IDENTITY
    depending on the canonical model contract

Designed service S -> observed runtime instance I-42
    OBSERVED_INSTANCE_OF
    never SAME_IDENTITY_PROJECTION merely because the shaft is vertical
```

## 6. Capability shaft contract

A shaft is a **relation/navigation projection**, not an identity assertion.

Candidate record:

```text
CapabilityShaftProjection
  anchorSemanticIdentity
  disclosedStops[]
  relationDispositionPerStop
  evidence/currentnessPerStop
  conformanceDisposition
  unresolvedStops[]
```

Candidate stop states:

```text
PRESENT_SAME_IDENTITY
PRESENT_MANIFESTATION
PRESENT_OBSERVED_INSTANCE
ABSENT_NOT_APPLICABLE
ABSENT_EXPECTED
UNKNOWN
STALE
PARTIAL
DRIFTED
CONFLICTED
BLOCKED_BY_DISCLOSURE
RECONCILING
```

A visually continuous shaft may include discontinuities in evidence/currentness. It must not draw an uninterrupted 'healthy elevator' when an intermediate relation is unknown, stale or incompatible.

`Shaft continuity != semantic/evidence continuity`.

## 7. Vertical `+` transition grammar

The vertical affordance should begin from a qualified semantic intent, not geometry.

```text
IDLE
 -> TARGET_FLOOR_REQUESTED
 -> FLOOR_ELIGIBILITY_CHECKING
 -> ELIGIBLE | INELIGIBLE(reason) | UNKNOWN(needs qualification)
 -> RELATION_KIND_REQUIRED
 -> SAME_IDENTITY_PROJECTION
    | MANIFESTATION_CANDIDATE
    | DERIVATION_CANDIDATE
    | OBSERVED_LINK_CANDIDATE
 -> PROPOSED
 -> SUBMITTED
 -> ACCEPTED | REJECTED | UNKNOWN_OUTCOME
 -> EFFECTIVE | PARTIAL | FAILED | RECONCILING
```

For `SAME_IDENTITY_PROJECTION`, no canonical object creation is implied; it may be only a navigation/view action. For manifestation/derivation candidates, creation or binding is a governed model operation and follows the relevant authority/validation path.

`Vertical + != clone`.
`Projection creation != canonical object creation`.
`Submitted != accepted != effective`.

## 8. Designed vs observed — identity must remain asymmetric

Kubernetes controllers provide a useful interaction analogy: desired state and current state are explicitly distinct, and controllers work to move current state toward desired state. This supports the SB rule that designed and observed planes should be compared, not collapsed.

Candidate relation model:

```text
DesignedIdentity
  -> expected manifestation relation(s)
  -> ObservedIdentity[]
  -> ObservationEvidence(currentness, provenance)
  -> ConformanceDisposition
```

Candidate conformance dispositions:

```text
NO_EXPECTATION
DESIGNED_NOT_OBSERVED
OBSERVED_NOT_DESIGNED
MATCHED
PARTIAL_MATCH
DRIFTED
STALE_OBSERVATION
AMBIGUOUS_MAPPING
CONFLICTED
UNKNOWN
RECONCILING
```

An observed object may map to zero, one or several designed candidates until evidence resolves ambiguity. The UI must not force one-to-one identity because geometry makes it convenient.

`Designed != observed`.
`Observed instance != desired logical identity`.
`Mapping candidate != conformance proof`.

## 9. Cross-projection selection contract

Selection should target a semantic subject plus an optional manifestation/projection context.

Candidate shape:

```text
SceneSelection
  semanticIdentity
  manifestationIdentity?
  sourceProjectionIdentity
  primaryFloor
  revisionPerspective
  currentnessPerspective
  selectionReason
```

When switching floor/mode:

1. preserve `semanticIdentity` if it remains disclosed and meaningful;
2. preserve `manifestationIdentity` only if the target surface can represent that manifestation;
3. resolve a new `ProjectionIdentity` for the target view;
4. if no direct representation exists, retain selection in Inspector/breadcrumb/status and offer nearest qualified representation;
5. never silently select a different semantic object merely because it occupies the analogous geometric slot.

Candidate selection outcomes:

```text
PRESERVED_EXACT
PRESERVED_SEMANTIC_REPROJECTED
PRESERVED_WITH_MANIFESTATION_SUMMARY
NOT_MATERIALIZED_BUT_RETAINED
FILTERED_OUT_BUT_RETAINED
NO_LONGER_DISCLOSED
NO_LONGER_ADMISSIBLE
STALE_REFERENCE
AMBIGUOUS_REPROJECTION
```

## 10. Semantic zoom and floor transitions

Floor switching and semantic zoom are independent dimensions.

```text
zoom = representation detail within qualified context
floor = semantic question/projection stratum
lens = emphasis/overlay transformation
camera = viewpoint
selection = semantic subject
```

Changing one must not silently mutate the others.

Examples:

- zooming out may cluster several modules but does not change floor;
- switching from CAPABILITY to DEPLOYMENT may preserve semantic anchor while resolving a manifestation;
- applying CONFORMANCE lens does not move the user to OPERATIONS floor;
- framing a selected observed instance does not change designed/observed mapping authority.

## 11. Performance implications of identity separation

Identity separation also improves performance architecture.

Renderer batching may freely reorganize `RenderInstanceId` values without invalidating selection, because selection is stored above the renderer layer. Three.js `InstancedMesh` reduces draw calls for repeated geometry/material, and its raycaster exposes the hit `instanceId`; the adapter can therefore map a fast renderer-local hit back to stable projection identity.

Frustum culling and LOD may remove/change meshes while `ProjectionIdentity` and `SceneSelection` remain alive outside the scene graph.

Candidate caches/indexes:

```text
renderInstance -> projection
projection -> semantic/manifestation
semantic -> disclosed projections
manifestation -> origin/observed relation
```

Proof obligation: cluster/LOD/re-instancing/re-layout must not change semantic selection or fabricate a new object identity.

## 12. Accessibility implications

Floor and manifestation navigation must be available without 3D manipulation.

Candidate DOM equivalents:

- floor switcher/list with purpose and eligible object kinds;
- 'manifestations' section in Inspector;
- relation table with relation disposition/currentness;
- designed-vs-observed mapping table;
- command picker for `Show on floor…`, `Show manifestations…`, `Show observed instances…`;
- announcements for selection re-projection and unavailable/ambiguous mappings.

WCAG 2.2's dragging and target-size requirements reinforce that tiny 3D affordances cannot be the sole path. Motion from floor/camera changes must also respect reduced-motion preference; semantic continuity cannot depend on animated travel.

## 13. Componentes impact

Add/qualify candidate records:

```text
SemanticFloorDefinition
FloorSelector
FloorEligibilityIndicator
ProjectionIdentityBridge
ManifestationLink
CapabilityShaft
ShaftStop
VerticalInsertionAffordance
DesignedObservedMapping
CrossProjectionSelectionBridge
ProjectionFallbackNotice
```

Material scenarios:

```text
same capability -> switch CAPABILITY to DATA lens -> SAME_IDENTITY_PROJECTION
capability -> DEPLOYMENT -> manifestation relation shown, no identity collapse
designed service -> two observed instances -> both retain distinct manifestation identities
observed-only instance -> no designed match -> OBSERVED_NOT_DESIGNED
vertical + to invalid floor -> INELIGIBLE(reason), no object created
vertical + qualification unknown -> UNKNOWN, no optimistic compatibility
switch floor while selected -> semantic identity preserved or explicit fallback
LOD/re-instancing -> RenderInstanceId changes -> selection remains stable
revision changes during cross-floor navigation -> currentness requalified
reduced motion -> floor change uses direct transition without loss of context
no-access target floor -> no hidden count/bounds leak
```

## 14. Adversarial proof obligations

1. **Floor becomes architecture:** prove floor definitions are projections and cannot acquire canonical ownership/permission semantics.
2. **Vertical geometry fabricates sameness:** every cross-floor continuity has an explicit relation disposition.
3. **Renderer identity leaks:** re-instancing must not alter semantic identity/selection.
4. **Observed/designed collapse:** observed runtime instances remain distinct and evidence-qualified.
5. **Hidden floor leaks data:** floor counts, shaft stops and Frame All remain disclosure-aware.
6. **Selection fracture:** cross-projection transition preserves semantic anchor or reports explicit fallback/ambiguity.
7. **LOD destroys selected object:** selected identity survives absent mesh representation.
8. **Vertical + clones blindly:** target floor and relation kind are qualified before any governed model proposal.
9. **Animation carries meaning:** reduced-motion/direct transition exposes the same floor/manifestation semantics.
10. **3D-only manifestation discovery:** Inspector/list/table/command alternatives expose equivalent qualified relations.
11. **Stale mapping shown current:** designed/observed relation carries evidence currentness independently from each endpoint.
12. **Same name becomes same identity:** labels never participate as identity proof.

## 15. Benchmark/evidence translation

### IFC / architecture viewers

IFC's `IfcBuildingStorey` demonstrates that a real floor/storey can be a hierarchical spatial container. The SB deliberately borrows the navigation metaphor while rejecting automatic transfer of spatial containment semantics. This is evidence for **typed floor contracts**, not evidence that the SB should model its architecture as a building.

### Blender / CAD navigation

Discrete axis/aligned views, frame-selected/frame-all and fit/home views remain useful orientation grammar. The SB constrains them to semantic subjects/floors and disclosure-aware bounds rather than requiring professional free-camera navigation.

### Kubernetes desired/current state

Desired and current state remain explicitly distinct; use this as interaction evidence for designed-vs-observed comparison and reconciliation states, not as a product architecture import.

### OpenTelemetry resources

Logical service identity, service version, service instance and deployment environment are distinct concepts. This supports keeping logical/canonical identity, deployment manifestation and observed instance identity separate in UI projection.

### Three.js

`InstancedMesh` and raycasting `instanceId` demonstrate why high-performance renderer identity is naturally local/ephemeral. They support an adapter mapping into `ProjectionIdentity`; they do not justify exposing renderer IDs to product semantics.

## 16. Candidate decisions

1. Treat floors as typed, question-oriented projection strata rather than canonical containers.
2. Use a candidate floor taxonomy of BUSINESS/INTENT, PROCESS/WORKFLOW, CAPABILITY/MODULE, FRONTEND/EXPERIENCE, DATA/INFORMATION FLOW, INTEGRATION/EXCHANGE, DEPLOYMENT/PLACEMENT, INFRASTRUCTURE/RUNTIME TOPOLOGY and OPERATIONS/OBSERVED; workspaces materialize bounded subsets rather than one universal stack.
3. Separate canonical semantic identity, manifestation identity, ProjectionIdentity and RenderInstanceId.
4. Require explicit cross-floor disposition: SAME_IDENTITY_PROJECTION, MANIFESTATION_OF, DERIVED_FROM, OBSERVED_INSTANCE_OF, RELATED_NOT_IDENTITY, UNQUALIFIED or INCOMPATIBLE.
5. Treat capability shafts as navigation/relation projections, never proof of identity/conformance.
6. Treat vertical `+` as a qualified intent grammar; projection-only transitions do not create canonical objects.
7. Preserve semantic selection across floor/mode changes even when the target projection is not currently materialized.
8. Keep designed and observed identities asymmetric and evidence/currentness qualified.
9. Allow renderer batching/LOD/re-instancing to change render identities freely while stable semantic selection lives above the renderer.
10. Require DOM/list/table/Inspector alternatives for every floor/manifestation operation.

## 17. Open gaps

Highest-value next gaps:

1. qualify the floor taxonomy against concrete SystemDefinition/BusinessRecipe/Deployment/Observe object kinds already defined in G3/G4, without inventing ownership;
2. define whether `ManifestationIdentity` should be a UI research abstraction only or map to existing canonical identities/relations per object kind;
3. define cross-floor relation cardinality and ambiguity rules, especially one-designed-to-many-observed and many-logical-to-one-deployment-unit cases;
4. define disclosure-safe clustering/shaft aggregation when hidden manifestations exist;
5. specify keyboard ordering/navigation when a semantic anchor has several manifestations on one target floor;
6. create a provider-neutral NORMAL/STRESS benchmark with frame-time, picking latency, camera/selection latency, label budget, memory and degradation thresholds.

## Maturity

`MAIN_COMPOSITION_CANVAS_FLOOR_IDENTITY = EMERGING / MATERIAL_DELTA`

Floor semantics and identity boundaries are materially clearer. The remaining uncertainty is concentrated in canonical object-kind mapping, manifestation cardinality/ambiguity, disclosure-safe aggregation and measurable performance qualification.