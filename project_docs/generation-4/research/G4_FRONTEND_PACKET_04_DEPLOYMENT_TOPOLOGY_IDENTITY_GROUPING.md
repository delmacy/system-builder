# G4 Frontend Packet 04 — Deployment Topology Identity & Grouping Qualification

Status: `RESEARCH_PACKET / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Objective

Qualify the smallest reusable semantic contracts required to project one logical module/service into multiple runtime/deployment manifestations on hosts without confusing module identity, runtime identity, placement, visual proximity, semantic grouping or effective topology.

This packet intentionally stays below full Topology Map/Workspace composition. It advances the semantic projection work into deployment-specific primitives/components before any complete topology surface is planned.

## Predecessor evidence

This packet reconciles the current round and the immediately preceding frontend foundation:

- Packet 03 established stable semantic/projection identity as the predecessor for higher Canvas composition and explicitly separated renderer identity from semantic identity.
- Manifestation-cardinality research established that geometry does not prove 1:1 identity or cardinality and that 1:N/N:1/N:N/unknown mappings must remain explicit.
- Canvas semantic-impact research established `reachable/adjacent != materially dependent`, typed dependency propagation, explicit unknown frontiers and the distinction `impact set != write set != refresh set`.
- The dedicated Main Composition Canvas 3D research introduced host/server basements, deployment towers, twin/availability groups, logical crowns, shared contract surfaces and explicit drag semantics.
- The provider-neutral performance benchmark now distinguishes semantic counts from rendered primitive counts and requires selection/currentness/critical markers to survive LOD, clustering, re-instancing and fallback.

## Material deltas reconciled

1. Deployment topology must reuse semantic identity primitives rather than create a topology-local identity model.
2. Host placement is a manifestation relation, not module ownership.
3. Availability grouping is a qualified relation over manifestations, not a consequence of visual adjacency.
4. A shared logical crown is a projection of common logical identity, not a merged runtime object.
5. A shared contract surface requires guarantee compatibility evidence; same API/schema or visual symmetry is insufficient.
6. Desired, observed and effective placement are independent state dimensions.
7. Drag intent must be typed before any topology mutation: arrange, group and deploy are distinct transitions.
8. Large replica sets must aggregate without hiding drift, UNKNOWN, selected/focused identity or disclosure constraints.

## Scope

Construction A research objects:

1. `DeploymentManifestationRef`
2. `HostPlacementRef`
3. `PlacementStateVector`
4. `GroupingCompatibilityVector`
5. `TopologyDragIntent`

Construction B may compose only after A returns qualified lower contracts:

6. `ServerBasement`
7. `DeploymentTower`
8. `GroupingCandidate`
9. `PlacementLink`
10. `PlacementDriftIndicator`

The following are deferred successor patterns until this packet closes:

- `TwinTowerGroup`
- `AvailabilityGroup`
- `LogicalServiceCrown`
- `SharedContractSurface`
- `ServerBasementSplit`
- `GroupingCompatibilityInspector`
- `DeploymentImpactPreview`
- complete `TopologyMap` / workspace.

## Non-goals

- no deployment engine;
- no infrastructure provider selection;
- no Kubernetes/container/orchestrator binding;
- no server discovery implementation;
- no runtime mutation;
- no renderer selection;
- no complete topology workspace;
- no claim that two equivalent-looking instances are failover-compatible;
- no automatic grouping from drag proximity;
- no inference that desired placement became effective.

## Core semantic contracts

### DeploymentManifestationRef

Must preserve:

`ModuleIdentity != DeploymentManifestationIdentity != RuntimeInstanceIdentity != RenderInstanceId`.

Candidate facts include logical module/service ref, manifestation identity, runtime-instance ref where observed, revision/currentness, environment, deployment role and evidence refs.

### HostPlacementRef

Qualifies the relation between a deployment manifestation and a host/deployment unit. Host identity must not become module identity. One module may have many manifestations and one host may contain many manifestations.

### PlacementStateVector

Must carry independently, where known:

- `DESIRED_PLACEMENT`
- `OBSERVED_PLACEMENT`
- `EFFECTIVE_PLACEMENT`
- currentness/evidence for each dimension.

Derived candidate dispositions include `PLACEMENT_PENDING`, `PLACEMENT_EFFECTIVE`, `PLACEMENT_DRIFT`, `PARTIAL_PLACEMENT`, `UNKNOWN_EFFECT`, `RECONCILIATION_REQUIRED`.

No transition may relabel desired or acknowledged placement as effective without effect evidence.

### GroupingCompatibilityVector

Semantic grouping qualification must evaluate, without collapsing dimensions:

- semantic module identity;
- contract set and contract revision;
- authority model;
- configuration class;
- tenant/classification scope;
- deployment role;
- provider/binding compatibility;
- state synchronization expectations;
- failover semantics;
- data/currentness guarantees.

Candidate per-dimension disposition: `COMPATIBLE`, `INCOMPATIBLE`, `UNKNOWN`, `NOT_APPLICABLE`, each with evidence/currentness.

Overall grouping cannot become `compatible` by majority vote. A hard incompatible/unknown dimension remains visible according to group policy.

### TopologyDragIntent

Typed intent must precede action:

- `DRAG_TO_ARRANGE` — presentation/layout only;
- `DRAG_TO_GROUP` — explicit grouping proposal requiring qualification;
- `DRAG_TO_DEPLOY` — desired-placement mutation proposal requiring impact preview/review.

`Pointer movement != semantic intent`.

`Proximity != group`.

`Group proposal != deployment mutation`.

## Required states and transitions

Research must exercise at least:

`UNRESOLVED -> QUALIFYING -> QUALIFIED | INCOMPATIBLE | UNKNOWN`

`UNGROUPED -> GROUP_CANDIDATE -> QUALIFYING -> GROUPABLE | REJECTED | UNKNOWN`

`DESIRED_PLACEMENT_CHANGED -> PLACEMENT_PENDING -> OBSERVED_CHANGED -> EFFECTIVE_VERIFIED`

with alternative outcomes `PLACEMENT_DRIFT`, `PARTIAL_PLACEMENT`, `UNKNOWN_EFFECT`, `RECONCILIATION_REQUIRED`.

Drag transitions:

`IDLE -> DRAGGING_PRESENTATION -> ARRANGED`

`IDLE -> DRAGGING_GROUP_CANDIDATE -> QUALIFYING -> GROUP_PROPOSED | REJECTED | UNKNOWN`

`IDLE -> DRAGGING_DEPLOYMENT -> IMPACT_REQUIRED -> REVIEWED -> DESIRED_PLACEMENT_CHANGED | CANCELLED`

Keyboard/non-drag paths must reach the same semantic intents.

## Failure / recovery

Required scenarios:

- host observation becomes stale during grouping qualification;
- one twin candidate changes revision after compatibility was computed;
- contract compatibility remains valid but authority/configuration drifts;
- deployment ACK arrives without effect evidence;
- observed placement appears on a different host than desired;
- one manifestation disappears while the logical module remains valid;
- grouping qualification is interrupted and resumes against a newer revision;
- renderer re-instancing changes local ids while selection/group candidate survives;
- aggregated replica group contains one critical drift/UNKNOWN member;
- fallback 2D/textual topology remains able to expose the same selected identity and placement state.

Recovery must requalify changed evidence; cached compatibility cannot silently survive superseding revision/currentness.

## Accessibility obligations

- every tower/basement/group candidate has a textual/list/tree equivalent;
- arrange/group/deploy have keyboard and command-surface alternatives;
- focus remains distinct from semantic selection;
- group compatibility/drift is not color-only;
- aggregate group can expose critical members without requiring 3D camera manipulation;
- basement split/reveal, when later composed, must have an equivalent disclosure control in DOM;
- reduced-motion suppresses unnecessary spatial travel while preserving destination/context.

## Performance obligations

Reuse the provider-neutral benchmark discipline:

- logical module count, deployment manifestation count, runtime instance count and rendered primitive count remain separate;
- NORMAL scenes must tolerate multiple manifestations per logical module without forcing individual materialization of every distant instance;
- STRESS scenes may cluster/aggregate replica groups;
- selected/focused identity, critical placement drift, UNKNOWN effect/currentness and disclosure-safe navigation retain a representation floor;
- aggregation cannot report a healthy/equivalent group if a material member is incompatible/unknown unless the qualification is visibly bounded;
- renderer-local instance ids never become topology identity.

## `Componentes` impact

Add/qualify scenario records for:

- `DeploymentManifestationRef`
- `HostPlacementRef`
- `PlacementStateVector`
- `GroupingCompatibilityVector`
- `TopologyDragIntent`
- `ServerBasement`
- `DeploymentTower`
- `GroupingCandidate`
- `PlacementLink`
- `PlacementDriftIndicator`

Preserve metadata candidates: id, name, category, compositionLevel, lifecycle, purpose, inputs, outputs, events, states, transitions, dependencies, tokens, icons, a11y, composedOf, usedBy, revision/source/test evidence.

Deferred successor records remain visible in the inventory as research candidates, not qualified components: `TwinTowerGroup`, `AvailabilityGroup`, `LogicalServiceCrown`, `SharedContractSurface`, `ServerBasementSplit`, `GroupingCompatibilityInspector`, `DeploymentImpactPreview`.

## Adversarials

1. Two towers are visually adjacent but semantically unrelated.
2. Same module identity, different contract revision.
3. Same contract/schema, incompatible authority model.
4. Active/passive-looking geometry but failover semantics unknown.
5. Group appears healthy while one member has stale state-sync evidence.
6. Drag-to-arrange accidentally writes desired placement.
7. Deployment ACK is rendered as effective placement.
8. Logical crown is treated as a runtime owner.
9. Shared contract surface hides guarantee drift.
10. LOD cluster hides a selected or drifted member.
11. Basement host becomes semantic owner of module.
12. Runtime instance restart creates false new module identity.
13. Replica count leaks inaccessible/undisclosed membership.
14. Transport change is interpreted as contract change without evidence.
15. Cross-region placement is grouped despite incompatible currentness/failover guarantees.

## Proof obligations

A closes only if it can show:

1. module/logical identity survives multiple deployment/runtime manifestations;
2. placement relation does not transfer semantic ownership;
3. desired/observed/effective remain independently representable and evidenced;
4. compatibility vector preserves unknown/incompatible dimensions without majority flattening;
5. grouping cannot be derived from proximity;
6. arrange/group/deploy intents are distinguishable before mutation;
7. revision/currentness changes invalidate the material compatibility claims they supersede;
8. selection survives runtime restart/re-instancing where canonical/manifestation identity remains resolvable.

B closes only if it can show:

9. `ServerBasement` + `DeploymentTower` composition preserves A identities;
10. `GroupingCandidate` remains proposal/qualification state, not an AvailabilityGroup;
11. `PlacementLink` distinguishes desired/observed/effective evidence;
12. `PlacementDriftIndicator` cannot be hidden by aggregation;
13. equivalent non-3D interaction/inspection paths exist;
14. no B component invents TwinTower/Availability/SharedContract semantics before qualification.

## Construction A handoff

Research exactly the five lower contracts. Produce:

- candidate contract shape for each;
- state/transition matrices;
- identity/cardinality/currentness rules;
- failure/recovery table;
- accessibility equivalents;
- `Componentes` scenario matrix;
- explicit pass/fail/unknown proof against obligations 1-8.

Do not compose TwinTowerGroup, AvailabilityGroup, LogicalServiceCrown or SharedContractSurface.

## Construction B handoff

Consume A only if A materializes the five contracts with no blocking unknown in their core invariants. Then research only `ServerBasement`, `DeploymentTower`, `GroupingCandidate`, `PlacementLink`, `PlacementDriftIndicator` and prove obligations 9-14.

If A remains incomplete, B records the exact missing predecessor and does not bypass it.

## Closure criteria

Packet 04 reaches `DOCUMENTALLY_QUALIFIED` only when:

- all A obligations have evidence;
- B composition does not collapse identity or placement dimensions;
- keyboard/textual equivalents are specified;
- aggregation/performance behavior preserves critical semantics;
- `Componentes` scenarios cover happy, drift, unknown, stale, restart/re-instancing and cancellation/recovery cases;
- no provider/renderer/runtime implementation choice is smuggled into the contract;
- successor topology patterns have explicit predecessor dependencies.

Otherwise record the bounded unresolved dimension and keep successor topology composition blocked.

## Maturity

`PACKET_04_MATERIALIZED / A_READY / B_CONDITIONAL / TOPOLOGY_COMPOSITION_BLOCKED_PENDING_PRIMITIVE_QUALIFICATION`
