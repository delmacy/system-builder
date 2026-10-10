# G4 Capability Exchange — Composed Route Assurance Across Independent Intermediaries

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a cloud, gateway, mesh, broker, load balancer, identity system, routing product or implementation technology; it does not reopen G3 or authorize product work.

## 1. Research question

The preceding opaque-route-set round established that route closure is an assurance claim, not merely an inventory claim, and that negative reachability requires positive structural exclusion. The remaining high-value gap is composition: one protected effect can cross client discovery, enterprise gateway, service mesh, provider edge, SaaS routing and target-local routing, each independently administered and each exposing evidence with different scope, currentness and failure semantics.

The question is how route-assurance evidence composes end to end without allowing a weaker downstream intermediary to silently widen an effect route that an upstream layer had already qualified, and without making the Capability Exchange Plane a global topology authority.

Core boundaries:

`layer-local closure != end-to-end closure`.

`upstream narrowing + downstream widening != preserved route constraint`.

`same logical destination != same assured commitment locus`.

## 2. Evidence reviewed

Primary standards/documentation and mature-system failure evidence:

- NIST SP 800-207 defines the Policy Enforcement Point (PEP) as the component that actually enables, monitors and terminates subject-resource connections and notes that the logical PEP can be split between client-side and resource-side components. This supports distributed enforcement without requiring one central gateway. <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf>
- NIST SP 800-207A extends zero-trust access control to multi-cloud/cloud-native environments and explicitly discusses API gateways, sidecar proxies and application identity infrastructure as cooperating enforcement mechanisms across locations. <https://csrc.nist.gov/pubs/sp/800/207/a/final>
- AWS CloudFront origin failover forwards a request from primary to secondary origin only for configured failure conditions, and only for GET/HEAD/OPTIONS. This is a concrete example where a route-expansion relation is conditional on method and response/failure state rather than a static backend set. <https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html>
- Azure Front Door documents that if all origins in an origin group fail health probes, it treats all as unhealthy and round-robins across all of them. Thus one intermediary can widen traffic precisely under degraded conditions unless a stronger downstream invariant prevents unsafe commitment. <https://learn.microsoft.com/en-us/azure/frontdoor/health-probes>
- Google Cloud Service Mesh documents automatic cross-cluster failover and also warns that VirtualService subsets can override automatic locality failover behavior. Configuration layers can therefore interact non-monotonically; a higher-level routing expectation is not automatically preserved by a lower-level rule. <https://docs.cloud.google.com/service-mesh/docs/operate-and-maintain/multi-cluster-mesh-failover>
- Google Cloud Service Mesh troubleshooting documentation notes that multiple VirtualServices for the same host are merged and route ordering affects first-match behavior, while locality load balancing can move traffic to failover zones. This is mature evidence that independently authored policy fragments can compose into behavior not inferable from one fragment alone. <https://docs.cloud.google.com/service-mesh/docs/troubleshooting/troubleshoot-traffic>
- Kubernetes Gateway API BackendTLSPolicy distinguishes Core/Extended behavior from implementation-specific behavior and requires unsupported/invalid configuration to be reflected in status for the standardized case. This is useful evidence that portability requires explicit support/coverage claims rather than assuming every implementation interprets a boundary mechanism identically. <https://gateway-api.sigs.k8s.io/reference/api-spec/1.4/spec/>
- Assume-guarantee reasoning literature provides the general compositional principle: system-level properties can be derived from component contracts only when each component's assumptions are discharged by its environment and its guarantees are strong enough for the next composition step. This research uses the principle, not any specific formalism or solver. Representative evidence: Luckcuck et al., "A Compositional Approach to Verifying Modular Robotic Systems" (2022), <https://arxiv.org/abs/2208.05507>.

These systems are benchmarks only; none is selected.

## 3. Material finding: route assurance is a chain of scoped transformations

A route intermediary does not merely expose a set of targets. It transforms an incoming route constraint/evidence state into an outgoing set of possible next hops under declared conditions.

Candidate abstraction:

```text
RouteAssuranceSegment
  segmentRef
  administrativeDomainRef
  protectedEffectRef
  inputRouteConstraintRef
  routeTransformationKind
  outputReachabilityClaimRef
  enforcementOrExclusionRefs[]
  metadataPreservationClaimRef
  failureModesCovered[]
  failureModesNotCovered[]
  retryFailoverHedgeBehaviorRef
  evidenceRefs[]
  currentnessHorizon
  assumptions[]
  guarantees[]
  resultingDisposition
```

The important relation is not `segment A is healthy`; it is whether A preserves, narrows or widens the route-assurance envelope needed by the protected effect.

Candidate transformation classes:

- `NARROWING` — every output route remains inside the qualified input envelope;
- `PRESERVING` — output may change operationally but remains guarantee-equivalent for the protected effect;
- `WIDENING_QUALIFIED` — new loci become reachable and are independently qualified before commitment;
- `WIDENING_UNQUALIFIED` — new loci become reachable without sufficient assurance;
- `OPAQUE_BOUNDED` — exact internal route is unknown but a stronger invariant/exclusion bounds all effect-capable outputs;
- `OPAQUE_UNBOUNDED` — neither target closure nor a stronger invariant is proven;
- `TERMINATING` — the segment itself contains the commitment boundary and enforces the required invariant.

`same protocol surface != preserving route transformation`.

## 4. Assume-guarantee composition without a universal topology model

The useful compositional pattern is:

```text
Segment i assumes Ai
Segment i guarantees Gi
Gi must discharge the material assumptions of Segment i+1
...
Final guarantee must imply the protected effect invariant before commitment
```

For route assurance, assumptions can include:

- input target class is already constrained;
- tenant/classification/authority metadata is present and authenticated;
- retry budget is bounded;
- downstream endpoint identity is verified;
- a target-side gate exists;
- provider fail-open semantics are excluded;
- semantic generation/currentness floor is at least F.

Guarantees can include:

- no widening outside class C;
- any widening remains within equivalence class Q;
- metadata M is integrity-preserved;
- retries preserve stable effect identity;
- unqualified targets cannot commit E;
- route uncertainty terminates as failure/defer rather than fail-open.

A composition proof is valid only when assumptions are actually discharged. Merely concatenating certificates/evidence from each layer does not establish end-to-end closure.

`evidence aggregation != compositional proof`.

## 5. The weakest segment is not always the whole answer

A simplistic `end-to-end assurance = minimum(layer assurance)` rule is too coarse.

A weak routing layer can be rendered irrelevant to a particular protected effect if a stronger downstream structural invariant prevents unsafe commitment at every target it could reach. Conversely, a strong upstream gateway can be defeated by a downstream layer that widens the route after the gateway's target qualification.

Therefore materiality follows the protected invariant and commitment boundary:

`weak intermediary + universal target invariant may still be safe`.

`strong intermediary + downstream unbounded widening may be unsafe`.

This preserves the earlier principle that target-side enforcement can substitute for topology omniscience when it truly covers every effect-capable target.

## 6. Administrative independence is a proof boundary

When intermediaries are administered by different teams/providers/trust domains, one layer cannot silently inherit another layer's evidence scope.

Candidate rule:

`administrative adjacency != shared assurance authority`.

Each segment's evidence remains qualified by:

- issuer/provenance;
- administrative/trust domain;
- configuration/revision identity where available;
- currentness horizon;
- protected effect and route class;
- failure modes covered;
- assumptions about neighboring segments.

A gateway team may attest `no route outside cluster class C`, while a SaaS provider may attest only `requests reaching service S are authorization-checked before mutation`. These can compose if the latter guarantee makes the hidden internal topology irrelevant to the protected effect. They must not be flattened into one fictional global route revision.

## 7. Widening is contagious until requalified or terminated

Once a segment introduces an unqualified possible target, later evidence cannot pretend that widening never occurred. It must either:

1. prove the widened targets satisfy the required guarantee;
2. structurally exclude unsafe commitment on those targets;
3. re-constrain the route before any protected commitment;
4. defer/fail the effect; or
5. mark the composition `PARTIAL/UNKNOWN/INCOMPATIBLE`.

Candidate rule:

`unqualified widening -> explicit requalification obligation`.

This is especially important for retries, hedging and failover. A request admitted for A can be retried through B by a lower layer; if B is not in the qualified class, upstream evidence is no longer sufficient.

