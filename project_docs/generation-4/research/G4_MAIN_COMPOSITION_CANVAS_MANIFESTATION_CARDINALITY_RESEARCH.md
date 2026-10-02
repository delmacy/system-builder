# G4 — Main Composition Canvas Manifestation Cardinality Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

Refine the Main Composition Canvas 3D semantic model after the floor/projection-identity work by qualifying **cardinality, aggregation and ambiguity** between designed semantic identities, deployment/placement manifestations and observed runtime identities.

This artifact is research only. It does not authorize implementation, select Three.js/React Three Fiber, create product modules, alter G2/G3 semantics, or introduce new canonical owners.

Fixed boundaries:

```text
Frontend platform = Next.js + React + TypeScript ecosystem
3D WorkSurface = optional projection
Canonical model != scene graph
Floor != canonical owner
ProjectionIdentity != ManifestationIdentity != RenderInstanceId
Designed != observed
Release + Environment = Deployment
Builder != Runtime
```

## 1. Material finding — cardinality is relation-qualified, never inferred from geometry

The previous identity model correctly separated canonical semantic identity, manifestation identity, projection identity and renderer identity. The remaining risk is cardinality: the Canvas could still imply a false one-to-one mapping simply because a shaft, floor stop or Module Workbox visually aligns two objects.

Candidate rule:

`Cardinality belongs to a typed relation contract, not to the visual metaphor.`

A relation projected by the Canvas should be able to declare a qualified cardinality such as:

```text
ONE_TO_ONE
ONE_TO_ZERO_OR_ONE
ONE_TO_MANY
MANY_TO_ONE
MANY_TO_MANY
UNKNOWN_CARDINALITY
CONTEXT_DEPENDENT
```

These are research dispositions, not committed schema enums.

The relation must also declare the **scope in which cardinality is being asserted**. A logical capability may have one designed identity and many observed runtime instances; several capabilities may be packaged into one deployment unit; one logical service may span several placements; one observed resource may remain ambiguous between several designed candidates until evidence resolves it.

Invariants:

- `Visual alignment != one-to-one identity`.
- `One shaft != one manifestation`.
- `One deployment unit != one capability`.
- `One capability != one runtime instance`.
- `Observed multiplicity != designed duplication`.
- `Aggregation != ownership transfer`.
- `Same label != same identity`.
- `Cardinality unknown != cardinality one`.

## 2. Repository-constrained object kinds

The Master Blueprint already names the durable architecture concepts that constrain this research: BusinessRecipe and SystemDefinition remain distinct; SystemDefinition includes capabilities, views, integrations, environment requirements and deployment requirements; Assembly produces an AssemblyPlan; Release manages immutable artifacts; Deploy binds Release to Environment; Runtime executes the client product; Observe receives telemetry without becoming a runtime dependency.

Therefore the Canvas must project those concepts rather than inventing a new universal `CanvasObject` ontology.

Candidate projection families:

```text
DESIGN LOGICAL
  SystemDefinition
  capability
  process/workflow
  action
  view
  integration
  deployment/environment requirement

FACTORY / RELEASE
  AssemblyPlan reference
  ReleaseArtifact / Release reference

DEPLOYMENT / PLACEMENT
  Deployment
  environment
  deployment-unit/placement projection only where repository contracts define it

OBSERVED
  runtime/service/resource identity from qualified telemetry/evidence
  host/container/process/storage/network observations where evidence supports them
```

Important restraint: names such as `deployment unit`, `module manifestation` or `runtime service` remain **projection vocabulary** until an authoritative repository contract defines their canonical ownership and identity. The frontend research must not silently create those domain entities.

## 3. Cardinality patterns the Canvas must represent

### 3.1 One designed logical identity -> many observed instances

This is a normal operational pattern, not drift by itself.

OpenTelemetry explicitly distinguishes a logical service from `service.instance.id`, and multiple simultaneously running instances may share the same logical service name. Kubernetes similarly distinguishes desired workload state from multiple running Pods/replicas.

Candidate projection:

```text
DesignedLogicalIdentity D
  -> EXPECTS/REALIZES
     ObservedInstance O1
     ObservedInstance O2
     ObservedInstance O3
```

