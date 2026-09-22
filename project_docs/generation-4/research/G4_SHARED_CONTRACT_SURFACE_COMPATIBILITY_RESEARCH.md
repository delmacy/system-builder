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

## Deepening — consumer-qualified surfaces and conditional guarantee algebra

### Evidence delta

Primary official documentation adds three useful constraints to the previous algebra:

- Protocol Buffers explicitly permits old code to read newer messages when compatible evolution rules are followed, while warning that newly added optional fields are absent from old messages and that presence may need explicit tracking. This demonstrates that wire readability and guarantee availability are consumer-generation dependent.
- Kubernetes documents asymmetric version-skew support among API server, kubelet, controllers and `kubectl`; when several API-server versions coexist, the admissible version range for a component can narrow to the intersection imposed by all reachable servers. This is a production example of compatibility being directional, role-specific and route-set dependent rather than a property of a version pair alone.
- Kubernetes API evolution preserves compatibility for GA APIs while allowing new resources/fields to be added and older versions eventually to be deprecated/removed. Thus a capability may be additive for one consumer generation while unavailable or inadmissible for another.

Evidence class: `PRIMARY_OFFICIAL_DOCUMENTATION`. GraphQL nullability/evolution material was reviewed as supporting evidence for directional value-set compatibility, but the core candidate algebra below does not depend on GraphQL-specific semantics.

### Consumer-specific compatibility is a ternary relation

The previous `Compatible(requirement, profile, context)` model is retained but refined: a SharedContractSurface shown without a named consumer class can only claim guarantees common to the declared consumer population. Compatibility is not a unary provider property.

Candidate records:

```text
ConsumerProfile {
  semanticIdentity
  generation/revision
  requiredOperations
  requiredGuarantees
  understoodOptionalGuarantees
  acceptedAlternatives
  requestProductionProfile
  responseConsumptionProfile
  securityRequirements
  currentnessRequirements
  authorityRequirements
}

ConsumerCohort {
  cohortIdentity
  consumerProfiles[]
  routingScope
  populationScope
  currentness
  evidence
}
```

Candidate relation:

```text
Compatible(consumer, provider, interaction, context)
= RequestProducedBy(consumer) is admissible to provider
  AND ResponseProducedBy(provider) is consumable by consumer
  AND every REQUIRED guarantee is satisfied
  AND every selected CONDITIONAL guarantee has its predicate satisfied
  AND at least one branch of every REQUIRED_ALTERNATIVE set is qualified
  AND authority/security/currentness constraints are satisfied
```

Therefore:

```text
PROVIDER_SUPPORTS != CONSUMER_CAN_USE
WIRE_READABLE != CONSUMER_SEMANTICS_SATISFIED
OPTIONAL_FOR_PROVIDER != OPTIONAL_FOR_CONSUMER
ADDITIVE_FIELD != UNIVERSALLY_USABLE_GUARANTEE
NEW_CONSUMER_COMPATIBLE != OLD_CONSUMER_COMPATIBLE
```

### Guarantee cardinality and modality

A flat set intersection is insufficient. Candidate guarantee terms need modality:

```text
GuaranteeTerm {
  guaranteeIdentity
  modality: REQUIRED | OPTIONAL | CONDITIONAL | ALTERNATIVE
  predicate?                 // for CONDITIONAL
  alternativeSetIdentity?    // for ALTERNATIVE
  semanticScope
  interactionKind
  direction: REQUEST | RESPONSE | EFFECT | EVIDENCE
  currentnessRequirement
  evidenceRef
}
```

Interpretation:

- `REQUIRED`: absence or incompatibility makes the relevant consumer/provider interaction incompatible or blocked.
- `OPTIONAL`: absence does not invalidate the base interaction; presence must never silently strengthen the group-wide surface for consumers that cannot use it.
- `CONDITIONAL`: material only when its declared predicate is true; an unknown predicate produces `UNKNOWN_CONDITION`, not optimistic compatibility.
- `ALTERNATIVE`: one qualified member of a declared alternative set is sufficient only if the consumer accepts that alternative and the selected branch preserves the required guarantee vector.

Hard rules:

