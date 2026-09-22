# G4 — Main Composition Canvas 3D, Towers, Floors, Hubs & Deployment Topology Research

Status: RESEARCH_ACTIVE / NON_EXECUTABLE
Authority: research only; no product implementation authority
Branch: research/g4-product-rnd-foundations

## Purpose

This artifact consolidates the current Generation 4 research direction for the System Builder main composition interface.

The goal is not decorative 3D. The goal is a semantic engineering workspace capable of showing the same system through multiple coherent projections while preserving identity, authority, revision, currentness, evidence and deployment truth.

~~~
3D semantic
!=
3D decorative
~~~

The interface is a projection and interaction surface, never canonical business truth.

~~~
Canvas / View / Map
!=
Canonical Model
~~~

## Stable shell hypothesis

The global application shell remains ordinary accessible React/DOM UI.

~~~
APP BAR
  System / Revision / Environment / Search / User

RIBBON TAB ROW
  collapsible Office-style command surface

RIBBON CONTENT
  temporary / pinned / contextual

Tool Rail | Main WorkSurface | Inspector / Properties

STATUS / ACTIVITY BAR
~~~

The 3D renderer is restricted to the WorkSurface.

Candidate frontend direction remains Next.js + React + TypeScript + a React-compatible specialized 3D renderer. Three.js / React Three Fiber are research candidates, not adoption decisions.

## Projection family

No single map should become the universal view.

Candidate projections:

- 2D Composition View
- 3D Building / Towers / Onion View
- Floor View
- Capability Map
- Relation Graph
- Workflow Canvas
- Corridor / Handoff / Conformance View
- Deployment / Topology View
- Infrastructure View
- Observability View
- Evidence / Audit View

All projections should preserve semantic identity.

~~~
Same object
-> different projection
-> same semantic identity
~~~

## Workspace context

Candidate context envelope:

~~~
WorkspaceContext {
  system
  revision
  environment
  workspace
  projection
  selection
  module
  floor
  capability
  lens
  currentness
}
~~~

Switching projection must not silently create a new object identity.

## Global spatial grammar

The current 3D research hypothesis uses three complementary dimensions.

### Horizontal dimension

X represents module/context composition, same-floor relationships and horizontal hubs.

### Vertical dimension

Y represents floors / system spheres.

Candidate floors are not yet an immutable taxonomy, but may include:

- Business / Domain Core
- Application / View
- Workflow / Process
- Data
- Security / Governance
- Runtime
- Deployment
- Infrastructure
- Observability / Operations

Not every module participates in every floor.

### Radial / semantic-depth dimension

Z or radial depth represents internal distance from semantic core toward external realization.

~~~
DOMAIN CORE
  Entities
  Values
  Rules
  State

        ↓

DOMAIN / APPLICATION BEHAVIOR
  Services
  Use Cases
  Decisions
  Orchestration

        ↓

CONTRACT BOUNDARY
  Contracts
  Ports
  Inputs
  Outputs

        ↓

REALIZATION BOUNDARY
  Providers
  Bindings
  Adapters
  Drivers
  Gateways
  Views
  External integrations
~~~

A bounded context is better treated as the semantic envelope, not as one of the rings.

~~~
Bounded Context
= semantic envelope

Onion rings
= internal semantic depth
~~~

## Modules as towers / pillars

A module is not required to contain an identical set of layers.

~~~
Shared structural vocabulary
!=
identical module anatomy
~~~

A module may participate in a variable set of floors. Its 3D projection may therefore appear as a tower/pillar of flexible height.

Examples:

- Auth may manifest across almost every floor.
- Deployment may predominantly manifest in runtime/deployment/infrastructure floors.
- Observability may manifest across runtime-facing floors as an observer without owning the business execution path.

Presence in a floor does not imply ownership or execution participation.

~~~
Floor participation
!=
semantic ownership
!=
workflow participation
~~~

## Floor manifestations

A tower is a projection of a module's participation across floors.

Each intersection is a Floor Manifestation.

Candidate model:

~~~
ModuleManifestation {
  module
  floor
  role
  capabilities[]
  contracts[]
  ports[]
  services[]
  inputs[]
  outputs[]
  adapters[]
  providers[]
  policies[]
  evidence[]
}
~~~

Fields are optional/contextual; not every manifestation must have all categories.

A floor manifestation may expose only the slice relevant to that sphere.

## Module internal onion

Selecting a module/floor manifestation may open a radial/internal view.

