# G4 — Main Composition Canvas 3D, Towers, Floors, Hubs & Deployment Topology Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no product implementation authority
Branch: `research/g4-product-rnd-foundations`

## Purpose

This artifact consolidates the current Generation 4 research direction for the System Builder main composition interface. It is a semantic engineering workspace hypothesis, not decorative 3D and not canonical authority.

The shell remains accessible React/DOM around a specialized WorkSurface. 2D Composition, semantic 3D Building/Onion, Floor, Capability, Relation Graph, Workflow, Corridor/Handoff, Deployment/Topology, Infrastructure, Observability and Evidence/Audit are peer projections of the same semantic substrate.

## Stable invariants

- `3D semantic != 3D decorative`.
- `Canvas / View / Map != Canonical Model`.
- `Semantic identity survives projection changes`.
- `Module Identity != Deployment Placement != Runtime Instance != Render Instance`.
- `Capability participation != semantic ownership`.
- `Horizontal composition != vertical manifestation`.
- `Visual connectability != semantic compatibility`.
- `Visual proximity != deployment merge`.
- `Visual similarity != semantic equivalence`.
- `Arrange != Group != Deploy`.
- `Desired != Observed != Effective`.
- `Transport != Contract`.
- `Aggregation != silent omission`.
- `ACK != effect`.
- `3D mode != mandatory interaction mode`.

## Spatial and semantic grammar

The 3D hypothesis uses X for horizontal module/context composition, Y for typed floors/spheres and Z/radial depth for module-internal semantic depth. Global floors remain distinct from module-internal onion layers. Capability shafts express cross-cutting participation, not ownership. Hubs are structural interconnections; flows are movement; corridors project expected/allowed progression.

A module may appear as a flexible-height tower across floors. Each module-floor intersection is a manifestation, not a duplicate module. A manifestation may expose a partial internal onion containing core/domain state, services/use cases/orchestration, contracts/ports/input-output and provider/binding/adapter/gateway realization where applicable.

`+ horizontal` proposes a qualified relation/composition. `+ vertical` proposes or exposes another floor manifestation only when cardinality and eligibility permit it. Geometry never proves cardinality or compatibility.

## Access and circulation grammar

```text
Capability = what must be possible
Contract = guarantees/requirements
Port / Door = where a contract is exposed/admitted
Counter = operation/service/action entry surface
Input/Output = what crosses the boundary
Provider/Binding = selected realization source
Adapter/Driver/Gateway = concrete translation/realization
```

`Contract != physical access point`.

Designed and observed progression remain separate. Downstream state never proves an upstream required gate passed. Bypass requires explicit authority/evidence. Acceptance, ACK, execution and effective outcome remain separately representable.

## Module Workbox

Selecting a module can reveal a contextual Module Workbox with applicable faces such as Overview, Capabilities/Services, Entry Points/Counters, Contracts/Ports, Dependencies/Relations, Providers/Bindings, Adapters/Drivers, Plugins/Extensions, Configuration, Data, Events/Workflow, Security/Authority, Runtime/Deployment, Observability and Evidence/History. Face applicability is semantic and contextual; permission-limited is not the same as non-applicable.

## Deployment basements and towers

Servers/hosts may be projected as deployment foundations/basements from which deployment towers emerge. A basement split/reveal may show CPU, memory, runtime, network, storage, region/zone, deployment unit, health/capacity and placement evidence. These are infrastructure/deployment facts, not ownership of the logical module.

The same logical module/service can have multiple deployment manifestations and runtime instances. A runtime restart can replace instance identity while preserving logical module/service identity and possibly deployment-manifestation lineage.

### External benchmark: logical service vs instance identity

OpenTelemetry semantic conventions independently distinguish a logical `service.name` from `service.instance.id`: horizontally scaled instances share the service name while each simultaneous service instance has a distinct instance id. OpenTelemetry also warns observers not to set an instance id when they cannot unambiguously determine the generating instance.

Portable SB rule:

```text
same logical service != same runtime instance

observer cannot disambiguate instance
=> instance identity UNKNOWN / unresolved
=> never mint a convenient synthetic identity as observed truth
```