```text
OPTIONAL != IRRELEVANT
CONDITIONAL != OPTIONAL
ALTERNATIVE != FALLBACK_BY_GUESS
PREDICATE_UNKNOWN != PREDICATE_FALSE
ONE_ALTERNATIVE_AVAILABLE != ALL_CONSUMERS_COMPATIBLE
```

### Surface derivation across consumer cohorts

For provider group `G`, consumer cohort `K`, interaction `I` and context `C`:

```text
ConsumerSurface(G, K, I, C)
= QualifiedIntersection(
    EffectiveGuarantees(providerMember, consumerProfile, I, C)
    for every legitimately routable providerMember
    and every consumerProfile included by cohort policy
  )
```

A system-wide surface that spans multiple consumer generations is therefore conservative unless explicitly faceted:

```text
SharedContractSurface
  BaseSurface(all admitted consumer cohorts)
  ConsumerFacet(legacy cohort)
  ConsumerFacet(current cohort)
  ConsumerFacet(canary/new cohort)
  RouteFacet(...)
```

The UI MAY expose a stronger consumer-specific facet when the consumer identity/cohort and routing scope are explicit. It MUST NOT promote that facet to the logical service crown as a universal guarantee.

### Conditional evaluation state machine

Candidate semantic/evidence states:

```text
CONDITION_NOT_APPLICABLE
CONDITION_PENDING_EVIDENCE
CONDITION_SATISFIED
CONDITION_UNSATISFIED
CONDITION_UNKNOWN
CONDITION_STALE
```

Candidate transition:

```text
UNASSESSED
-> PREDICATE_EVALUATING
-> CONDITION_NOT_APPLICABLE
 | CONDITION_SATISFIED
 | CONDITION_UNSATISFIED
 | CONDITION_UNKNOWN
 | CONDITION_STALE
```

`CONDITION_UNSATISFIED` means the conditional guarantee is not activated by context; it does not by itself mean provider failure. `CONDITION_UNKNOWN` means compatibility that depends on the term cannot be proven.

### Alternative-set state machine

```text
ALTERNATIVE_SET_UNASSESSED
-> ALTERNATIVES_QUALIFYING
-> ALTERNATIVE_SELECTED_QUALIFIED
 | MULTIPLE_ALTERNATIVES_QUALIFIED
 | NO_ACCEPTABLE_ALTERNATIVE
 | ALTERNATIVE_UNKNOWN
 | ALTERNATIVE_STALE
```

Selection is evidence-bearing and consumer-scoped. A fallback chosen operationally is not automatically contract-equivalent.

### New compatibility dispositions

Add candidate dispositions without collapsing the existing surface states:

- `CONSUMER_SCOPED_COMPATIBLE`
- `CONSUMER_COHORT_PARTIAL`
- `LEGACY_CONSUMER_BLOCKED`
- `NEW_CONSUMER_BLOCKED`
- `OPTIONAL_GUARANTEE_AVAILABLE`
- `CONDITIONAL_GUARANTEE_ACTIVE`
- `CONDITIONAL_GUARANTEE_UNKNOWN`
- `ALTERNATIVE_QUALIFIED`
- `NO_ACCEPTABLE_ALTERNATIVE`

These are semantic/evidence dispositions, not colors or badges.

### Componentes impact — delta

Primitive / semantic records:

- `ConsumerProfileRef`
- `ConsumerCohortRef`
- `GuaranteeTermRef`
- `GuaranteeModalityRef`
- `ConditionEvidenceRef`
- `AlternativeSetRef`

Compound/domain building blocks:

- `ConsumerScopeIndicator`
- `GuaranteeModalityIndicator`
- `ConditionalGuaranteeIndicator`
- `AlternativeQualificationIndicator`
- `ConsumerCompatibilityFacet`

Tool/module components:

- `ConsumerCompatibilityMatrix`
- `GuaranteeTermInspector`
- `ConditionalGuaranteeInspector`
- `AlternativeSetInspector`
- `ConsumerCohortImpactPreview`

Workspace/system views consume these rather than inventing separate compatibility semantics.

### Interaction / accessibility / projection contract