The UI may summarize this as one semantic anchor with an instance count, but selection must still distinguish:

```text
select D  != select O1
select aggregate(O1..On) != select each instance
```

Candidate states:

```text
EXPECTED_CARDINALITY_MET
UNDER_REALIZED
OVER_REALIZED
PARTIALLY_OBSERVED
OBSERVATION_STALE
OBSERVATION_UNKNOWN
AMBIGUOUS_INSTANCE_MAPPING
```

No state above is inferred solely from count. The expected cardinality and evidence/currentness must be known first.

### 3.2 Many capabilities -> one deployment/release manifestation

The Blueprint permits SystemDefinition to contain multiple capabilities and the factory to assemble a release artifact. Therefore the UI must not assume capability identity maps one-to-one to deployable packaging.

Candidate relation:

```text
Capability C1 --\
Capability C2 ----> Packaging/Deployment manifestation M
Capability C3 --/
```

The manifestation does not become the semantic owner of C1/C2/C3. A floor transition from CAPABILITY to DEPLOYMENT may therefore produce `MANY_TO_ONE` projection aggregation.

Selection rule:

- selecting C2 and moving to DEPLOYMENT may highlight M **with provenance that C2 is one contributor/member**;
- it must not silently replace the semantic selection with M as if they were identical;
- Inspector retains C2 as semantic anchor and shows M as related manifestation/placement context.

### 3.3 One logical identity -> many deployment/placement manifestations

A logical capability/service may be deployed to multiple environments, regions, replicas or placements depending on future repository contracts.

The Canvas must support this shape without requiring free-camera exploration:

```text
Logical L
  -> Placement P1
  -> Placement P2
  -> Placement P3
```

A shaft should branch or summarize rather than overlap several stops into one false stop.

Candidate affordances:

- `3 manifestations` summary stop;
- expand to branch fan-out;
- list/table equivalent;
- filter by environment/currentness;
- `Show manifestation…` command picker.

### 3.4 Many observed candidates -> one designed identity, unresolved

Telemetry correlation can be incomplete. OpenTelemetry's entity guidance notes that stable instance identification can be difficult when observers cannot unambiguously determine the generating service instance. The SB therefore needs an explicit ambiguity state.

Candidate mapping:

```text
Observed O1 -> candidate D1 (0.72 evidence confidence, not authority)
Observed O1 -> candidate D2 (0.61 evidence confidence, not authority)
```

The UI must render this as `AMBIGUOUS_MAPPING`, not choose the visually nearest or highest numeric score as truth.

`Ranking candidate != identity proof`.

### 3.5 Observed-only and designed-only

Both are first-class conformance conditions:

```text
DESIGNED_NOT_OBSERVED
OBSERVED_NOT_DESIGNED
```

Neither should be hidden merely to make the 3D building look complete.

## 4. Shaft/elevator refinement for cardinality

A `CapabilityShaft` should be treated as a navigation index over typed relations, not as a single vertical line.

Candidate structure:

```text
CapabilityShaftProjection
  anchorSemanticIdentity
  floorStops[]
    floorId
    relationKind
    relationCardinality
    disclosedTargets[]
    undisclosedAggregatePolicy
    currentness
    evidenceDisposition
    conformanceDisposition
```

Candidate visual grammar:

- single stop: one disclosed target;
- split stop: multiple disclosed manifestations;
- aggregate stop: count/summary where enumeration is allowed;
- redacted stop: existence/count disclosure according to DisclosureEnvelope, never inferred exact cardinality;
- broken/qualified stop: unknown/stale/conflicted mapping;
- absent stop: explicit `NOT_APPLICABLE` or `EXPECTED_BUT_MISSING` only when evidence supports that distinction.

`Shaft branch != semantic fork` unless the relation contract says so.

## 5. Vertical `+` with cardinality qualification

The vertical insertion affordance must ask a semantic question before creating anything:

```text
SOURCE_SELECTED
 -> TARGET_FLOOR_SELECTED
 -> RELATION_KIND_QUALIFYING
 -> CARDINALITY_QUALIFYING
 -> EXISTING_TARGETS_DISCOVERED
 -> choose:
      NAVIGATE_EXISTING
      PROPOSE_NEW_MANIFESTATION
      PROPOSE_BINDING
      OPEN_RELATION_INSPECTOR
 -> authority/compatibility/currentness checks
 -> SUBMITTED
 -> ACCEPTED | REJECTED | UNKNOWN_OUTCOME
 -> EFFECTIVE | PARTIAL | FAILED | RECONCILING
```