## 8. Conditional route transformations are first-class

AWS CloudFront's origin failover demonstrates that widening can depend on method, status code, timeout or connection failure. Google Cloud Service Mesh demonstrates that locality failover can depend on endpoint health/capacity and can be overridden by subset routing. Azure Front Door demonstrates a special all-unhealthy behavior.

Therefore a segment guarantee must include the condition space under which it holds.

`normal-path preserving != failure-path preserving`.

Candidate conditional dimensions include:

- HTTP/RPC method or interaction kind;
- error/status class;
- timeout/connectivity state;
- health/capacity state;
- retry attempt number;
- locality/region availability;
- subset/version selection;
- control-plane staleness;
- emergency/fail-open mode.

A route proof that covers only nominal conditions cannot be reused as a degraded-mode proof.

## 9. Metadata preservation composes separately from reachability

Even if every route target is safe, an intermediary can still invalidate the effect contract by dropping or rewriting material context such as tenant, classification, authority, provenance, semantic generation, effect identity or currentness evidence.

Thus route composition has at least two independent dimensions:

1. **reachability assurance** — where attempts can go and where effects can commit;
2. **context-preservation assurance** — whether the target receives trustworthy context required to enforce the invariant.

`safe target reachable != safe effect if required context was lost`.

A service mesh proving mTLS workload identity does not prove that tenant/classification/business-authority metadata survived a preceding gateway. Conversely, preserved metadata does not prove that the route cannot reach an unqualified target.

## 10. Identity continuity does not equal route assurance

NIST SP 800-207/207A support distributed identity-aware enforcement, but identity remains one input to the protected decision.

Candidate rule:

`authenticated next hop != qualified effect locus`.

A chain of mutually authenticated proxies can still route to a semantically incompatible generation or to a target lacking the required business-effect gate. Identity evidence can discharge an assumption such as `next hop belongs to trust class T`; it does not automatically discharge `target can safely commit E`.

## 11. Conformance and implementation-specific behavior

Kubernetes Gateway API's distinction between standardized support and implementation-specific behavior is a useful portability lesson. A generic route-assurance contract may name semantic obligations, but a driver/adapter must qualify whether a concrete implementation actually supplies the required mechanism and coverage.

`standard-shaped configuration != standard guarantee`.

Implementation-specific features can participate only with explicit mechanism evidence, limitations and currentness. Lack of conformance coverage remains visible; the driver must not normalize it into a stronger portable claim.

## 12. Candidate composition object

A technology-independent proof object may need to preserve the chain rather than collapse it:

```text
ComposedRouteAssuranceRef
  protectedEffectRef
  commitmentBoundaryRef
  routeAssuranceSegmentRefs[]
  initialConstraintRef
  terminalInvariantRef
  dischargedAssumptionRefs[]
  unresolvedAssumptionRefs[]
  wideningRefs[]
  requalificationRefs[]
  structuralExclusionRefs[]
  metadataPreservationRefs[]
  retryFailoverLineageRef
  evidenceCurrentnessVectorRef
  counterexampleRefs[]
  resultingDisposition
```

Candidate dispositions:

- `COMPOSED_PROVEN`
- `COMPOSED_WITH_TARGET_INVARIANT`
- `COMPOSED_WITH_REQUALIFICATION`
- `PARTIAL`
- `UNKNOWN`
- `CONTESTED`
- `INCOMPATIBLE`

This remains research vocabulary, not an approved schema.

## 13. Currentness is vector-valued

Each independently administered segment can age or change independently. A route composition therefore cannot safely use one global TTL or revision.

`one stale segment != every segment stale`.

`one fresh segment != composition current`.

Candidate currentness relation:

```text
composition current for effect E
  iff every material segment/evidence dependency
      satisfies its own required floor/horizon
      OR is proven irrelevant by a stronger invariant/exclusion
```

A provider route change should selectively requalify dependent compositions, not globally invalidate unrelated routes. Conversely, an upstream configuration remaining unchanged cannot mask a downstream provider semantic change.

## 14. Counterexamples defeat only the claims they contradict

An observed unexpected route at segment B is strong defeating evidence for any claim that B could not widen that way. It does not automatically invalidate unrelated segments or prove every target unsafe.

