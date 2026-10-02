# G4 Capability Exchange — Mutable Composition Membership and Requalification

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select Kubernetes, Istio, Envoy, Gateway API, a mesh, gateway, service-discovery system, provider, broker, routing product or implementation technology. It does not reopen G3 and does not authorize product work.

## 1. Research question

The preceding composed-route-assurance round modeled an effect path as independently administered assurance segments whose assumptions and guarantees must compose. The remaining high-value gap is that the segment chain itself is mutable: discovery can add/remove endpoints; a gateway can be inserted or bypassed; sidecar and ambient data planes can coexist during migration; retries can select a different intermediary; a provider can change internal routing; old connections can survive topology changes; and policy enforcement can move between boundaries.

The question is how a route-assurance proof survives, degrades or requires requalification when the **composition graph changes**, without requiring a globally serialized topology revision and without treating observed traces as proof of completeness.

Core boundaries:

`same logical service != same assurance composition`.

`segment proofs individually current != composition membership current`.

`member removed from desired topology != member unable to receive in-flight effects`.

`member inserted into path != inherited proof from adjacent members`.

## 2. Evidence reviewed

Primary documentation and mature-system failure evidence:

- Kubernetes EndpointSlice discovery represents one Service using one or more slices that must be joined to obtain the full endpoint set. Endpoint membership and endpoint conditions are therefore independently mutable rather than a single immutable route list. Kubernetes also distinguishes `ready`, `serving` and `terminating`; service proxies may still route to endpoints that are both serving and terminating when all available endpoints are terminating. <https://kubernetes.io/docs/reference/kubernetes-api/discovery/endpoint-slice-v1/> and <https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/>
- Kubernetes topology-aware routing uses EndpointSlice hints as consumption guidance rather than a business-semantic boundary. Topology membership and hints can change with endpoint/zone conditions. <https://kubernetes.io/docs/concepts/services-networking/topology-aware-routing/>
- Istio documents gradual and reversible sidecar-to-ambient migration in which sidecar and ambient workloads coexist. For L7 policies, there is currently a transition window where policies are unenforced; sidecar sources can bypass destination waypoints during incremental migration. <https://istio.io/latest/docs/ambient/migrate/> and <https://istio.io/latest/docs/ambient/migrate/enable-ambient-mode/>
- Istio further documents that merely expressing intent to use a waypoint does not by itself guarantee traversal, and provides destination-side bypass-prevention guidance. This is direct evidence that desired attachment is weaker than structural mediation. <https://istio.io/latest/docs/ambient/usage/waypoint/> and <https://istio.io/latest/docs/ambient/migrate/migrate-policies/>
- Envoy dynamic xDS configuration has dependency ordering and eventual-consistency considerations. Updated clusters are warmed while the old cluster continues serving and are atomically swapped only after the new cluster is ready; last-known dynamic configuration can persist when the management server is unavailable. <https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/cluster_manager> and <https://www.envoyproxy.io/docs/envoy/latest/api-docs/xds_protocol>

These systems are benchmarks only; none is selected.

## 3. Material finding: composition identity needs membership semantics

A `ComposedRouteAssuranceRef` cannot safely be identified only by service name, gateway name, route object or a list of segment proofs. It also depends on **which segments may materially participate in the effect path under the qualified conditions**.

Candidate abstraction:

```text
CompositionMembershipRef
  protectedEffectRef
  compositionScopeRef
  memberRefs[]
  memberRoleRefs[]
  adjacencyOrReachabilityRefs[]
  mandatoryTraversalRefs[]
  bypassRefs[]
  conditionalMembershipRefs[]
  drainingMemberRefs[]
  evidenceRefs[]
  currentnessVectorRef
  resultingDisposition
```

Membership is not merely inventory. It records whether a segment is mandatory, optional, conditional, bypassable, draining, or effect-irrelevant for the protected invariant.

`member listed != member mandatory`.

`member absent from desired config != member unreachable`.

## 4. Desired graph, effective graph and in-flight graph are distinct

At least three views must remain separate:

1. **DesiredCompositionGraph** — what configuration/control plane intends.
2. **EffectiveCompositionGraph** — what current enforcement/routing evidence says can participate for new attempts.
3. **InFlightCompositionGraph** — members/paths that can still carry already-admitted attempts, open connections, queued work or retries.

A fourth view may be useful for evidence provenance:

4. **ObservedCompositionGraph** — paths actually seen in telemetry/traces.

The observed graph is valuable positive evidence and counterexample evidence, but it is not complete by default.

`observed graph subset != effective graph equality`.

`desired graph updated != in-flight graph drained`.

This mirrors prior G4 distinctions between admission, delivery, effect and settlement rather than inventing a topology-specific shortcut.

## 5. Membership change classes

A composition change should be classified by its semantic effect, not by raw object diff.

Candidate classes:

- `INSERT_MEMBER` — a new intermediary may participate;
- `REMOVE_MEMBER_DESIRED` — desired topology stops selecting a member;
- `DRAIN_MEMBER` — no new work should enter, but old work may remain;
- `BYPASS_MEMBER` — an existing enforcement/translation boundary can be skipped;
- `REORDER_MEMBERS` — same members, different order;
- `SPLIT_PATH` — one path becomes multiple alternatives;
- `MERGE_PATHS` — multiple paths converge behind a shared segment;
- `CHANGE_CONDITIONALITY` — nominal-only member becomes failure/retry/emergency member or vice versa;
- `CHANGE_ENFORCEMENT_LOCUS` — the same policy/guarantee moves to another boundary;
- `REPLACE_MEMBER` — old/new mechanisms overlap during handoff;
- `OPAQUE_MEMBERSHIP_CHANGE` — evidence indicates composition changed but cannot enumerate how.

`same member set != same composition` because order, bypassability and conditionality can change proof semantics.

## 6. Insertion never inherits adjacent assurance automatically

When a new intermediary appears between A and B, the old proof `A -> B` is not automatically reusable as `A -> X -> B`.

The inserted member can alter:

- target reachability;
- retry/failover/hedge behavior;
- tenant/classification/authority/provenance propagation;
- identity interpretation;
- semantic generation/profile negotiation;
- effect identity and idempotency keys;
- currentness or policy enforcement;
- rate/cost budgets;
- failure-mode behavior.

Candidate rule:

`new member -> new proof dependency unless proven semantically irrelevant`.

Irrelevance requires a scoped proof, for example a transport-only segment that cannot alter or bypass any material invariant and whose failure behavior is already covered. Mere transparency claims are insufficient.

## 7. Removal is a two-phase assurance problem

Removing an intermediary from desired topology does not prove that it can no longer participate. Kubernetes terminating endpoints can remain serving, and service proxies may still route to serving+terminating endpoints under constrained conditions. Envoy keeps an old updated cluster serving until the replacement has warmed. Existing connections, DNS caches, retry state and queues can similarly preserve old membership.

Therefore removal has at least two milestones:

```text
NO_NEW_ADMISSION_THROUGH_MEMBER
  -> MEMBER_EFFECT_RIGHTS_DRAINED_OR_FENCED
```

The second milestone is stronger.

`removed from discovery != effect path fenced`.

For a member that owned a material enforcement responsibility, proof retirement also requires evidence that the responsibility has moved or become unnecessary before the old boundary disappears.

## 8. Reordering can invalidate assumptions without changing members

Assume-guarantee composition is order-sensitive when one segment's guarantee discharges the next segment's assumption.

Example:

```text
A authenticates tenant context
B authorizes business effect using authenticated tenant
```

Reordering to `B -> A` retains both members but invalidates B's assumption.

Likewise, moving translation before authorization can change the semantic object being authorized; moving retry before idempotency/fencing can alter duplicate-effect safety.

Candidate rule:

`same members + different order != same composed proof`.

A proof may survive reorder only when the relevant transformations commute for the protected guarantee and that commutativity is explicitly justified.

## 9. Sidecar-to-ambient migration is a strong failure case

Istio's migration documentation provides unusually clear evidence that a data-plane migration can change the enforcement graph before application semantics change:

- sidecar and ambient workloads may coexist;
- sidecar-origin traffic to ambient destinations can bypass waypoints;
- L7 policy enforcement can have a known gap during migration;
- waypoint intent alone does not guarantee traversal;
- destination-side bypass prevention is needed when strict traversal is required.

This yields several G4 boundaries:

`policy object migrated != enforcement membership migrated`.

`new enforcement member ready != all callers traverse it`.

`migration reversible != assurance-preserving at every intermediate state`.

A composition transition therefore needs explicit intermediate-state assurance, not only before/after proofs.

## 10. Transition proof, not only endpoint proofs

If old composition C1 is proven and new composition C2 is proven, the migration C1 -> C2 is not automatically proven. Intermediate states can contain both, neither, bypasses, or mixed caller populations.

Candidate object:

```text
CompositionTransitionProofRef
  fromCompositionRef
  toCompositionRef
  protectedEffectRef
  allowedIntermediateMembershipClasses[]
  insertionQualificationRefs[]
  removalDrainFenceRefs[]
  reorderCompatibilityRefs[]
  bypassExclusionRefs[]
  mixedModeAssuranceRefs[]
  currentnessVectorRef
  completionPredicateRef
  rollbackPredicateRef
  resultingDisposition
```

Candidate rule:

`C1 proven + C2 proven != transition proven`.

This is analogous to G4 semantic-generation handoff: transition safety is its own proof domain.

## 11. Membership currentness is vector-valued and locally observable

There need not be one global topology revision. Each material segment can expose local evidence such as discovery generation, route/config revision, endpoint conditions, policy attachment state, target-side enforcement state or draining/fencing evidence.

A runtime can verify a locally sufficient vector:

```text
MembershipCurrentnessVector
  discoveryEvidence
  gatewayEvidence
  meshEvidence
  providerEdgeEvidence
  targetGateEvidence
  inFlightDrainEvidence
  counterexampleEvidence
```

The composition is current only for the protected effect and proof scope when every material dependency satisfies its floor/horizon or is proven irrelevant by a stronger invariant.

`no global topology revision != no compositional proof`.

This preserves autonomous runtimes and avoids making the Exchange Plane a topology coordinator.

## 12. Change detection is multi-source and non-oracular

Useful evidence includes:

- control-plane/configuration watches;
- service-discovery membership and conditions;
- route/policy attachment status;
- data-plane configuration acknowledgements;
- target-side enforcement attestations;
- runtime traces and access logs;
- synthetic probes;
- connection/queue drain evidence;
- provider change notifications;
- explicit operator migration state.

No source is complete in every topology.

`config watch silence != composition unchanged`.

`trace silence != member unreachable`.

`data-plane ACK != every in-flight attempt uses new graph`.

A positive unexpected path is strong defeating evidence for an incompatible membership proof. Finite non-observation cannot by itself establish completeness.

## 13. Selective requalification by proof dependency

A membership change should not globally invalidate all route proofs.

Candidate dependency relation:

```text
ComposedRouteAssuranceRef
  -> CompositionMembershipRef
  -> RouteAssuranceSegmentRefs[]
  -> protected guarantees / assumptions
```

If an inserted member is structurally incapable of altering a guarantee and cannot create a bypass, only operational evidence may need refresh. If it can widen reachability, alter context, move enforcement, retry or fail open, dependent proof dimensions must be requalified.

`composition changed != every guarantee changed`.

`material membership dependency changed != dependent proof still current`.

This supports bounded requalification rather than global churn.

## 14. Target-side invariants can reduce topology sensitivity

A universal commitment-adjacent invariant can make some upstream membership changes irrelevant to a protected effect. For example, if every effect-capable target independently enforces the same qualified tenant/authority/effect fence, inserting a transport hop that cannot bypass or mutate that gate may not require rediscovering the entire upstream graph.

But this only works when coverage is complete:

`target invariant covers every effect-capable path -> some route membership may be irrelevant`.

`one bypass path around target invariant -> topology sensitivity returns`.

This preserves the prior G4 conclusion that complete mediation need not mean centralized mediation.

## 15. Context-preservation membership and reachability membership can diverge

