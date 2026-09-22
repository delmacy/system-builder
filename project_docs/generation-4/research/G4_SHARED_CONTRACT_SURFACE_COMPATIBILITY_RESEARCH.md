# G4 — SharedContractSurface Compatibility Algebra Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no implementation authority
Branch: `research/g4-product-rnd-foundations`

## Purpose

This bounded artifact deepens the open `SharedContractSurface` gap from the Main Composition Canvas / deployment-topology research. It defines an implementation-independent model for showing what a mixed-revision logical service can actually promise while several member revisions/profiles coexist.

The UI surface is a projection of qualified compatibility evidence. It is never the contract authority itself.

## Evidence classes

Primary standards/docs consulted in this research round:

- Semantic Versioning 2.0.0: compatibility statements are meaningful only relative to a declared public API; minor/patch conventions do not replace explicit API semantics.
- Protocol Buffers best practices: clients and servers are not upgraded atomically and rollback can occur; compatibility therefore has to tolerate mixed generations rather than assume synchronized rollout.
- OpenAPI versioning/migration guidance: even apparently nearby specification versions can carry compatibility constraints; schema/specification compatibility is contextual and cannot be inferred from visual/version proximity alone.
- OpenAPI Overlay: repeatable transforms can describe changes without replacing the target description, reinforcing the distinction between a base contract identity and qualified deltas/projections.

Evidence class: `PRIMARY_STANDARD_OR_OFFICIAL_DOCUMENTATION`.

## Core finding — compatibility is a relation over guarantee vectors

A SharedContractSurface MUST NOT be computed as `min(version)`, `max(version)`, majority version, newest healthy member, or string intersection of schemas.

Candidate model:

```text
ContractProfile {
  semanticIdentity
  revisionIdentity
  interactionKind
  operationSet
  requestAcceptance
  responseGuarantees
  errorGuarantees
  orderingGuarantees
  consistencyGuarantees
  idempotencyGuarantees
  authorityRequirements
  securityRequirements
  currentnessRequirements
  sideEffectSemantics
  evidenceRequirements
  deprecationDisposition
}
```

Compatibility is evaluated for a declared consumer/interaction requirement against provider/member guarantees:

```text
Compatible(requirement, profile, context)
= profile guarantees every material requirement
  under the same declared semantic/security/currentness context
```

This is directional. `A can serve B` does not imply `B can serve A`.

Hard rules:

```text
SCHEMA_READABLE != CONTRACT_COMPATIBLE
SAME_MAJOR_VERSION != PROVEN_COMPATIBLE
NEWER_VERSION != STRONGER_GUARANTEE
COMMON_FIELD_SET != COMMON_SEMANTICS
HEALTHY_MEMBER != ADMISSIBLE_MEMBER
SUPPORTED_PROFILE != ADMISSIBLE_PROFILE
ROLLBACKABLE_BINARY != ROLLBACKABLE_SEMANTICS
```

## SharedContractSurface derivation

For a logical service group `G` with currently eligible members `m1..mn`, the SharedContractSurface for interaction requirement/context `R,C` is the set of guarantees that are both:

1. explicitly declared by the member profiles;
2. semantically equivalent for the relevant interaction;
3. admissible under current authority/security/currentness policy;
4. supported by sufficient current evidence;
5. available across the member set required by the routing/availability policy.

Candidate derivation:

```text
Eligible(m, C)
= health-qualified
  AND authority-qualified where required
  AND security-qualified
  AND currentness-qualified
  AND profile evidence resolvable

SharedSurface(G, C)
= QualifiedIntersection(
    Guarantees(m, C)
    for m in RequiredEligibleMembers(G, C)
  )
```

`QualifiedIntersection` is semantic, not textual. If equivalence cannot be proven, disposition is `UNKNOWN`, not optimistic intersection.

The required member set depends on routing semantics. A request routed to any member requires guarantees common to every member that may legitimately receive it. A pinned/canary route may expose a narrower profile-qualified surface, but the UI must show that the guarantee is route-scoped rather than group-wide.

## Surface states

Candidate state vector:

- `UNIFORM_QUALIFIED` — required members expose one qualified profile/guarantee vector;
- `MIXED_COMPATIBLE` — profiles/revisions differ but required guarantees are proven compatible;
- `MIXED_PARTIAL` — only a subset of guarantees is common/admissible;
- `ROUTE_SCOPED` — guarantee is valid only for a qualified route/member cohort;
- `CONTRACT_PROFILE_DRIFT` — observed member profile differs from desired/declared profile;
- `INCOMPATIBLE` — at least one routable required member violates a material requirement;
- `UNKNOWN` — evidence is insufficient to derive compatibility;
- `STALE` — compatibility evidence exists but exceeds its declared currentness horizon;
- `BLOCKED` — operation/profile is understood but policy prevents admissible use.

These are not visual variants. They are semantic/evidence dispositions.

## Rolling upgrade state machine

```text
UNIFORM_OLD
-> NEW_PROFILE_STAGED
-> MIXED_REVISION_EVALUATING
-> MIXED_COMPATIBLE | MIXED_PARTIAL | INCOMPATIBLE | UNKNOWN
-> ROUTING_QUALIFIED
-> EFFECTIVE_NEW_PROFILE
-> UNIFORM_NEW
```

Recovery branches:

```text
MIXED_* -> ROLLOUT_BLOCKED
MIXED_* -> ROLLBACK_REQUIRED
ROLLBACK_REQUIRED -> ROLLBACK_IN_PROGRESS
ROLLBACK_IN_PROGRESS -> UNIFORM_OLD | MIXED_COMPATIBLE | UNKNOWN
```