Candidate rule:

`counterexample scope follows contradicted assurance claim`.

This supports bounded reconciliation rather than global panic while preserving monotonic safety floors: older evidence cannot silently erase a newer observed bypass without explicit successor/reconciliation evidence.

## 15. Exchange Plane boundary

The Capability Exchange Plane may carry:

- segment assurance references;
- route constraints;
- effect/attempt identity;
- tenant/classification/authority/provenance/currentness context;
- widening/requalification evidence;
- counterexamples and reconciliation state.

It does not own:

- the business effect;
- each intermediary's topology;
- provider health truth;
- business authorization;
- the final route decision;
- a universal route graph.

`Exchange Plane composes exchange evidence != Exchange Plane owns topology`.

No central proxy or global routing oracle is required when locally sufficient segment evidence and commitment-adjacent invariants close the proof.

## 16. Proof obligations

1. Every material intermediary is represented as a scoped route transformation or proven irrelevant to the protected effect.
2. Layer-local closure is never promoted directly to end-to-end closure.
3. Every segment declares assumptions and guarantees sufficient to evaluate composition.
4. Material assumptions of each segment are discharged by upstream/downstream evidence or remain explicitly unresolved.
5. Downstream widening after upstream qualification creates a requalification obligation.
6. Widening is not hidden by a common interface, hostname, service name or provider identity.
7. Conditional/failure-path transformations are included in the composition scope.
8. Retry, hedge, failover and service-local rerouting preserve attempt/effect lineage.
9. A target-side universal invariant may make hidden route details irrelevant only if every effect-capable target is covered.
10. Structural exclusion evidence names its enforcement boundary and bypass/failure-mode coverage.
11. Independently administered segments retain distinct provenance/trust/currentness domains.
12. No synthetic global route revision is fabricated from heterogeneous segment revisions.
13. Context-preservation proof is independent from reachability proof.
14. Tenant/classification/authority/provenance/currentness/effect identity survive every segment where required.
15. Workload/next-hop identity does not substitute for business-effect qualification.
16. Provider/implementation-specific mechanisms are not promoted to portable guarantees without explicit qualification.
17. Conformance coverage and implementation-specific gaps remain visible in evidence.
18. One stale material segment can lower the composition even when other segments are fresh.
19. Stronger downstream enforcement may render an upstream routing weakness irrelevant only with an explicit implication proof.
20. An observed bypass defeats incompatible exclusion/preservation claims and cannot be erased by older configuration evidence.
21. Counterexample invalidation is scoped to materially dependent compositions.
22. Route composition is protected-effect/invariant scoped; one composition need not govern every operation.
23. Authorization-safe routing and duplicate-effect safety remain separate proof dimensions.
24. A segment that can fail open under degraded conditions cannot be represented as preserving under those conditions unless another invariant closes the gap.
25. Queue/defer without effect remains distinct from successful end-to-end authorization.
26. Runtime autonomy is preserved: locally sufficient composed evidence may be verified without Builder/central Exchange Plane availability.
27. Adapter/driver/gateway/controller roles remain bounded; none can fabricate semantic equivalence from unsupported mechanism evidence.
28. Historical effect evidence retains the composition/evidence disposition applicable at commitment time.

## 17. Adversarial cases

