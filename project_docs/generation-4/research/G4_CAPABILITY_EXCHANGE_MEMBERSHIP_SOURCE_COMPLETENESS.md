# G4 Capability Exchange — Membership-Source Completeness and Discovery Authority Closure

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select Kubernetes, Gateway API, DNS/SVCB, Envoy, a mesh, gateway, service-discovery system, provider, broker, routing product or implementation technology. It does not reopen G3 and does not authorize product work.

## 1. Research question

The preceding mutable-composition round established that desired, effective, observed and in-flight composition graphs differ, and that inserting, removing, bypassing or reordering a member can defeat a composed route-assurance proof. The remaining high-value gap is **source completeness**: how can a runtime know that it has accounted for every authority capable of introducing a material member or alternative path when membership can be influenced by independent discovery/configuration systems such as EndpointSlices, DNS/service bindings, gateway attachment, mesh configuration, provider routing, callbacks, emergency paths and manually managed resources?

The problem is not to build a universal topology inventory. It is to prove, for a protected effect/guarantee, that the set of **membership-introducing authorities** relevant to that proof is closed enough that an unaccounted authority cannot silently widen the effect path.

Core boundaries:

`all known members qualified != all member-introducing authorities accounted for`.

`one discovery source complete for its namespace != end-to-end membership-source completeness`.

`source silent != source incapable of introducing a member`.

`source authenticated != source authorized to widen this protected effect path`.

## 2. Evidence reviewed

Primary standards/documentation and mature-system behavior:

- Kubernetes documents that a Service can have multiple EndpointSlice objects and consumers must join all slices carrying the Service label to obtain the full endpoint set. It also explicitly permits additional entities/controllers, including service-mesh implementations, to manage additional EndpointSlice sets, distinguished by `endpointslice.kubernetes.io/managed-by`. Manually created EndpointSlices can likewise be linked to a Service by label. This is direct evidence that one logical service can have multiple independent endpoint-producing authorities. <https://kubernetes.io/docs/reference/kubernetes-api/discovery/> and <https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/> and <https://kubernetes.io/docs/concepts/services-networking/service/>
- Kubernetes EndpointSlice endpoint conditions (`ready`, `serving`, `terminating`) are claims made according to the system managing the endpoint. A terminating endpoint can remain serving, and proxies may route to serving+terminating endpoints when all available endpoints terminate. Source membership and effect reachability therefore cannot be reduced to one boolean or one controller revision. <https://kubernetes.io/docs/reference/kubernetes-api/discovery/endpoint-slice-v1/>
- Kubernetes Gateway API Route status is per parent/controller. The specification notes that an implementation can only populate status for parent resources it is responsible for; unresolved/invisible parent references may be absent from its status. A Route can also attach independently to multiple parents. This is evidence that one controller's accepted/programmed view is not a universal attachment inventory. <https://gateway-api.sigs.k8s.io/reference/api-spec/main/spec/> and <https://gateway-api.sigs.k8s.io/reference/api-types/httproute/>
- RFC 9460 (SVCB/HTTPS) allows multiple alternative service endpoints, explicitly does not assume those endpoints share capabilities or operator, and notes that successive DNS answers may correspond to different hosting/CDN environments. AliasMode can delegate operational control to another name. DNS service binding is therefore an authority-expansion boundary rather than a static address lookup. <https://www.rfc-editor.org/rfc/rfc9460.html>
- RFC 7838 (HTTP Alternative Services) allows a discovered alternative service to be cached and used for new connections while fresh; existing connections need not stop when freshness expires. An origin-authorized alternative service can itself update/clear alternative-service state. This demonstrates that membership-introduction authority may be delegated at runtime and can outlive the source observation for existing connections. <https://www.rfc-editor.org/rfc/rfc7838.html>

These systems are benchmarks only; none is selected.

## 3. Material finding: member closure and source closure are distinct

A proof can enumerate every member currently visible and still be incomplete if it has not accounted for an authority that can add a new member later or under a failure path.

Candidate distinction:

```text
MembershipClosure
  -> which members/paths may participate now

MembershipSourceClosure
  -> which authorities/mechanisms may introduce, delegate,
     reactivate or preserve material membership
```

Therefore:

`member set closed at t != membership-introduction authority set closed`.

The second relation is required to reason about future widening within a proof horizon.

## 4. Candidate MembershipAuthorityRef

A minimal research abstraction:

```text
MembershipAuthorityRef
  authorityIdentityRef
  authorityKind
  governedScopeRef
  introductionMechanisms[]
  delegationRules[]
  precedenceOrMergeSemanticsRef
  failureModeRef
  persistenceOrCacheSemanticsRef
  effectMaterialityRef
  evidenceRefs[]
  currentnessRef
  revocationOrFenceRef
```