~~~
BOUNDED CONTEXT / MODULE
  outer: adapters / views / gateways
  next: contracts / ports / input-output
  next: services / use cases / orchestration
  core: domain entities / values / rules / state
~~~

Not all floors require all rings.

~~~
Shared onion grammar
!=
all rings mandatory
~~~

## Workflow and data flow are not necessarily rings

Workflow and data flow are often better understood as trajectories through the structure.

Data flow:

~~~
Input
 -> Contract
 -> Service
 -> Core
 -> Repository Port
 -> Adapter
 -> Storage
~~~

Workflow:

~~~
Command
 -> Contract
 -> Use Case
 -> Domain Transition
 -> Event
 -> Outbound Contract
~~~

Therefore:

~~~
Onion
= structure

Workflow
= behavior traversing structure

Data Flow
= information traversing structure
~~~

## Capability, contract, port and realization

Research vocabulary:

~~~
Capability
= what must be possible

Contract
= promises, requirements and guarantees for using/providing it

Port / Entry Point
= where the contract is exposed

Input / Output
= what crosses the boundary

Provider
= who offers the capability

Binding
= which provider is selected in context

Adapter / Driver / Gateway
= concrete realization / translation / access mechanism
~~~

Important distinction:

~~~
Contract
!= physical access point

Contract
= formal semantics of access

Port / Entry Point
= exposed access location/interface
~~~

## Door and counter metaphor

Candidate visual metaphor:

~~~
Door
= admissible boundary / port

Counter / Desk
= operation/service/request surface exposed at that boundary
~~~

A counter may expose REQUEST, COMMAND, QUERY, EVENT or HANDOFF.

Candidate contract metadata includes operation, required/optional data, actor requirements, authority requirements, preconditions, validations, evidence requirements, acknowledgement policy, completion semantics, timeout, retry, escalation, rejection and recovery.

The same semantic counter can be represented through a human form, API, workflow, AI/automation, import or another capability.

~~~
View
!=
Capability Entry Point
~~~

## Module Workbox

Clicking a module should expand a contextual Module Workbox, not replace the user's identity/context.

Candidate faces:

- Overview
- Capabilities / Services
- Entry Points / Counters
- Contracts / Ports
- Dependencies / Relations
- Providers / Bindings
- Adapters / Drivers
- Plugins / Extensions
- Configuration
- Data
- Events / Workflow
- Security / Authority
- Runtime / Deployment
- Observability
- Evidence / History

Only applicable faces should appear.

~~~
Module face availability
!=
fixed universal tabs
~~~

## Horizontal and vertical plus semantics

~~~
+ horizontal
= qualified relationship/composition opportunity with another module

+ vertical
= expose/add another floor manifestation of the same module
~~~

Important:

~~~
Horizontal composition
!=
vertical manifestation
~~~

A horizontal plus must not mean connect anything to anything.

~~~
Visual connectability
!=
semantic compatibility
~~~

## Towers and capability shafts

The visual metaphor should distinguish module towers from cross-cutting capability participation.

A capability may behave like a shaft/elevator that crosses floors.

~~~
Capability participation
!=
semantic ownership
~~~

## Hubs replace corridor as the primary structural metaphor

The earlier corridor metaphor remains useful as a route/conformance projection, but the more general structural concept is Hub.

Vertical Hub = cross-floor interaction.

Horizontal Hub = same-floor composition/exchange.

Lateral Hub = cross-context, cross-system or external exchange without implying floor hierarchy.

~~~
Hub
= structure

Flow
= movement

Corridor Map
= route projection
~~~

## Handoffs, gates and work items

~~~
WorkItem
= item/request/effect/document/entity reference being progressed

Handoff
= explicit transfer of responsibility/control/context

Gate
= prerequisite evaluation before progression

Evidence
= proof that passage/acceptance/effect occurred
~~~

Candidate gate states:

- PASS
- FAIL
- BLOCKED
- PENDING
- UNKNOWN
- STALE
- BYPASSED_WITH_AUTHORITY

Bypass must be explicit, authorized and evidenced.

~~~
Bypass
!=
ordinary pass
~~~

## Designed vs observed flow

The system should be able to show designed/expected and observed/actual progress separately.

~~~
Expected:
A -> B -> C -> D

Observed:
A -> B ------> D
~~~

Candidate interpretation:

- C = SKIPPED_REQUIRED_STAGE
- B -> D = NONCONFORMANT_TRANSITION
- D = downstream state with missing prerequisite evidence

Never infer upstream completion from downstream existence.

~~~
Downstream state
!=
proof that upstream required gate passed
~~~

## Server / basement deployment projection

In topology/deployment views, servers/hosts may act as basements/foundations.

~~~
SERVER / HOST
= deployment foundation

DEPLOYMENT TOWER
= module/runtime manifestation on that host
~~~

A basement may split/reveal CPU, memory, runtime, network, storage, region/zone, placement, deployment-unit identity, health and capacity.

This projection helps answer what runs where without changing module identity.

~~~
Module Identity
!=
Deployment Placement
!=
Runtime Instance
~~~

## Twin towers / availability groups

The same logical module may have multiple deployment/runtime manifestations.

Candidate group types:

- AVAILABILITY_PAIR
- ACTIVE_ACTIVE
- ACTIVE_PASSIVE
- REPLICA_SET
- WORKER_POOL
- SHARD_GROUP
- REGIONAL_REPLICA_GROUP
- VISUAL_GROUP_ONLY

Important:

~~~
Visual proximity
!=
deployment merge

Visual similarity
!=
semantic equivalence
~~~

## Compatibility before grouping

Before offering semantic twin/availability grouping, candidate compatibility dimensions include:

- module identity
- contract set/revision
- authority model
- configuration class
- tenant/classification scope
- deployment role
- provider/binding
- state synchronization model
- failover semantics
- data/currentness guarantees

Candidate drift states:

- CONTRACT_DRIFT
- REVISION_DRIFT
- CONFIGURATION_DRIFT
- AUTHORITY_DRIFT
- PLACEMENT_DRIFT
- HEALTH_DRIFT
- STATE_SYNC_UNKNOWN
- INCOMPATIBLE_FOR_TWIN_GROUP

## Logical crown and shared contract surface

Multiple runtime instances may be visually grouped under one logical module/service identity.

Candidate UI concept: LogicalServiceCrown.

A shared contract surface may be aggregated only when contract/guarantee compatibility is qualified.

Contract drift must break or qualify this aggregation.

## Drag semantics

Drag-and-drop must have explicit intention.

~~~
DRAG_TO_ARRANGE
= visual layout only

DRAG_TO_GROUP
= explicit grouping proposal

DRAG_TO_DEPLOY
= desired placement/topology mutation
~~~

Hard invariant:

~~~
Arrange
!=
Group
!=
Deploy
~~~

Proximity must never mutate topology.

Deployment changes require impact preview, explicit action and confirmation/review.

## Placement truth

Topology UI must preserve at least:

- DESIRED_PLACEMENT
- OBSERVED_PLACEMENT
- EFFECTIVE_PLACEMENT

Candidate additional states:

- PLACEMENT_PENDING
- PLACEMENT_EFFECTIVE
- PLACEMENT_DRIFT
- PARTIAL_PLACEMENT
- UNKNOWN_EFFECT
- RECONCILIATION_REQUIRED

~~~
Desired
!=
Observed
!=
Effective
~~~

## Hub locality in deployment

Candidate topology-specific hub classes:

- INTRA_HOST_HUB
- INTER_HOST_HUB
- EXTERNAL_PROVIDER_HUB
- CROSS_SYSTEM_HUB

Placement may change transport realization.

Possible realizations include in-process, IPC, HTTP, gRPC, queue, broker, stream and file/artifact exchange.

But:

~~~
Transport
!=
Contract
~~~

## Arrangement modes

The same topology/system can be rearranged by projection without changing truth.

Candidate arrangements:

- By Server / Host
- By Module
- By Capability
- By Availability Group
- By Environment
- By Region / Zone
- By System
- By Deployment Unit

Rearrangement changes representation only.

## Guided 3D navigation

Normal use should not require CAD/game navigation expertise.

Candidate camera modes:

- ISOMETRIC
- TOP
- FRONT
- FLOOR
- MODULE
- CAPABILITY
- CORRIDOR
- TOPOLOGY

Free orbit may exist as advanced exploration, not as a mandatory task mechanism.

The user should retain orientation through breadcrumbs, selected-object persistence, floor/module/capability context, minimap/overview, camera-mode indicator and deterministic return-to-context behavior.

## Semantic zoom / progressive disclosure

Candidate LOD:

DISTANT: silhouettes, aggregate status and module identity.

MID: capabilities, floor participation and primary relations.