If the target relation is `ONE_TO_ZERO_OR_ONE` and an admissible target already exists, `+` should not imply another target is allowed. If the relation is `ONE_TO_MANY`, the UI may offer a new manifestation proposal, but only after authority and semantic qualification.

`Plus affordance visible != new target admissible`.

## 6. Selection and aggregation contract

The selection model needs an explicit aggregate distinction:

```text
SceneSelection
  semanticIdentity
  manifestationIdentity?
  aggregateSelection?
    relationKind
    memberRefs[] or qualified summary
    disclosureScope
  projectionIdentity
  revision/currentness
```

Candidate rules:

1. Aggregate selection is never silently converted into selection of the first member.
2. Selecting one member inside an aggregate establishes a primary manifestation without changing the logical semantic anchor unless the user explicitly pivots.
3. Switching 3D -> table/list preserves the same semantic/manifestation identity.
4. Switching floors may replace an aggregate representation with a list of manifestations while preserving the anchor.
5. If disclosure prevents enumeration, the UI retains a qualified aggregate rather than fabricating hidden member identities.

## 7. Designed vs observed conformance with cardinality

Count alone is insufficient conformance evidence.

Kubernetes exposes desired, current and ready replica counts separately. This is a useful interaction analogy: three running objects do not mean three ready/effective objects, and desired count may change independently.

Candidate conformance dimensions:

```text
mapping completeness
expected cardinality
observed cardinality
readiness/effectiveness
revision/version alignment
placement/environment alignment
currentness
observation coverage
```

Candidate result is a vector/qualified disposition, not a single green/red count.

Example:

```text
expected instances = 3
observed instances = 3
ready/effective = 2
one observation stale
=> not MATCHED merely because 3 == 3
```

## 8. Semantic zoom under multiplicity

The representation budget should change, not identity.

```text
DISTANT
  logical silhouettes + qualified aggregate markers

MEDIUM
  logical identity + manifestation counts + major relations

NEAR
  selected branches/instances + ports/gates/counters

SELECTED
  Inspector owns full qualified detail; scene shows bounded emphasis
```

Representation floors:

- selected semantic anchor cannot disappear;
- primary selected manifestation cannot disappear without a fallback marker;
- blocked/unknown critical Gate cannot disappear due to aggregation;
- unresolved mapping cannot be rendered as a clean one-to-one shaft;
- aggregate count cannot leak undisclosed membership.

## 9. Performance implications

Multiplicity increases scene pressure faster than logical system size. A system with 200 logical modules can produce thousands of observed/resource manifestations.

Therefore the NORMAL/STRESS research benchmark should distinguish **logical object count** from **rendered primitive count** and **observed manifestation count**.

Candidate benchmark dimensions:

```text
NORMAL
  50-200 logical modules
  5-10 floors
  hundreds relations/ports/handoffs
  thousands simple primitives
  1x / 10x observed manifestation fan-out cases

STRESS
  ~1000 logical modules
  high manifestation fan-out
  aggregation/clustering mandatory
```

Renderer-level instancing is appropriate for repeated geometry: Three.js `InstancedMesh` exists specifically to reduce draw calls for many objects sharing geometry/material. Raycaster can return an `instanceId` for an instanced hit. This reinforces the adapter boundary:

```text
instanceId -> ProjectionIdentity -> ManifestationIdentity/SemanticIdentity
```

Never:

```text
instanceId -> product identity
```

Performance proof obligations:

- clustering does not merge distinct semantic identities;
- re-instancing does not change selection;
- manifestation fan-out does not force all labels into DOM/scene;
- picking latency is bounded against materialized candidates, not the entire undisclosed universe;
- label virtualization preserves selected/focused/critical markers;
- aggregation happens before rendering when possible;
- Web Worker remains candidate for layout/analysis, not semantic authority.

## 10. Accessibility and non-3D equivalence

Multiplicity must remain operable without 3D.