Candidate authority kinds are descriptive roles, not products:

- declarative discovery authority;
- route/attachment authority;
- name-resolution/service-binding authority;
- retry/failover authority;
- provider-internal routing authority;
- target registration authority;
- callback/redirection authority;
- emergency/break-glass authority;
- delegated alternative-service authority;
- manual/operator authority.

An implementation may combine several roles; the semantic distinction remains useful.

## 5. Source completeness is effect-scoped, not universal

G4 does not need an inventory of every mechanism capable of changing any route anywhere. Completeness is scoped to the protected effect and guarantee.

Candidate claim:

```text
MembershipSourceClosureClaim
  protectedEffectRef
  guaranteeScopeRef
  compositionScopeRef
  authorityRefs[]
  authorityDiscoveryBasisRefs[]
  delegationClosureRefs[]
  mergePrecedenceSemanticsRefs[]
  bypassEmergencyRefs[]
  persistenceInFlightRefs[]
  structuralExclusionRefs[]
  currentnessVectorRef
  defeatingEvidenceRefs[]
  resultingDisposition
```

A source can be omitted only when it is proven irrelevant or structurally unable to introduce a path that can reach the protected commitment boundary.

`not used normally != irrelevant`.

`disabled by convention != structurally excluded`.

## 6. Kubernetes EndpointSlice: strong multi-authority benchmark

Kubernetes is a useful benchmark because its own model makes multi-source membership explicit:

1. one Service may map to multiple EndpointSlices;
2. all slices for the Service must be joined to obtain the full endpoint set;
3. different entities/controllers may manage different slices;
4. manually created slices can be attached to a Service;
5. `managed-by` identifies the manager but does not itself prove that all possible managers have been enumerated.

This yields:

`all slices from controller A observed != all service endpoints observed`.

A proof based only on the default EndpointSlice controller would be incomplete if another authorized mesh/controller/operator can create additional Service-labeled slices.

The important universal principle is not EndpointSlice-specific: **enumerating one producer's outputs is weaker than enumerating the authorities allowed to produce outputs in the namespace relevant to the effect**.

## 7. Controller visibility is not global attachment authority

Gateway API reinforces the same distinction from the opposite direction. Route status is maintained per parent/controller, and implementations can only report parent resources they manage/see. Lack of an entry can reflect lack of visibility rather than proof of non-attachment.

Candidate rule:

`controller has no attachment record != no other controller/parent can attach`.

This prevents status aggregation from being treated as an omniscient topology oracle.

A source-completeness proof instead needs the authority model that determines who may attach routes/parents and the material scope of those attachments.

## 8. DNS/SVCB shows delegated membership authority

RFC 9460 adds an important class not captured by static controller inventories. AliasMode can delegate operational control to another service name; ServiceMode can advertise alternative endpoints that need not share operator or capabilities. Successive DNS answers can represent different environments.

Therefore:

`original service owner known != all downstream endpoint operators fixed`.

`binding source authenticated != every advertised endpoint semantically equivalent`.

Membership-source closure must follow material delegation edges when a source is authorized to delegate endpoint selection.

Candidate relation:

```text
MembershipAuthorityDelegationRef
  delegatorRef
  delegateRef
  scopeRef
  constraintsRef
  delegationCurrentnessRef
  downstreamClosureRequired
```

This mirrors authority-delegation research without conflating network endpoint delegation with business authority.

## 9. Runtime-discovered alternatives can outlive discovery freshness

HTTP Alternative Services adds a temporal failure case. Alternative services can be cached for a freshness lifetime, but existing connections do not necessarily terminate when that lifetime expires. The alternative service also has authority over cached alternative-service state for the origin.

Therefore source completeness has both **new-admission** and **in-flight/persisted** dimensions:

`source evidence expired != every membership introduced by that source drained`.

`authority revoked for new introductions != previously introduced path fenced`.

This reuses the prior G4 distinction between desired/effective/in-flight membership rather than inventing a topology shortcut.

## 10. Authority enumeration and output enumeration are different proof strategies

Two broad strategies can establish useful closure:

### 10.1 Output closure

Prove that every material membership object/output in a closed namespace has been enumerated under a trustworthy snapshot/consistency model.

This can work when the substrate provides a well-defined authoritative collection and its completeness semantics are known.

### 10.2 Authority closure

Prove which principals/controllers/providers are capable of introducing membership and qualify the outputs/delegations from each.

This is needed when outputs are partitioned, delegated, cached, provider-internal or independently administered.