Observability joins inherit this rule: telemetry that proves only logical-service identity must not be rendered as instance-specific health/effect evidence.

## Availability grouping is policy-relative, not symmetry-relative

The `TwinTowerGroup` metaphor is useful only as one projection of a broader qualified availability/replica relation.

Kubernetes topology-spread constraints provide an important contradictory benchmark to a naive twin-pair model: replicas may intentionally be distributed across failure domains such as hosts, zones and regions, and multiple spread constraints can apply together. High availability can therefore depend on **separation**, not visual adjacency or pair symmetry.

Consequences:

```text
Twin-looking geometry != HA proof
same host != useful failure-domain redundancy
same zone != cross-zone resilience
spread across zones != failover/effect compatibility
replica count != availability guarantee
```

A grouping qualification must name the protected failure domain and policy. Candidate dimensions now include:

- logical module/service identity;
- contract set/revision and guarantee vector;
- authority model/currentness;
- configuration class;
- tenant/classification/disclosure scope;
- deployment role;
- provider/binding compatibility;
- state synchronization model/currentness;
- failover semantics;
- data/effect settlement guarantees;
- host/node identity;
- zone/region/failure-domain identity;
- anti-affinity/spread requirement where applicable;
- health/availability evidence currentness.

`GroupingCompatibilityVector` is therefore policy/invariant-relative and cannot flatten dimensions by majority vote. Candidate per-dimension dispositions remain `COMPATIBLE`, `INCOMPATIBLE`, `UNKNOWN`, `NOT_APPLICABLE`, each with evidence/currentness.

### Group kind does not imply guarantee

`AVAILABILITY_PAIR`, `ACTIVE_ACTIVE`, `ACTIVE_PASSIVE`, `REPLICA_SET`, `WORKER_POOL`, `SHARD_GROUP`, `REGIONAL_REPLICA_GROUP` and `VISUAL_GROUP_ONLY` are candidate relation kinds. Their labels do not themselves prove availability, failover, synchronization or contract equivalence. A group carries an explicit guarantee/policy qualification rather than deriving it from the group kind.

## Stateful groups require role/identity/consensus semantics

External evidence sharpens the distinction between stateless replicas and stateful members. Kubernetes StatefulSet preserves sticky per-member identity, stable network/storage identity and ordered deployment/update behavior; its members are explicitly not interchangeable in the same way as ordinary stateless replicas. Partitioned rolling updates can intentionally keep lower ordinals on an old version while higher ordinals run a new version. A ZooKeeper ensemble further demonstrates that a set of healthy-looking members is not enough for write availability: leader election and quorum are required before writes can be acknowledged/visible.

Portable UI consequence:

```text
STATELESS_REPLICA_SET
!=
STATEFUL_MEMBER_SET
!=
QUORUM_GROUP
!=
SHARD_GROUP
```

A stateful topology group therefore needs candidate dimensions beyond replica compatibility:

- `memberIdentity` / ordinal or equivalent stable role identity;
- `storageIdentity` and attachment/currentness where relevant;
- `role`: LEADER / FOLLOWER / CANDIDATE / LEARNER / UNKNOWN / provider-specific qualified role;
- `termEpochGeneration` where the protocol exposes one;
- `votingEligibility`;
- `quorumRequirement` and current quorum evidence;
- `writeAuthority` / effect authority;
- `readAdmissibility` and consistency profile;
- `replicationProgress` / lag / UNKNOWN;
- `shardOwnership` / partition ownership where applicable;
- `fencingEvidence` for displaced leaders/owners;
- `memberRevision` / contract profile / semantic generation;
- `memberHealth` separately from semantic role/admissibility.

Hard rules:

```text
READY != VOTING
HEALTHY != LEADER
LEADER_LABEL != CURRENT_WRITE_AUTHORITY
REPLICA_PRESENT != QUORUM
QUORUM != ALL_MEMBERS_CURRENT
STABLE_MEMBER_IDENTITY != RUNTIME_PROCESS_IDENTITY
SHARD_MEMBERSHIP != SHARD_OWNERSHIP
FAILOVER != SAFE_PROMOTION
```