Required equivalent paths to research:

- manifestations list/table grouped by semantic anchor;
- relation table with cardinality/currentness/conformance;
- command `Show manifestations…`;
- command `Show observed instances…`;
- `Show on floor…`;
- expand/collapse aggregate with keyboard;
- primary-selection management without drag;
- textual explanation of why mapping is ambiguous/ineligible;
- announcements when aggregate expands, mapping changes, or selected manifestation becomes stale/unavailable.

Tiny shaft stops/ports are enhancement affordances, never the only path.

## 11. Componentes impact

Add/qualify candidate records:

```text
ManifestationAggregate
ManifestationCountBadge
CardinalityIndicator
ShaftBranch
ShaftAggregateStop
AmbiguousMappingMarker
DesignedObservedCardinalityPanel
ManifestationPicker
ProjectionAggregateBridge
ObservedInstanceList
```

Material scenarios:

```text
1 designed -> 3 observed -> select one instance -> switch 3D/list -> identity preserved
3 capabilities -> 1 deployment manifestation -> select C2 -> deployment view keeps C2 anchor
1 logical -> N placements -> shaft branches without identity duplication
observed instance -> 2 designed candidates -> AMBIGUOUS_MAPPING, no auto-choice
expected 3 / observed 3 / effective 2 -> PARTIAL, never false MATCHED
LOD clusters 50 manifestations -> selected member remains represented
re-instancing changes instanceId -> selection unchanged
no-access aggregate -> exact hidden count not leaked
vertical + when ONE_TO_ZERO_OR_ONE target exists -> explain ineligibility
reduced motion -> branch/floor transition direct, same semantics
```

## 12. Adversarial proof obligations

1. **Geometry implies 1:1:** prove every cross-floor relation carries explicit cardinality/relation semantics.
2. **Aggregate becomes owner:** aggregation remains projection-only.
3. **Count equals conformance:** conformance remains multidimensional/currentness-qualified.
4. **Observed fan-out duplicates design:** runtime instances remain manifestations/observations, not copied designed identities.
5. **Many-to-one loses anchor:** pivot to deployment preserves originating semantic selection context.
6. **Ambiguity auto-resolves:** ranking/geometry never fabricates identity proof.
7. **Hidden membership leaks:** counts/branches obey DisclosureEnvelope.
8. **LOD erases critical member:** selected/focused/critical representations retain a fallback.
9. **Renderer instance leaks:** re-instancing cannot alter product identity.
10. **Stress fan-out freezes UI:** aggregation/clustering/virtualization precede brute-force rendering.

## 13. Evidence classes and benchmark translation

Primary evidence classes used in this wave:

- System Builder repository architecture for canonical pipeline/object boundaries;
- OpenTelemetry semantic conventions distinguishing logical service and unique service instances;
- Kubernetes Deployment/ReplicaSet documentation distinguishing desired/current/ready replicas and one declarative workload from many Pods;
- Three.js InstancedMesh/Raycaster documentation for renderer-local instancing/picking identities;
- prior G4 Canvas/floor/projection research for semantic identity continuity.

Portable lessons only. None of these sources becomes the SB domain model or selected frontend provider.

## 14. Maturity and next gap

State: `MAIN_COMPOSITION_CANVAS_MANIFESTATION_CARDINALITY = EMERGING / MATERIAL_DELTA`.

Material delta:

1. cardinality is now relation-qualified rather than geometrically inferred;
2. one-to-many, many-to-one, many-to-many and ambiguous mapping are first-class projection cases;
3. shafts may branch/aggregate without manufacturing identity;
4. vertical `+` must qualify cardinality and existing targets before proposing creation;
5. conformance compares more than counts;
6. performance benchmark must separate logical objects, manifestations and rendered primitives.

Highest-value next gap:

- define a provider-neutral NORMAL/STRESS Canvas benchmark harness contract: dataset shapes, manifestation fan-out, camera/picking scenarios, frame-time percentiles, interaction latency, label budgets, memory, clustering thresholds, reduced-motion behavior and semantic-preservation assertions;
- then test Ribbon/Inspector/Status behavior under degraded scene modes so renderer pressure never removes semantic actions or currentness/error explanations.