A member may be irrelevant to reachability but material to context preservation. For example, a gateway may not change the target set but may authenticate tenant/classification metadata. Removing it leaves reachability unchanged while invalidating authorization assumptions downstream.

Conversely, a load balancer may alter reachability without touching metadata.

Therefore membership materiality is guarantee-dimensional:

```text
MemberMateriality
  reachability
  contextIntegrity
  identity
  authority
  currentness
  retryEffectSafety
  rateCostBudget
  observabilityEvidence
```

`not routing-critical != semantically irrelevant`.

## 16. Opaque provider changes remain representable

A provider may signal that routing/enforcement architecture changed without exposing internal membership. G4 should not invent the hidden graph.

Candidate dispositions:

- `MEMBERSHIP_PROVEN_CURRENT`
- `TRANSITION_PROVEN`
- `CURRENT_WITH_TARGET_INVARIANT`
- `PARTIAL`
- `UNKNOWN`
- `CONTESTED`
- `INCOMPATIBLE`

Opaque change can remain admissible only when a stronger contract/invariant proves the hidden membership irrelevant for the protected guarantee. Otherwise affected proofs degrade explicitly.

## 17. Exchange Plane boundary

The Capability Exchange Plane may carry:

- composition/membership references;
- segment and transition proof references;
- route/context constraints;
- discovery/config/currentness evidence;
- bypass/counterexample findings;
- drain/fence evidence;
- effect/attempt lineage.

It does not own:

- service discovery truth;
- gateway/mesh/provider topology;
- business authorization;
- migration orchestration;
- a global topology revision;
- canonical business state.

`Exchange Plane transports/composes membership evidence != Exchange Plane serializes topology`.

## 18. Proof obligations

1. Every route proof names the composition-membership assumptions material to its protected guarantee.
2. Desired, effective, observed and in-flight composition graphs are not conflated.
3. Observed traces are positive/counterexample evidence, not default completeness proof.
4. Inserting a member creates a proof dependency unless scoped irrelevance is proven.
5. Removing a member from desired discovery does not imply effect-path exclusion.
6. Member retirement distinguishes no-new-admission from drain/fence of old effects.
7. Existing connections, queues, retries and terminating endpoints are included where they can preserve old membership.
8. Reordering members requalifies assumption/guarantee composition unless relevant transformations are proven to commute.
9. Same member set does not imply same composition when conditionality, order or bypassability changes.
10. Enforcement-locus migration proves intermediate states, not only old and new steady states.
11. `C1 proven + C2 proven` does not imply `C1 -> C2 transition proven`.
12. Mixed-mode callers/workloads are included in transition assurance when they can traverse different enforcement paths.
13. Desired policy attachment does not prove mandatory traversal.
14. Bypass-prevention evidence names its enforcement locus and failure/migration coverage.
15. Data-plane/configuration ACK does not imply every in-flight attempt uses the new composition.
16. Membership currentness remains vector-valued; no synthetic global topology revision is required.
17. A positive unexpected path defeats incompatible closure/membership claims and survives older configuration evidence until reconciled.
18. Finite non-observation cannot alone prove member non-reachability.
19. Membership requalification is selective by material proof dependency, not a global invalidation by default.
20. Target-side universal invariants may render upstream membership changes irrelevant only with complete effect-path coverage.
21. Reachability membership and context-preservation membership remain independent proof dimensions.
22. Removing an identity/context-enforcement member cannot be classified as routing-only if downstream assumptions depend on it.
23. Retry/hedge/failover ownership changes are membership changes when they alter possible effect paths or budgets.
24. Endpoint health/readiness is not semantic authorization or proof of enforcement membership.
25. Opaque provider membership change degrades affected proof unless a stronger invariant/contract makes it irrelevant.
26. Runtime-local proof verification remains possible without Builder or central Exchange Plane availability when evidence is locally sufficient.
27. Adapter/driver/gateway/controller roles remain bounded; none fabricates membership closure from unsupported mechanism claims.
28. Historical effect evidence preserves the composition and transition disposition applicable when commitment occurred.

## 19. Adversarial cases