The Canvas should therefore avoid rendering a stateful group as symmetric twin towers unless the chosen projection intentionally suppresses role differences and a peer representation exposes them. A candidate `StatefulGroupCrown` may show logical group identity while member crowns/badges expose role, epoch/currentness and storage/shard attachment. The crown remains projection, never consensus authority.

### Split-brain and promotion

When evidence indicates two simultaneous leaders/owners for a single-writer invariant, the UI must not pick a winner from recency, geometry or health. Candidate disposition: `CONFLICTING_AUTHORITY / SPLIT_BRAIN_SUSPECTED`, with explicit fencing/reconciliation required. If authority evidence is incomplete, use `UNKNOWN_AUTHORITY`, not a green leader badge.

Promotion sequence must remain evidence-separated:

```text
PROMOTION_DESIRED
-> PROMOTION_ACKNOWLEDGED
-> OLD_AUTHORITY_FENCED ?
-> NEW_ROLE_OBSERVED
-> QUORUM/REPLICATION QUALIFIED ?
-> EFFECTIVE_WRITE_AUTHORITY
```

No intermediate state implies the final one.

## Rolling coexistence changes SharedContractSurface semantics

Partitioned/staged StatefulSet updates provide a concrete benchmark for mixed revisions intentionally coexisting inside one logical group. Therefore a logical crown may remain shared while a contract surface must be revision/profile-qualified.

Candidate rule:

```text
same logical group/service
+ mixed implementation/member revisions
=> LogicalServiceCrown may remain unified
=> SharedContractSurface only remains unified for the declared common admissible guarantee/profile intersection
```

If consumers are pinned to different semantic profiles, the UI should split or facet the contract surface by profile rather than imply one current surface. `Latest member revision` is not automatically the group's effective contract. A rolling update may be `PARTIAL_ROLLOUT` while service remains effective for an older common profile.

Candidate rolling states:

- `ROLLOUT_STAGED`;
- `ROLLOUT_IN_PROGRESS`;
- `MIXED_REVISION_EFFECTIVE`;
- `PARTIAL_ROLLOUT`;
- `ROLLOUT_BLOCKED`;
- `ROLLBACK_REQUIRED`;
- `ROLLBACK_IN_PROGRESS`;
- `ROLLOUT_RECONCILED`;
- `CONTRACT_PROFILE_DRIFT`.

A failed member becoming non-ready can halt an ordered rollout; rollback itself may require additional repair. UI recovery semantics therefore cannot reduce rollback to a single reversible animation.

## Logical crown and shared contract surface

`LogicalServiceCrown` projects one logical identity above multiple manifestations/instances. It is not a runtime owner.

`SharedContractSurface` is stricter: it may aggregate a contract surface only when relevant guarantee dimensions are qualified as equivalent/compatible for the declared consumer context. Same schema, endpoint shape or service name is insufficient. Contract, authority, configuration, currentness or effect drift must split/qualify the surface or yield `UNKNOWN/PARTIAL` rather than preserve a false common façade.

## Desired, observed and effective topology

Placement truth remains a vector:

```text
DESIRED_PLACEMENT
OBSERVED_PLACEMENT
EFFECTIVE_PLACEMENT
```

with evidence/currentness per dimension and derived states such as `PLACEMENT_PENDING`, `PLACEMENT_EFFECTIVE`, `PLACEMENT_DRIFT`, `PARTIAL_PLACEMENT`, `UNKNOWN_EFFECT`, `RECONCILIATION_REQUIRED`.

A scheduler/provider ACK is not effect evidence. A host observation is not necessarily effective business readiness. A healthy runtime is not necessarily semantically admissible.

## Drag and direct manipulation

Typed intent precedes semantic action:

- `DRAG_TO_ARRANGE`: presentation only;
- `DRAG_TO_GROUP`: explicit grouping proposal followed by qualification;
- `DRAG_TO_DEPLOY`: desired-placement mutation proposal followed by impact/review.

Pointer movement or proximity never selects one of these intents implicitly.