1. Enterprise gateway pins cluster A; service mesh retries into cluster B.
2. Mesh constrains region, but provider edge has undocumented emergency cross-region fallback.
3. Every segment individually reports `healthy`, yet no segment proves the final target enforces the business-effect gate.
4. Upstream gateway preserves tenant metadata; downstream adapter drops it before target authorization.
5. All hops use mTLS, but the final target runs an incompatible semantic generation.
6. Gateway team assumes SaaS internal routing is closed because only one hostname is exposed.
7. SaaS provider attests target-side authorization, but the attestation excludes asynchronous/background effect workers.
8. CloudFront-style failover is safe for GET but the same proof is reused for a mutating interaction.
9. Front Door-style all-unhealthy behavior widens to origins excluded from nominal assurance.
10. Mesh subset routing overrides the failover behavior assumed by another administrator.
11. Two independently managed VirtualService-like fragments merge and first-match ordering changes the effective route.
12. An implementation-specific Gateway feature is treated as if covered by standard conformance.
13. Retry budget is reset at every intermediary, creating more route attempts than the end-to-end contract permits.
14. Upstream route proof is fresh; downstream provider evidence is expired but the composition is marked current.
15. Downstream structural gate is assumed universal but one recovery/break-glass path bypasses it.
16. Target-side authorization is universal, but duplicate-effect fencing is not shared across loci.
17. A segment narrows normal traffic but fails open during control-plane outage.
18. One intermediary rewrites effect identity, defeating downstream dedup despite safe reachability.
19. Route counterexample at B triggers global invalidation of unrelated compositions, causing needless centralization/outage.
20. Old gateway evidence is restored after a bypass was already observed, rolling back the local assurance floor.
21. Exchange Plane is made mandatory for every hop merely because evidence is heterogeneous.
22. Gateway becomes owner of business workflow to compensate for weak downstream route evidence.
23. Driver reports `preserving` because input/output protocol is identical while target class widened.
24. Provider identity is stable but account/region/semantic locus changes underneath a global endpoint.
25. A target gate validates workload identity but not tenant/classification/currentness required by the effect.
26. Each team signs its own local evidence; the combined assumptions are mutually inconsistent.
27. Route set is safe only if two independently administered exclusions both hold, but currentness of one expires unnoticed.
28. A queue accepts work under incomplete composition and reports success although no protected effect was admissible.

## 18. Decision criteria

For a protected effect crossing multiple intermediaries:

1. identify the protected effect and commitment boundary;
2. enumerate material routing/enforcement segments without claiming hidden topology completeness;
3. model each segment as a transformation with assumptions, guarantees and failure conditions;
4. determine whether it narrows, preserves, widens or leaves route assurance opaque;
5. trace tenant/classification/authority/provenance/currentness/effect identity separately from reachability;
6. discharge each segment's assumptions using qualified neighboring evidence;
7. whenever a segment widens, qualify the new loci, structurally exclude unsafe commitment, or re-constrain before commitment;
8. use a universal target-side invariant when it is stronger and more reliable than topology reconstruction;
9. preserve per-segment provenance and currentness rather than synthesizing a global route revision;
10. degrade only materially dependent compositions when evidence expires or a counterexample appears;
11. if unresolved widening can reach an unqualified commitment locus, defer/fail or mark the topology incompatible for that guarantee;
12. do not centralize merely to simplify the proof if distributed evidence/enforcement already closes it.

## 19. Portability / exit path

Portable concepts are:

- protected effect and commitment boundary;
- route-assurance segment;
- assumption/guarantee relation;
- narrowing/preserving/widening transformation;
- structural exclusion;
- target-side invariant;
- metadata/context preservation;
- conditional failure-path coverage;
- per-segment currentness/provenance;
- counterexample-scoped requalification;
- composed assurance disposition.

They do not require Envoy, Istio, Kubernetes Gateway API, AWS, Azure, Google Cloud, HTTP/gRPC, DNS, a broker, service mesh or a central proxy.

Changing one intermediary should require requalifying only the mechanism-specific segment and dependent compositions unless the protected contract itself changes.

## 20. Deduplication and maturity

This round does not reopen generic routing, opaque route-set discovery, complete mediation, service-mesh governance, retry/idempotency, provider semantic drift, rollout skew, split-brain or degraded-mode research.

Material delta:

`opaque route-set assurance -> independently administered route segments -> assume/guarantee route transformations -> explicit widening/requalification -> separate context-preservation dimension -> per-segment currentness and counterexample scope -> end-to-end assurance without a global topology oracle`.

Maturity remains `RESEARCH_ACTIVE / NON_EXECUTABLE`. The family is not saturated.

## 21. Next highest-value gap

The next gap is **route-assurance proof under mutable composition membership**: intermediaries can be inserted, bypassed or reordered dynamically by service discovery, sidecar/ambient migration, gateway chaining, emergency routing or provider evolution. Research should determine how a runtime detects that the *composition graph itself* changed, which prior segment proofs survive, and when a new path requires requalification before effect commitment — without requiring every topology change to be centrally serialized or making observed path traces the sole authority.