Neither dominates universally.

`complete output snapshot may substitute for producer enumeration only when snapshot completeness itself is proven`.

`all known producers listed != all outputs captured if producer output can persist elsewhere`.

## 11. Discovery-of-authorities cannot bootstrap from the same incomplete source

A circular proof is invalid:

```text
source S says these are all membership authorities
therefore S is complete because it listed itself and peers
```

Candidate rule:

`source completeness cannot be established solely by the source whose completeness is in question`.

Qualification can instead come from a stronger administrative boundary, structural namespace restriction, independently verifiable policy, target-side invariant, or explicit provider contract. No single mechanism is mandated.

## 12. Merge and precedence semantics are part of closure

Knowing all sources is insufficient if their outputs compose differently from what the proof assumes.

Possible semantics include:

- union;
- priority/fallback;
- first-match;
- intersection;
- override/replace;
- shadowing;
- conditional/emergency activation;
- delegated resolution.

Thus:

`all sources known + merge semantics unknown != effective membership known`.

A lower-priority source may still be material under failover. A source whose output is shadowed in steady state can become active after another source disappears.

## 13. Emergency and break-glass paths are first-class membership authorities

An emergency route, operator override, provider disaster path or break-glass attachment is not irrelevant merely because dormant.

`dormant authority != absent authority`.

For a protected effect, either the emergency source is included in closure and qualified, structurally unable to reach the effect, or the proof declares the resulting uncertainty/incompatibility.

Availability pressure cannot silently widen membership semantics.

## 14. Structural target invariants can collapse source-completeness requirements

The strongest portability result remains the commitment-adjacent invariant from prior route-assurance research.

If every effect-capable target enforces a qualified invariant that is independent of upstream route membership, then the proof may not need to enumerate every upstream membership authority for that guarantee.

`universal target invariant -> some upstream source incompleteness can be irrelevant`.

But the coverage proof must include every effect-capable target or establish structural exclusion of bypass targets.

`unknown upstream source + possible bypass around target gate -> closure not proven`.

This is how G4 can avoid a mandatory central topology inventory while retaining strong assurance.

## 15. Negative evidence and silence remain asymmetric

Useful defeating evidence includes:

- unexpected member observed in a trace;
- new EndpointSlice manager identity;
- new Gateway parent/controller attachment;
- DNS/SVCB delegation to a new endpoint/operator;
- alternative-service cache entry not represented in the proof;
- emergency route activation;
- provider callback/redirection to an unqualified target.

Any can defeat a narrower closure claim.

But:

`no unexpected member observed != no undiscovered membership authority exists`.

`no change event received != authority set unchanged`.

Finite observation cannot prove a negative capability unless tied to a structural/administrative exclusion claim.

## 16. Source currentness is vector-valued

There is no need for a synthetic global discovery revision.

Candidate vector:

```text
MembershipSourceCurrentnessVector
  administrativeAuthorityEvidence
  discoveryNamespaceEvidence
  routeAttachmentEvidence
  nameBindingEvidence
  providerRoutingEvidence
  emergencyOverrideEvidence
  persistedAlternativeEvidence
  inFlightDrainEvidence
  structuralExclusionEvidence
```

Each component has its own horizon/floor and may be irrelevant for a particular guarantee when a stronger invariant subsumes it.

`all source revisions individually fresh != composed source closure valid` unless merge/delegation assumptions also remain satisfied.

## 17. Selective requalification

A newly discovered authority should not invalidate unrelated proofs globally.

Candidate dependency chain:

```text
ComposedRouteAssuranceRef
  -> MembershipSourceClosureClaim
  -> MembershipAuthorityRefs[]
  -> outputs/delegations/merge semantics
  -> protected guarantee dimensions
```

A new DNS alternative endpoint may matter to reachability and identity but not to an invariant enforced universally at the target. A new gateway parent may matter to tenant-context integrity even if the target set is unchanged.

`new source != every guarantee invalid`.

`new material source without qualification != dependent proof current`.

## 18. Shared Semantic Kernel / Exchange Plane boundary

Candidate Shared Semantic Kernel primitives remain structural only:

- qualified refs to authority/evidence/currentness;
- relation/delegation refs;
- source-closure disposition refs;
- provenance and revision/time qualifiers.

They must not encode Kubernetes controllers, DNS zones, Gateway objects or provider routing as universal business entities.

The Capability Exchange Plane may carry:

- membership-source closure references;
- source/delegation/currentness evidence;
- merge/precedence semantics references;
- counterexample/bypass findings;
- target-invariant/exclusion evidence;
- transition and drain evidence.