WCAG 2.2 SC 2.5.7 strengthens the accessibility requirement: functionality implemented by dragging needs a single-pointer alternative that does not require dragging. Keyboard equivalence alone is insufficient. Each topology drag action therefore needs keyboard/command access **and** a click/tap path, e.g. `Arrange…`, `Add to group…`, `Move/Deploy to…` through pickers/menus/dialogs.

## Accessibility peer projection

Every decision-relevant 3D identity/relation requires a peer non-spatial representation. Tree/treegrid/list/table/graph projections preserve semantic selection while keeping DOM focus distinct. ARIA treegrid practice independently reinforces that navigation focus and selection are separate dimensions.

Required properties:

- selected semantic identity can be focused/inspected without free-camera manipulation;
- focus movement does not silently alter semantic selection;
- arrange/group/deploy have keyboard and single-pointer non-drag paths;
- compatibility/drift is not color-only;
- aggregate groups can disclose critical members without spatial dexterity;
- reduced motion removes travel/animation, not semantic feedback;
- basement split/reveal has a DOM disclosure equivalent.

Stateful-group peer representations must additionally expose member identity, role, revision/profile, storage/shard attachment, quorum contribution and authority/currentness without relying on tower position or color. Treegrid remains a candidate because navigation focus and selection can be modeled separately; role/action cells need explicit editing/action mode rather than stealing navigation keys.

## Hub locality and transport

Candidate topology hub classes remain `INTRA_HOST_HUB`, `INTER_HOST_HUB`, `EXTERNAL_PROVIDER_HUB`, `CROSS_SYSTEM_HUB`.

Placement can change realization (in-process, IPC, HTTP/gRPC, queue/broker, stream, artifact exchange) without redefining the contract. Operational consequences such as latency, failure domain, ordering or delivery guarantees remain visible evidence, but `Transport != Contract`.

## Arrangement, LOD and performance

Topology can be arranged by Server/Host, Module, Capability, Availability Group, Environment, Region/Zone, System or Deployment Unit. Arrangement changes representation, not identity.

At distance, replica groups may collapse into aggregate cards/towers. Near/selected views may explode members/basements. Aggregation must preserve a representation floor for selected/focused identity, critical drift, UNKNOWN effect/currentness and disclosure-safe navigation.

For stateful groups, aggregate LOD must preserve at least: conflicting/unknown authority, quorum loss/unknown, mixed revision/profile, material replication lag/unknown, shard ownership conflict and fencing-required status. A green aggregate cannot be computed from majority health if a protected invariant is violated.

Preferred rendering research remains simple geometry, selective labels, semantic zoom, instancing, LOD, clustering/aggregation, culling, render-on-demand, label virtualization and workers for heavy layout/analysis before specialization. Renderer performance state is distinct from system health. Environment/viewport/DPR/browser/refresh/cold-warm/degradation are benchmark evidence dimensions; no global FPS number defines semantic qualification.

## Componentization map

```text
C0 tokens
-> C1 atomic primitives
-> C2 compound navigation/input
-> C3 semantic projection primitives
-> C4 domain-semantic building blocks
-> C5 module components
-> C6 tools
-> C7 specialized WorkSurfaces
-> C8 workspace shell/orchestration
-> C9 complete task pages
-> C10 system/cross-workspace views
-> C11 scale/conformance hardening (cross-cutting)
```

Topology-specific placement:

- C3: `DeploymentManifestationRef`, `HostPlacementRef`, `PlacementStateVector`, `GroupingCompatibilityVector`, `TopologyDragIntent`, `StatefulMemberRef`, `RoleAuthorityState`, `QuorumState`, `RevisionProfileFacet`;
- C4: `ServerBasement`, `DeploymentTower`, `TowerReplica`, `GroupingCandidate`, `PlacementLink`, `PlacementDriftIndicator`, `StatefulMemberTower`, `ShardOwnershipIndicator`, `AuthorityConflictIndicator`;
- C5/C6: `GroupingCompatibilityInspector`, `DeploymentImpactPreview`, `StatefulGroupInspector`, `PromotionImpactPreview`, topology-aware Inspector/commands;
- C7: Topology WorkSurface;
- C8+: complete topology workspace/task orchestration;
- cross-cutting successor patterns: `TwinTowerGroup`, `AvailabilityGroup`, `LogicalServiceCrown`, `SharedContractSurface`, `StatefulGroupCrown` only after lower contracts qualify them.