A rollback does not erase the prior compatibility evidence or effects produced under the newer profile.

## Routing and cohort qualification

A single `LogicalServiceCrown` may remain visually unified while its SharedContractSurface facets by admissible cohort:

```text
LogicalServiceCrown
  SharedContractSurface(group-wide)
  ProfileFacet(old-compatible cohort)
  ProfileFacet(new-qualified cohort)
  RouteQualification(canary/pinned/tenant/environment)
```

This avoids two opposite errors:

- splitting logical identity merely because revisions differ;
- pretending all members provide the newest guarantee because one member does.

`Logical identity != uniform contract profile`.

## Componentization / Componentes impact

Candidate additions:

### Primitive / semantic record

- `ContractProfileRef`
- `GuaranteeVectorRef`
- `CompatibilityEvidenceRef`
- `RouteQualificationRef`
- `ContractCurrentnessRef`

### Compound/domain building block

- `SharedContractSurfaceBadge`
- `CompatibilityDispositionIndicator`
- `ProfileFacetIndicator`
- `GuaranteeIntersectionSummary`
- `RouteScopeIndicator`

### Tool/module component

- `SharedContractSurfaceInspector`
- `ContractCompatibilityMatrix`
- `MixedRevisionProfileInspector`
- `RolloutCompatibilityPreview`
- `CompatibilityEvidencePanel`

### Workspace/system view

Topology, deployment, rollout, audit and recovery workspaces consume these components. 3D, 2D, graph, list and table are peer representations of the same compatibility disposition.

## Interaction contract

Selecting a SharedContractSurface identifies the logical contract surface; focus remains independently controlled. Expanding a surface reveals facets/evidence without changing logical identity. Switching projection preserves logical service identity, contract profile identity, revision/environment binding and compatibility evidence currentness.

Commands such as `inspect compatibility`, `compare profiles`, `show incompatible members`, `qualify route`, `review rollout impact` and `open evidence` are Command Registry candidates; none may exist only as 3D gestures.

## Accessibility and non-spatial representation

Every disposition must have text/icon/state-label representation; color is supplementary. Table/list fallback exposes at minimum logical service, member/cohort, profile/revision, compatibility disposition, route scope, currentness, blocking requirement and evidence availability.

`UNKNOWN`, `STALE`, `INCOMPATIBLE`, `MIXED_PARTIAL` and `ROUTE_SCOPED` must remain distinguishable without animation, depth, color or hover.

## LOD / aggregation

Aggregation may summarize profile distribution but cannot silently strengthen guarantees.

Rules:

```text
ANY required member INCOMPATIBLE -> aggregate cannot be COMPATIBLE
ANY material UNKNOWN -> aggregate cannot claim proven compatibility
STALE evidence -> aggregate cannot claim CURRENT
ROUTE_SCOPED guarantee -> aggregate cannot present GROUP_WIDE
MIXED_PARTIAL -> aggregate cannot present FULL_SUCCESS
```

At STRESS scale (~1000 modules), compatibility calculation may be worker/off-main-thread and visual representation clustered, but the semantic result must remain derived from canonical profile/evidence inputs, not renderer state.

## Required scenarios

1. old/new revisions coexist and are fully compatible for existing consumers;
2. new profile adds optional capability without weakening old guarantees;
3. new profile removes/changes a material guarantee;
4. schema remains readable but side-effect semantics differ;
5. newest member is healthy but old routable member cannot satisfy new requirement;
6. canary route can satisfy new profile while group-wide route cannot;
7. compatibility evidence becomes stale mid-rollout;
8. member profile is unknown while runtime health is green;
9. rollback restores old binaries after effects occurred under new profile;
10. projection/workspace switch preserves compatibility disposition and evidence;
11. partial bulk rollout reports per-member/cohort disposition;
12. fatal UI/workspace recovery preserves unresolved compatibility review.

## Proof obligations

Before this model is mature, prototype/research evidence must prove:

1. version number alone can never promote compatibility state;
2. schema compatibility cannot hide semantic/side-effect incompatibility;
3. route-scoped guarantees never render as group-wide guarantees;
4. UNKNOWN/STALE required-member evidence prevents false compatible/current aggregation;
5. mixed revisions can remain one logical service without erasing profile facets;
6. compatibility survives 3D/2D/list/table projection switches with the same semantic identity;
7. rollback preserves evidence/history of effects under the rolled-back profile;
8. keyboard/non-spatial users can inspect incompatibility and identify affected members;
9. LOD preserves material incompatible/unknown facets under NORMAL and STRESS scenes;
10. Componentes scenarios distinguish visual variant, interaction state and semantic compatibility disposition.

## Deduplication

This artifact does not redefine profile negotiation, authority/fencing, desired/observed/effective placement or generic window lifecycle already present in G4. It consumes those dimensions as qualification inputs and focuses only on the previously open SharedContractSurface compatibility algebra.

## Maturity and next vector

This closes a substantial portion of the `exact SharedContractSurface compatibility algebra` gap, but remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

Remaining material gaps:

- formal treatment of optional/conditional guarantees and alternative profiles under one surface;
- consumer-specific compatibility when several consumer generations coexist;
- cross-workspace recovery orchestration preserving compatibility-review intent, dirty state, evidence and authorization context;
- empirical prototype proof for aggregation/readability at NORMAL and STRESS scale.

Next research vector: consumer-specific compatibility and optional/conditional guarantee algebra, then cross-workspace recovery continuity.