NEAR: ports, counters, contracts, hubs, gates and handoffs.

SELECTED: detailed inspector-backed semantics.

Replica groups may collapse at distance and explode near/selected.

~~~
Aggregation
!=
silent omission
~~~

Critical gates/findings/currentness cannot disappear semantically because of LOD.

## Performance research

Preferred strategy:

~~~
simple geometry
-> selective labels
-> semantic zoom
-> instancing
-> LOD
-> clustering/aggregation
-> frustum/viewport culling
-> render-on-demand
-> Web Worker for heavy layout/analysis
-> renderer specialization only if measured
~~~

Avoid by default heavy reflections, volumetric lighting, particles, depth of field, motion blur, complex PBR, dynamic shadows everywhere and continuous decorative animation.

Initial research scenarios:

NORMAL: 50-200 modules, 5-10 floors, hundreds of relations/hubs/ports/handoffs and thousands of simple visible primitives.

STRESS: about 1000 modules, several thousand relations, mandatory clustering/aggregation.

## Accessibility

3D must never become the only way to understand or operate the system.

Required research targets:

- keyboard-reachable selection;
- non-drag alternatives;
- textual relation/route representation;
- list/table/tree/graph equivalents;
- non-color semantic redundancy;
- reduced-motion behavior;
- DOM focus management;
- predictable focus restoration;
- accessible command surfaces;
- no requirement for free camera control to complete a core task.

~~~
3D mode
!=
mandatory interaction mode
~~~

## Componentes inventory

The permanent Componentes workspace should catalog and test reusable 3D and topology elements.

Candidate inventory:

- ModuleNode
- ModuleWorkbox
- ModuleFace
- FloorManifestation
- HorizontalRelationPort
- VerticalFloorPort
- CapabilityShaft
- Door
- Counter
- Hub
- VerticalHub
- HorizontalHub
- LateralHub
- Gate
- HandoffMarker
- WorkItemMarker
- DeviationMarker
- 3DSelectionIndicator
- CameraModeControl
- ServerBasement
- ServerBasementSplit
- DeploymentTower
- TowerReplica
- TwinTowerGroup
- AvailabilityGroup
- LogicalServiceCrown
- SharedContractSurface
- PlacementLink
- DesiredPlacementIndicator
- ObservedPlacementIndicator
- EffectivePlacementIndicator
- PlacementDriftIndicator
- GroupingCandidate
- GroupingCompatibilityInspector
- DeploymentImpactPreview
- LODRepresentation
- AggregationRepresentation

Each should have explicit state matrices, interaction playback and alternate representations.

## Command surface integration

Canvas behavior must use the common Command Registry.

~~~
Command Registry
  -> Ribbon
  -> Context Menu
  -> Shortcut
  -> Command Palette
  -> Inspector
~~~

A command does not get reimplemented separately per surface.

Candidate contextual command families include Module, Floor, Capability, Contract, Hub, Gate, Handoff, Topology, Deployment, Availability and Evidence.

## Core invariants

- 3D semantic != 3D decorative.
- 3D Canvas != canonical authority.
- Map / Projection != canonical truth.
- Semantic identity survives projection changes.
- Module Identity != Deployment Placement != Runtime Instance.
- Shared structural vocabulary != identical module anatomy.
- Bounded Context = envelope; onion rings = semantic depth.
- Capability participation != semantic ownership.
- Floor participation != execution ownership.
- Contract != physical access point.
- Port/Entry Point exposes a contract.
- View != capability entry point.
- Workflow != onion ring.
- Data Flow != onion ring.
- Hub = structure; Flow = movement; Corridor Map = route projection.
- Visual connectability != semantic compatibility.
- Horizontal composition != vertical manifestation.
- Bypass != ordinary pass.
- Downstream state != proof of upstream gate passage.
- ACK != effect.
- Designed != observed != effective.
- Visual proximity != deployment merge.
- Visual similarity != semantic equivalence.
- Arrange != Group != Deploy.
- Drag proximity must not mutate topology.
- Desired placement != observed placement != effective placement.
- Shared contract surface requires qualified compatibility.
- Availability grouping != ownership merge.
- Transport != Contract.
- Aggregation != silent omission.
- 3D mode != mandatory interaction mode.
- Rendering technology != computation technology.

## Adversarial cases

Research must attack at least:

1. 3D becomes decorative/gimmicky and reduces task clarity.
2. User gets lost after camera/projection change.
3. LOD hides a critical gate/finding/currentness state.
4. Same semantic object receives different identity across projections.
5. Drag-only operation prevents accessible completion.
6. Tiny 3D ports become unusable.
7. Visual adjacency is misread as semantic compatibility.
8. Module Workbox duplicates semantic ownership.
9. Contract is confused with concrete transport.
10. Counter is confused with one specific form/view.
11. Capability shaft implies ownership hierarchy.
12. Observability presence is misread as execution ownership.
13. Downstream state is used to infer skipped upstream proof.
14. Handoff ACK is shown as completed business effect.
15. Twin towers are grouped despite contract/authority/config drift.
16. Proximity silently changes deployment.
17. Desired placement is displayed as already effective.
18. Cluster aggregation hides degraded/unknown instance state.
19. Shared contract surface masks guarantee differences.
20. Cross-view navigation loses revision/currentness context.
21. 3D performance collapse freezes inspection/selection.
22. Stress-scene optimization silently omits semantic objects.
23. Basement/host representation becomes canonical infrastructure authority.
24. Runtime instance identity is confused with module identity.
25. Same module on two hosts is treated as two semantic modules.

## Research benchmarks

Research sources/benchmarks should include, as relevant:

- DDD bounded contexts and context mapping;
- Hexagonal Architecture / Ports & Adapters;
- Onion/Clean Architecture concepts;
- BPMN sequence/message flow, choreography, pools/lanes;
- Petri nets/token-flow semantics;
- process mining and conformance checking;
- event sourcing/audit lineage;
- human task claim/accept/reassign/escalate;
- four-eyes / dual-control patterns;
- n8n / Node-RED / workflow editors;
- Photoshop / Office interaction shells;
- Canva / Budibase progressive disclosure;
- Blender/CAD/architecture viewers for guided 3D navigation;
- Kubernetes/topology/runtime/deployment visualization patterns;
- Three.js / React Three Fiber scene graph/performance techniques;
- accessible graph/canvas alternatives.

Benchmarking extracts interaction/semantic patterns, not branding/trade dress and not implementation authority.

## Open research questions

Key unresolved questions include:

- What is the final floor taxonomy, and which floors are universal vs optional?
- Which tower represents Module, Capability or Deployment Manifestation in each projection?
- How should towers with non-contiguous floor participation be represented?
- Which internal onion rings are universal primitives vs contextual categories?
- How are services/use cases distinguished from workflow activities in visual grammar?
- When should a contract surface aggregate across replicas?
- What exact compatibility vector qualifies twin/availability grouping?
- How should sharding differ visually from replication?
- How should stateful vs stateless replicas be represented?
- How should placement groups interact with regions/zones and failover?
- How should hubs represent sync, async, stream and artifact exchange without becoming transport-specific?
- What minimum evidence is needed to declare a handoff/gate EFFECTIVE?
- How should conformance overlay scale to large workflows?
- How much 3D freedom is useful before orientation cost exceeds value?
- What performance budget should become a hard design target?
- How are accessibility-equivalent operations proven complete?
- How should the System Builder generate equivalent 2D representations from the same semantic scene model?

## Research maturity criteria

This front should not be considered mature merely because the metaphor is visually attractive.

Material maturity requires convergence on:

- stable object vocabulary;
- stable identity rules;
- floor/tower/onion semantics;
- contract/port/counter distinctions;
- hub/flow/handoff/gate semantics;
- deployment placement semantics;
- replica/availability-group semantics;
- desired/observed/effective distinctions;
- cross-projection identity behavior;
- command/interaction contracts;
- accessibility alternatives;
- performance degradation strategy;
- Componentes inventory/state coverage;
- adversarial/proof obligations.

If new research only adds visual examples without changing these contracts, record NO_MATERIAL_DELTA rather than expanding scope.

## Working conclusion

The current hypothesis is a fractal, multi-projection engineering interface:

~~~
System
  -> floors / spheres
  -> module towers
  -> floor manifestations
  -> internal onion depth
  -> contracts / ports / counters
  -> hubs / flows / handoffs / gates
  -> deployment basements / runtime instances
  -> availability groups / twin towers
  -> evidence / conformance / currentness
~~~

The key design objective is that the user can move from a high-level system map down to module internals, workflow/data trajectories, deployment placement and runtime evidence without losing semantic identity.

The visual language should make complex architecture understandable while remaining subordinate to the canonical model.