## Componentes impact

The permanent Componentes research inventory must include state/scenario records for ServerBasement/ServerBasementSplit, DeploymentTower/TowerReplica, TwinTowerGroup/AvailabilityGroup, LogicalServiceCrown/SharedContractSurface, PlacementLink and Desired/Observed/Effective indicators, PlacementDriftIndicator, GroupingCandidate/GroupingCompatibilityInspector, DeploymentImpactPreview, TopologyDragIntent and non-drag command alternatives, aggregate/LOD representation, ambiguous runtime-instance identity, failure-domain grouping qualification, cross-zone/cross-region grouping, stale compatibility evidence, telemetry resolved only to logical service, renderer pressure/fallback/recovery, StatefulMemberRef/StatefulMemberTower, RoleAuthorityState, QuorumState, ShardOwnershipIndicator, AuthorityConflictIndicator, RevisionProfileFacet, StatefulGroupInspector and PromotionImpactPreview.

Metadata/evidence preserves component identity, composition level, states/transitions, `composedOf/usedBy`, revision/source/test evidence, environment profile where performance-relevant and scenario-specific proof disposition.

## New adversarial cases

1. Two replicas on the same host are shown as a high-availability pair.
2. Two replicas in different zones are labeled failover-compatible solely because they are spread.
3. Replica count is rendered as availability guarantee.
4. Logical-service telemetry is incorrectly attributed to one runtime instance.
5. Observer fabricates an instance id to make a tower look resolved.
6. Runtime restart is rendered as a new logical module.
7. Shared contract crown remains unified after guarantee/authority drift.
8. `DRAG_TO_DEPLOY` is keyboard accessible but has no click/tap non-drag alternative.
9. Visual rearrangement accidentally mutates desired placement.
10. Provider ACK is shown as effective placement.
11. Aggregate cluster says healthy while one material member is UNKNOWN/stale.
12. Group qualification ignores failure-domain policy.
13. Same service name across incompatible tenant/classification scopes is grouped.
14. Basement/host becomes semantic owner of the module.
15. Cross-region placement changes transport characteristics and UI incorrectly reports a contract change.
16. Stateful members are rendered as interchangeable stateless replicas despite stable storage/network identity.
17. Healthy follower is rendered as write-authoritative.
18. Leader label from stale evidence is treated as current write authority.
19. Majority member health is rendered as quorum despite voting/role uncertainty.
20. Two leaders are resolved visually by newest timestamp rather than explicit fencing/reconciliation evidence.
21. Shard membership is rendered as ownership.
22. Mixed rolling revisions are flattened into one latest SharedContractSurface.
23. Rollout ACK/progress is rendered as semantic-profile activation for all members.
24. Rollback animation implies old authority/security/profile automatically restored.
25. Aggregate LOD hides quorum loss, authority conflict or mixed-profile state.

## Proof obligations added by this synthesis

1. Logical service/module identity remains stable across multiple simultaneous runtime instances.
2. Runtime instance identity is never invented when observation cannot disambiguate it.
3. Instance-specific evidence cannot be derived from logical-service-only telemetry.
4. Availability/group compatibility names the protected failure-domain/policy; geometry and replica count are insufficient.
5. Distribution across nodes/zones/regions does not itself prove failover, synchronization or effect compatibility.
6. Shared contract aggregation requires qualified guarantee compatibility, not schema/name similarity.
7. Desired/observed/effective placement remain separately evidenced through ACK, observation and verification.
8. Every drag semantic has keyboard and single-pointer non-drag equivalents.
9. Focus and semantic selection remain separate in non-spatial peer projections.
10. Aggregation/LOD preserves selected and critical incompatible/unknown members.
11. Renderer degradation/fallback never changes topology semantics.
12. Host placement never transfers module ownership.
13. Group-kind labels never become guarantee proof.
14. Runtime restart/re-instancing preserves resolvable logical/manifestation identity lineage without preserving a false instance identity.
15. Compatibility evidence is invalidated/requalified when material revision/currentness/failure-domain facts change.
16. Stateful stable member identity remains distinct from transient runtime/process identity and host placement.
17. Role/leader observation never becomes write authority without current authority/fencing/quorum qualification required by the protected invariant.
18. Replica/member presence or health never fabricates quorum.
19. Split-brain/conflicting ownership remains explicitly representable and cannot be visually auto-resolved.
20. Shard ownership is separately evidenced from group membership.
21. Rolling coexistence can preserve one logical crown while exposing multiple revision/profile facets.
22. SharedContractSurface exposes only a qualified common admissible guarantee/profile; it does not inherit the numerically latest member revision.
23. Rollout/rollback progress remains separate from effective semantic-profile and authority transitions.
24. Stateful-group aggregate LOD preserves quorum/authority/shard/revision conflicts and UNKNOWN states.
25. Non-spatial peer projections expose stateful member role, identity, revision/profile and authority without color/position-only meaning.