It does not own:

- discovery namespaces;
- DNS authority;
- gateway/controller ownership;
- provider routing;
- emergency routing policy;
- canonical business authorization;
- a global topology/source registry.

`Exchange Plane carries source-closure evidence != Exchange Plane becomes discovery authority`.

## 19. Candidate dispositions

- `SOURCE_CLOSURE_PROVEN` — every material membership-introducing authority/delegation is qualified or structurally irrelevant for the protected guarantee.
- `SOURCE_CLOSURE_TARGET_INVARIANT` — upstream source completeness is intentionally incomplete but a universal commitment-adjacent invariant makes the missing source dimensions irrelevant.
- `SOURCE_CLOSURE_PARTIAL` — known sources are qualified but completeness assumptions remain bounded/incomplete.
- `SOURCE_CLOSURE_UNKNOWN` — material source completeness cannot currently be established.
- `SOURCE_CLOSURE_CONTESTED` — counterexample evidence conflicts with the asserted closure.
- `SOURCE_CLOSURE_INCOMPATIBLE` — topology/provider model cannot satisfy the required closure for the protected effect.

These are research vocabulary, not approved schemas.

## 20. Proof obligations

1. Every route/composition proof names whether it depends on member closure, membership-source closure, or a stronger target invariant.
2. All known members being qualified does not by itself prove that all membership-introducing authorities are accounted for.
3. Source closure is scoped to a protected effect/guarantee rather than a universal platform topology.
4. Every material authority that can introduce, delegate, reactivate or preserve membership is included or proven irrelevant/structurally excluded.
5. Enumeration of one controller's outputs does not prove closure when other controllers/operators may produce additional membership objects.
6. A complete output snapshot substitutes for producer enumeration only when snapshot completeness semantics are themselves proven.
7. Authority enumeration does not prove output closure when outputs can persist in caches, connections, queues or downstream delegated stores.
8. Manager/source identity proves provenance, not semantic admissibility of introduced members.
9. Controller status/visibility is not promoted to global attachment truth beyond its declared scope.
10. Absence from one controller's status is not proof of non-attachment by another authority.
11. Delegated discovery/binding authority is followed transitively when it can introduce material endpoints.
12. Delegation of endpoint selection does not imply delegation of business authority or semantic equivalence.
13. Merge/precedence/fallback semantics between sources are part of the proof.
14. A dormant lower-priority or emergency source remains material if it can become active under failure conditions.
15. Break-glass/emergency membership cannot silently bypass protected invariants for availability.
16. Source-completeness claims cannot bootstrap solely from the source whose completeness is being asserted.
17. A positive unexpected member/source is defeating evidence for incompatible closure claims.
18. Finite non-observation is not proof that an unobserved source cannot introduce membership.
19. Source silence, missing events or stale watches remain representable as currentness loss/UNKNOWN rather than false stability.
20. New-admission source closure and in-flight/persisted membership closure remain distinct.
21. Expiry/revocation of a discovery source does not imply previously introduced connections/paths are drained or fenced.
22. Source currentness remains vector-valued; no synthetic global discovery revision is required.
23. Requalification follows material proof dependency rather than global invalidation.
24. A universal commitment-adjacent invariant may make upstream source incompleteness irrelevant only when every effect-capable path is covered or bypass is structurally excluded.
25. Reachability-source closure and context-preservation-source closure remain independent dimensions.
26. Drivers/adapters/gateways may report source capabilities but cannot fabricate source completeness from unsupported provider claims.
27. Runtime-local verification remains possible without Builder/central Exchange Plane availability when locally retained source/invariant evidence satisfies declared horizons.
28. Historical effect evidence preserves the source-closure disposition applicable at commitment time.
29. Shared Semantic Kernel primitives remain domain-neutral and do not turn discovery/provider objects into shared business entities.
30. Exchange Plane transports/relates source evidence but does not become a global discovery, DNS, gateway or routing authority.

## 21. Adversarial cases