Selecting a consumer facet changes the compatibility lens, not the logical service identity. The Inspector must expose the active consumer cohort, route scope, guarantee modality, condition/alternative evidence and currentness. Keyboard/list/table users must be able to perform the same `inspect consumer compatibility`, `compare cohorts`, `show blocked consumers`, `inspect condition`, and `inspect alternatives` commands available from spatial projections.

Projection switching preserves at minimum:

```text
logicalServiceIdentity
consumerCohortIdentity
providerCohort/routeScope
interactionIdentity
guaranteeIdentity/modality
revision/environment
compatibilityDisposition
evidenceCurrentness
```

Color, depth, animation and spatial proximity remain supplementary.

### LOD / aggregation rules — consumer dimension

At NORMAL and STRESS scale:

```text
ANY admitted consumer cohort materially INCOMPATIBLE
  -> aggregate cannot claim UNIVERSALLY_COMPATIBLE

ANY required conditional predicate UNKNOWN
  -> dependent aggregate cannot claim PROVEN_COMPATIBLE

ONLY new cohort supports optional guarantee
  -> aggregate may show AVAILABLE_TO_SUBSET, never UNIVERSAL

NO common acceptable alternative across admitted cohorts
  -> aggregate cannot collapse alternatives into SUCCESS

CONSUMER FACET hidden by LOD
  -> aggregate retains count/severity/disposition and drill-down path
```

Aggregation may compress cohort/member detail but cannot erase compatibility asymmetry.

### Required scenarios — delta

13. legacy and current consumers simultaneously route to a mixed provider group;
14. new provider adds an optional response field that legacy consumer ignores safely but new consumer requires semantically;
15. wire-compatible message is semantically insufficient because a consumer requires explicit field presence;
16. conditional guarantee applies only for a regulated tenant/environment and its predicate evidence becomes stale;
17. two alternative profiles exist but only one is acceptable to the legacy cohort;
18. canary consumers and canary providers are mutually compatible while the general population is not;
19. a rollout changes the reachable provider set and thereby narrows the admissible consumer range;
20. partial bulk consumer migration reports cohort-specific success/failure without universal-success leakage;
21. offline/reconnect restores a compatibility review with consumer cohort and condition evidence intact;
22. fatal workspace recovery preserves unresolved alternative selection and authorization context.

### Proof obligations — delta

11. the same provider group can correctly yield different compatibility dispositions for two consumer cohorts without changing logical identity;
12. optional provider capability never becomes a required universal guarantee by aggregation;
13. unknown/stale conditional evidence prevents dependent compatibility from becoming proven success;
14. alternative qualification proves at least one consumer-accepted branch rather than choosing any available branch;
15. mixed consumer generations can be represented in 3D, 2D, graph, list and table without hiding blocked legacy/new cohorts;
16. LOD at ~1000 modules preserves material consumer incompatibility through aggregate disposition and drill-down;
17. projection/workspace switches preserve consumer cohort, route scope, guarantee modality and evidence currentness;
18. rollback/reconnect cannot silently substitute a different consumer profile or alternative branch;
19. partial bulk migration remains partial at aggregate level;
20. Componentes scenarios distinguish interaction selection/focus from consumer-compatibility semantics.

### Deduplication delta

This deepening does not redefine the Capability Exchange Plane's negotiation/admissibility model. It consumes support/admissibility/currentness as evidence inputs and specifies how frontend contract surfaces represent compatibility across simultaneously admitted consumer cohorts. It also does not redefine generic UI state families; consumer/condition/alternative dispositions compose with the existing interaction-state matrix.

## Maturity and next vector

The exact SharedContractSurface algebra is now materially stronger for mixed provider revisions, mixed consumer generations, optional guarantees, conditional guarantees and explicit alternative sets. Status remains `RESEARCH_ACTIVE / NON_EXECUTABLE` because empirical UI proof and recovery continuity remain open.

Remaining material gaps:

- cross-workspace recovery orchestration preserving review intent, dirty state, evidence, authorization context, consumer facet and selected alternative;
- empirical prototype proof for compatibility matrices and aggregate readability at NORMAL and STRESS scale;
- policy for presenting very high-dimensional consumer/provider matrices without false scalarization;
- evidence-expiry behavior during long-running review/authorization sessions.

Next research vector: cross-workspace recovery continuity for compatibility/change review, followed by empirical high-dimensional matrix/LOD proof.