## Complete-task scenarios to retain

Research continues testing create/edit/review/simulate/authorize/publish/operate/audit/recover, including:

- propose placement -> review impact -> commit desired -> provider ACK -> observed -> effective verification;
- group replicas -> compatibility qualification -> drift after qualification -> invalidate/reconcile;
- move from same-host replicas to zone-spread replicas without falsely declaring HA before failover proof;
- runtime restart -> new instance identity -> logical crown continuity;
- telemetry ambiguity -> instance UNKNOWN -> operator resolves/refreshes without fabricated certainty;
- offline/stale topology -> reconnect -> requalify desired/observed/effective and group compatibility;
- partial deployment success -> preserve desired/observed split and unknown effects;
- renderer failure -> 2D/textual fallback -> preserve selection/draft -> recover 3D;
- cross-projection handoff Topology <-> Module <-> Evidence preserving identity/revision/currentness;
- large replica set -> aggregate -> inspect critical member -> explode/reaggregate without semantic omission;
- stateful leader fails -> promotion desired -> old authority fencing unknown -> remain non-effective/blocked rather than declaring success;
- quorum loss with healthy minority -> preserve health facts while write admissibility becomes blocked/unknown;
- shard move -> membership changes -> ownership transfer remains pending until authority/fencing/effect evidence qualifies it;
- partitioned rolling update -> old/new member revisions coexist -> logical crown stable -> SharedContractSurface facets by common/qualified profile;
- failed ordered rollout -> rollout blocked -> rollback requested -> repair required -> reconciled, without pretending rollback is instantaneous reversal;
- split-brain observation -> conflicting authority indicator survives aggregation and 3D-to-list fallback.

## Maturity / saturation

- Semantic 3D vocabulary: advancing, not saturated.
- Cross-projection identity: advancing; executable proof remains future work.
- Deployment identity/placement: material semantics identified, not saturated.
- Availability grouping: advancing; failure-domain and guarantee-policy qualification are explicit.
- Stateful topology grouping: **materially advanced, not saturated**; stable member identity, quorum/role/authority, split-brain and rolling mixed-revision semantics are now explicit, while provider-independent consensus/shard transfer proof vocabulary remains open.
- SharedContractSurface during rolling evolution: materially advanced; common-profile/faceted projection rule identified, exact profile compatibility algebra remains open.
- Accessibility: advancing; drag alternatives are stricter, but peer-projection completeness remains open.
- Performance: environment/threshold methodology is stronger; empirical SB traces remain absent.
- Componentization: dependency map is substantially clearer; higher-level workspaces/task pages remain intentionally unqualified.

## Highest-value remaining vectors

1. Provider-independent shard/partition ownership transfer and rebalancing semantics, including fencing and partial transfer.
2. Exact SharedContractSurface compatibility algebra under mixed semantic profiles, especially old/new consumers during staged rollout.
3. Topology disclosure/security: what host/zone/instance/group membership may be shown to each authority/classification scope without leaking infrastructure.
4. Empirical Componentes scenarios proving selection/focus/identity continuity across aggregate/explode/fallback.
5. Live occurrence + deployment evolution: how pinned in-flight obligations interact with runtime placement/failover and successor design revisions.