1. Runtime watches only EndpointSlices managed by the default controller; a mesh controller adds another Service-labeled slice.
2. All known slices are read, but a manual operator can create another slice and the proof ignores that authority.
3. One EndpointSlice list page/watch stream is mistaken for a complete multi-slice snapshot.
4. `managed-by` is authenticated/provenanced and incorrectly treated as authorization for the protected effect.
5. Gateway controller A reports no parent attachment; controller B owns another parent and accepts the same Route.
6. A parent is invisible to the controller producing status, and absence is interpreted as non-attachment.
7. DNS SVCB AliasMode delegates to another name whose endpoint operators are absent from closure.
8. SVCB returns alternative endpoints operated by different entities and the adapter assumes capability equivalence from common origin identity.
9. Successive DNS answers expose different hosting environments while a cached proof assumes one static endpoint set.
10. An HTTP alternative service remains on an existing connection after freshness expires; source expiry is treated as path drain.
11. Alternative-service authority advertises a new target that bypasses a gateway assumed mandatory.
12. Emergency route is dormant during all tests and omitted from source closure.
13. Provider disaster routing activates an undocumented/opaque authority and the system interprets no prior trace as non-reachability.
14. A source is lower priority but becomes active when the preferred source fails; steady-state proof omits it.
15. Two sources are known but union semantics are assumed while actual semantics are override/first-match.
16. A source is removed from desired configuration while its introduced connections remain alive.
17. Callback/redirection introduces a target not present in request-time discovery.
18. Mesh service discovery and DNS both provide endpoints; only one is included in proof lineage.
19. Target registration API is writable by another principal that is not represented as a membership authority.
20. Break-glass operator can attach a route directly to the target and bypass normal discovery/gateway chains.
21. Source-completeness scanner learns its list of authorities only from the same incomplete registry it is validating.
22. New controller is installed with permission to create membership objects; no member exists yet, so the proof fails to detect expanded introduction capability.
23. All sources are fresh individually, but delegation/precedence semantics changed and effective membership differs.
24. A trace observes only qualified targets for months and is used as proof that no other authority/path exists.
25. Unexpected source appears, but stale configuration evidence is allowed to overwrite the defeating finding.
26. Upstream source inventory is incomplete but every target has a strong gate; proof unnecessarily fails globally instead of using target-invariant disposition.
27. Upstream source inventory is incomplete and one emergency target bypasses the target gate; target-invariant disposition is falsely asserted.
28. Exchange Plane accumulates all discovery data and becomes a mandatory global topology oracle, breaking runtime autonomy.
29. Shared kernel grows provider-specific discovery entities and becomes a shared infrastructure/business model.
30. Driver normalizes `not returned by API` into `cannot be introduced`, fabricating structural exclusion.

## 22. Trade-offs

### Central inventory

Benefit: convenient operational visibility and faster requalification.

Risk: false completeness, availability coupling and accidental topology authority.

Research position: useful projection/evidence cache, never sufficient merely by centrality.

### Target-side universal invariant

Benefit: drastically reduces dependence on complete upstream discovery-source enumeration.

Cost: requires strong coverage at every effect-capable commitment path and can be unavailable for some external providers.

Research position: preferred when naturally enforceable, not mandatory.

### Conservative UNKNOWN on incomplete source closure

Benefit: avoids false safety.

Cost: can reduce availability for protected effects.

Research position: effect/guarantee scoped; lower-risk operations may have different admissibility horizons/contracts.

### Provider contract/attestation

Benefit: can qualify otherwise opaque internal source closure.

Risk: contract authenticity does not imply semantic completeness or currentness outside declared scope.

Research position: one evidence class, not universal oracle.

## 23. Portability / exit path

The portable abstraction is not Kubernetes EndpointSlice, Gateway API, DNS SVCB, Alt-Svc or any provider routing product. It is:

- material membership-introduction authority;
- source scope and delegation;
- merge/precedence semantics;
- currentness and persistence/drain behavior;
- structural exclusion or target-invariant substitution;
- defeating/counterexample evidence;
- proof dependency and disposition.

A future implementation can replace discovery/gateway/provider technologies if these proof obligations remain expressible and the replacement does not fabricate closure.

## 24. Deduplication against existing G4 research

This round does **not** reopen:

- generic service discovery;
- member-level mutable composition;
- fixed-chain composed route assurance;
- opaque provider route-set assurance;
- provider semantic drift/rollout skew;
- retry/idempotency semantics;
- complete mediation generally;
- authorization delegation generally.

Material delta:

`mutable composition membership -> who can introduce membership -> output closure vs authority closure -> delegated discovery authority -> merge/fallback semantics -> target-invariant substitution -> source-completeness proof without global inventory`.

## 25. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This materially changes the route-assurance boundary: a composition proof now needs not only member/transition currentness but a qualified account of the **authorities capable of widening membership**, unless a stronger target-side invariant makes that dimension irrelevant.

The next highest-value gap is **membership-authority delegation/revocation under cached and in-flight discovery state**: how revoking a controller, DNS/service-binding delegate, gateway attachment authority or provider routing authority becomes effective for new and already-introduced paths, including stale caches, persistent connections and emergency authority, without equating source revocation with effect-path fencing and without requiring a central discovery oracle.