1. A new gateway is inserted and silently drops tenant classification metadata.
2. Gateway removed from desired config while long-lived connections still traverse it.
3. Sidecar and ambient callers coexist; only ambient callers traverse the waypoint.
4. New waypoint is ready but sidecar-origin traffic bypasses it.
5. Old L7 policy removed before new enforcement path is active, creating a policy gap.
6. Desired waypoint attachment exists but no bypass-prevention mechanism makes traversal mandatory.
7. Service discovery removes endpoint A, but A remains serving while terminating and receives traffic during drain.
8. Updated Envoy cluster B is warming while old A continues serving.
9. Route order changes from authenticate->authorize to authorize->authenticate.
10. Same members remain but retry moves before stable effect-identity assignment.
11. EndpointSlice watch misses one slice and incorrectly treats the observed subset as the full Service.
12. Multiple controllers contribute endpoint membership; scanner assumes one controller is authoritative for all slices.
13. Topology hints change and consumer treats them as hard exclusion rather than hints.
14. Config ACK for new graph arrives while old connections continue committing effects.
15. Rollback restores old sidecar path after a target security floor has advanced.
16. Emergency route bypasses a newly inserted gateway.
17. Provider adds an opaque intermediary that terminates/re-originates identity context.
18. A transport-only member is declared irrelevant but actually performs retries with an independent budget.
19. Target invariant covers normal paths but not break-glass/admin endpoint.
20. Gateway replacement overlaps old/new versions with different metadata normalization.
21. Mesh migration changes telemetry labels; monitoring incorrectly concludes the old path disappeared.
22. Trace sample observes only ambient path and is used to claim sidecar path is impossible.
23. A draining member is removed from inventory before its queued work settles.
24. Member reordering preserves schema but changes which policy sees original client identity.
25. Two individually valid segment proofs refer to different membership generations.
26. A control-plane outage freezes last-known config longer than the proof's currentness horizon.
27. Composition graph changes for one operation and is incorrectly generalized to every capability operation.
28. Exchange Plane is turned into a mandatory topology sequencer to solve membership churn, violating runtime autonomy.

## 20. Portability and exit path

The hypothesis does not require Kubernetes EndpointSlice, Istio ambient, Envoy xDS, a particular gateway API, service mesh, cloud load balancer or centralized topology database.

A provider-specific mechanism is replaceable when another mechanism can provide sufficient evidence for the same implementation-independent obligations: membership identity/scope, mandatory-vs-conditional traversal, insertion/removal/drain semantics, bypass coverage, context preservation, transition state, currentness and counterexample handling.

`mechanism portability != semantic guarantee portability by assumption`.

Drivers/adapters can normalize evidence shape, but unsupported drain, bypass or transition semantics remain explicit rather than being fabricated.

## 21. Deduplication against existing G4 research

This round does not reopen:

- generic route-set discovery or opaque-route closure;
- composed route assurance across a fixed segment chain;
- generic service-mesh governance;
- semantic-generation handoff;
- generic retries/idempotency/fencing;
- provider semantic drift/rollout skew;
- dependency-lineage soundness;
- complete mediation.

Material delta:

```text
composed route assurance
 -> composition graph itself mutates
 -> desired/effective/observed/in-flight membership separation
 -> insertion/removal/reorder/bypass/drain classes
 -> transition proof distinct from steady-state proofs
 -> selective requalification by membership dependency
 -> commitment-adjacent invariants reduce topology sensitivity
 -> no global topology revision or central topology sequencer required
```

## 22. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This round materially changes the route-assurance model: composition membership and membership transitions become explicit proof dependencies rather than an implicit fixed graph.

The next highest-value gap is **membership-proof completeness under independently produced discovery/config views**: how to establish that all material membership sources have been accounted for when EndpointSlices, DNS, gateway config, mesh config, provider routing, callbacks and emergency paths are produced by different authorities, without requiring a universal inventory oracle. The focus should be on source-closure evidence, authority-to-publish membership, overlapping/competing discovery sources, negative evidence and bounded `UNKNOWN`, deduplicated against existing dependency-lineage and effect-path-universe research.